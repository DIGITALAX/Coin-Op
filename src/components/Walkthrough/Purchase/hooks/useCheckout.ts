import { CartItem } from "@/components/Common/types/common.types";
import { useEffect, useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { serialize } from "@ethersproject/transactions";
import { setMessagesModal } from "../../../../../redux/reducers/messagesModalSlice";
import { joinSignature } from "@ethersproject/bytes";
import { SiweMessage } from "siwe";
import { useAccount } from "wagmi";
import {
  ACCEPTED_TOKENS,
  ACCEPTED_TOKENS_MUMBAI,
  COIN_OP_MARKET,
  COIN_OP_ORACLE,
  IPFS_CID_PKP,
  PKP_ADDRESS,
  PKP_PUBLIC_KEY,
} from "../../../../../lib/constants";
import { BigNumber, ethers } from "ethers";
import CoinOpMarketABI from "../../../../../abis/CoinOpMarket.json";
import { RootState } from "../../../../../redux/store";
import { setCart } from "../../../../../redux/reducers/cartSlice";
import { useRouter } from "next/router";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { polygonMumbai, polygon } from "viem/chains";
import { getOrders } from "../../../../../graphql/subgraph/queries/getOrders";
import { encryptItems } from "../../../../../lib/subgraph/helpers/encryptItems";
import { setModalOpen } from "../../../../../redux/reducers/modalOpenSlice";

const useCheckout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });

  const stripe = useStripe();
  const elements = useElements();
  const cartItems = useSelector(
    (state: RootState) => state.app.cartReducer.value
  );
  const litClient = useSelector(
    (state: RootState) => state.app.litClientReducer.value
  );
  const currentPKP = useSelector(
    (state: RootState) => state.app.currentPKPReducer.value
  );
  const [approved, setApproved] = useState<boolean>(false);
  const [cartItem, setCartItem] = useState<CartItem | undefined>();
  const [startIndex, setStartIndex] = useState<number>(0);
  const [paymentType, setPaymentType] = useState<string>("crypto");
  const [oracleValue, setOracleValue] = useState<number>(1);
  const [cryptoCheckoutLoading, setCryptoCheckoutLoading] =
    useState<boolean>(false);
  const [fiatCheckoutLoading, setFiatCheckoutLoading] =
    useState<boolean>(false);
  const [checkoutCurrency, setCheckoutCurrency] = useState<string>("USDT");
  const [totalAmount, setTotalAmount] = useState<number>(
    cartItems?.length > 0
      ? cartItems?.reduce(
          (accumulator, currentItem) =>
            accumulator + (currentItem.price * currentItem.amount) / 10 ** 18,
          0
        )
      : 0
  );
  const [fulfillmentDetails, setFulfillmentDetails] = useState<{
    name: string;
    contact: string;
    address: string;
    zip: string;
    city: string;
    state: string;
    country: string;
  }>({
    name: "",
    contact: "",
    address: "",
    zip: "",
    city: "",
    state: "",
    country: "",
  });

  const getAddressApproved = async () => {
    if (!address) return;
    try {
      const data = await publicClient.readContract({
        address: ACCEPTED_TOKENS.find(
          ([_, token]) => token === checkoutCurrency
        )?.[2].toLowerCase() as `0x${string}`,
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
            ],
            name: "allowance",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        functionName: "allowance",
        args: [address as `0x${string}`, COIN_OP_MARKET],
      });

      if (
        Number(data as BigNumber) /
          ((ACCEPTED_TOKENS.find(
            ([_, token]) => token === checkoutCurrency
          )?.[2] as `0x${string}`) ===
          "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
            ? 10 ** 6
            : 10 ** 18) >=
        totalAmount
      ) {
        setApproved(true);
      } else {
        setApproved(false);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getTotalAmount = async () => {
    if (cartItems.length < 1) {
      setTotalAmount(0);
    } else {
      const total = cartItems?.reduce(
        (accumulator, currentItem) =>
          accumulator + (currentItem.price * currentItem.amount) / 10 ** 18,
        0
      );

      const data = await publicClient.readContract({
        address: COIN_OP_ORACLE.toLowerCase() as `0x${string}`,
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "_tokenAddress",
                type: "address",
              },
            ],
            name: "getRateByAddress",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        functionName: "getRateByAddress",
        args: [
          ACCEPTED_TOKENS.find(
            ([_, token]) => token === checkoutCurrency
          )?.[2].toLowerCase(),
        ],
      });

      if (data) {
        const oracle = Number(data as BigNumber) / 10 ** 18;
        setOracleValue(oracle);
        setTotalAmount(Number(total) / Number(oracle));
      }
    }
  };

  const handleCheckoutFiat = async () => {
    if (!stripe || !elements || !currentPKP) {
      return;
    }

    if (
      fulfillmentDetails.address.trim() === "" ||
      fulfillmentDetails.city.trim() === "" ||
      fulfillmentDetails.contact.trim() === "" ||
      fulfillmentDetails.country.trim() === "" ||
      fulfillmentDetails.name.trim() === "" ||
      fulfillmentDetails.state.trim() === "" ||
      fulfillmentDetails.zip.trim() === ""
    ) {
      dispatch(
        setModalOpen({
          actionOpen: true,
          actionMessage: "Fill out your Contact & Shipment details first.",
        })
      );
      return;
    }
    setFiatCheckoutLoading(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `/account"`,
        },
      });

      await createPKPOrder();

      if (error.type === "card_error" || error.type === "validation_error") {
        dispatch(
          setMessagesModal({
            actionOpen: true,
            actionMessage: error.message,
          })
        );
      } else {
        dispatch(
          setMessagesModal({
            actionOpen: true,
            actionMessage: "An unexpected error occurred.",
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setFiatCheckoutLoading(false);
  };

  const handleApproveSpend = async () => {
    setCryptoCheckoutLoading(true);
    try {
      const { request } = await publicClient.simulateContract({
        address: ACCEPTED_TOKENS.find(
          ([_, token]) => token === checkoutCurrency
        )?.[2]!.toLowerCase() as `0x${string}`,
        abi: (checkoutCurrency === "MONA"
          ? [
              {
                inputs: [
                  { internalType: "address", name: "spender", type: "address" },
                  { internalType: "uint256", name: "tokens", type: "uint256" },
                ],
                name: "approve",
                outputs: [
                  { internalType: "bool", name: "success", type: "bool" },
                ],
                stateMutability: "nonpayable",
                type: "function",
              },
            ]
          : checkoutCurrency === "WMATIC"
          ? [
              {
                constant: false,
                inputs: [
                  { name: "guy", type: "address" },
                  { name: "wad", type: "uint256" },
                ],
                name: "approve",
                outputs: [{ name: "", type: "bool" }],
                payable: false,
                stateMutability: "nonpayable",
                type: "function",
              },
            ]
          : [
              {
                inputs: [
                  {
                    internalType: "address",
                    name: "spender",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                  },
                ],
                name: "approve",
                outputs: [
                  {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                  },
                ],
                stateMutability: "nonpayable",
                type: "function",
              },
            ]) as any,
        functionName: "approve",
        args: [
          COIN_OP_MARKET,
          ethers.utils.parseEther(totalAmount.toString() || "0"),
        ],
        account: address,
      });
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      if (res) {
        setApproved(true);
      }
    } catch (err: any) {
      dispatch(
        setModalOpen({
          actionOpen: true,
          actionMessage:
            "Something went wrong with your token approval. Try Again?",
        })
      );
      console.error(err.message);
    }
    setCryptoCheckoutLoading(false);
  };

  const handleCheckoutCrypto = async () => {
    if (!address) return;

    if (
      fulfillmentDetails.address.trim() === "" ||
      fulfillmentDetails.city.trim() === "" ||
      fulfillmentDetails.contact.trim() === "" ||
      fulfillmentDetails.country.trim() === "" ||
      fulfillmentDetails.name.trim() === "" ||
      fulfillmentDetails.state.trim() === "" ||
      fulfillmentDetails.zip.trim() === ""
    ) {
      dispatch(
        setModalOpen({
          actionOpen: true,
          actionMessage: "Fill out your Contact & Shipment details first.",
        })
      );
      return;
    }

    setCryptoCheckoutLoading(true);
    try {
      let fulfillerGroups: { [key: string]: CartItem[] } = {};

      for (let i = 0; i < cartItems.length; i++) {
        if (fulfillerGroups[cartItems[i].fulfillerAddress]) {
          fulfillerGroups[cartItems[i].fulfillerAddress].push(cartItems[i]);
        } else {
          fulfillerGroups[cartItems[i].fulfillerAddress] = [cartItems[i]];
        }
      }

      const fulfillerDetails = await encryptItems(
        litClient,
        dispatch,
        {
          sizes: cartItems?.reduce((accumulator: string[], item) => {
            accumulator.push(String(item.chosenSize));
            return accumulator;
          }, []),
          colors: cartItems?.reduce((accumulator: string[], item) => {
            accumulator.push(String(item.chosenColor));
            return accumulator;
          }, []),
          collectionIds: cartItems?.reduce((accumulator: number[], item) => {
            accumulator.push(Number(item.collectionId));
            return accumulator;
          }, []),
          collectionAmounts: cartItems?.reduce(
            (accumulator: number[], item) => {
              accumulator.push(Number(item.amount));
              return accumulator;
            },
            []
          ),
        },
        fulfillerGroups,
        fulfillmentDetails,
        address!
      );

      const { request } = await publicClient.simulateContract({
        address: COIN_OP_MARKET.toLowerCase() as `0x${string}`,
        abi: CoinOpMarketABI,
        functionName: "buyTokens",
        args: [
          {
            preRollIds: cartItems?.reduce((accumulator: number[], item) => {
              accumulator.push(item.collectionId);
              return accumulator;
            }, []),
            preRollAmounts: cartItems?.reduce((accumulator: number[], item) => {
              accumulator.push(item.amount);
              return accumulator;
            }, []),
            customIds: [],
            customAmounts: [],
            indexes: cartItems.map((item) =>
              ["shirt", "hoodie"].includes(item.printType.toLowerCase())
                ? 0
                : item.sizes.indexOf(item.chosenSize)
            ),
            customURIs: [],
            fulfillmentDetails: JSON.stringify(fulfillerDetails),
            pkpTokenId: "",
            chosenTokenAddress: ACCEPTED_TOKENS.find(
              ([_, token]) => token === checkoutCurrency
            )?.[2],
            sinPKP: true,
          },
        ],
        account: address?.toLowerCase() as `0x${string}`,
      });
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });

      dispatch(setCart([]));
      setFulfillmentDetails({
        name: "",
        contact: "",
        address: "",
        zip: "",
        city: "",
        state: "",
        country: "",
      });
      await router.push("/account");
    } catch (err: any) {
      dispatch(
        setModalOpen({
          actionOpen: true,
          actionMessage: "Something went wrong on Checkout. Try Again?",
        })
      );
      console.error(err.message);
    }
    setCryptoCheckoutLoading(false);
  };

  const retrieveOrders = async () => {
    try {
      const orders = await getOrders(address as string);
      dispatch(orders?.data?.orderCreateds);
      await router.push("/account");
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const generateAuthSignature = async () => {
    try {
      const signer = ethers.Wallet.createRandom();
      const siweMessage = new SiweMessage({
        domain: "localhost",
        address: await signer.getAddress(),
        statement: "This is an Auth Sig for LitListenerSDK",
        uri: "https://localhost/login",
        version: "1",
        chainId: 137,
      });
      const signedMessage = siweMessage.prepareMessage();
      const sig = await signer.signMessage(signedMessage);
      return {
        sig,
        derivedVia: "web3.eth.personal.sign",
        signedMessage,
        address,
      };
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const createTxData = async (
    fulfillerDetails: string[],
    provider: ethers.providers.JsonRpcProvider
  ) => {
    try {
      const contractInterface = new ethers.utils.Interface(
        CoinOpMarketABI as any
      );

      const gasPrice = await provider.getGasPrice();
      const maxFeePerGas = gasPrice.mul(2);
      const maxPriorityFeePerGas = gasPrice.div(2);
      return {
        to: COIN_OP_MARKET,
        nonce: (await provider.getTransactionCount(PKP_ADDRESS)) || 0,
        chainId: 137,
        gasLimit: ethers.BigNumber.from("5000000"),
        maxFeePerGas: maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas,
        from: "{{publicKey}}",
        data: contractInterface.encodeFunctionData("buyTokens", [
          {
            preRollIds: cartItems?.reduce((accumulator: number[], item) => {
              accumulator.push(item.collectionId);
              return accumulator;
            }, []),
            preRollAmounts: cartItems?.reduce((accumulator: number[], item) => {
              accumulator.push(item.amount);
              return accumulator;
            }, []),
            customIds: [],
            customAmounts: [],
            indexes: cartItems.map((item) =>
              ["shirt", "hoodie"].includes(item.printType.toLowerCase())
                ? 0
                : item.sizes.indexOf(item.chosenSize)
            ),
            customURIs: [],
            fulfillmentDetails: JSON.stringify(fulfillerDetails),
            pkpTokenId: currentPKP?.tokenId,
            chosenTokenAddress: ACCEPTED_TOKENS.find(
              ([_, token]) => token === checkoutCurrency
            )?.[2],
            sinPKP: false,
          },
        ]),
        value: ethers.BigNumber.from(0),
        type: 2,
      };
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const createPKPOrder = async () => {
    setFiatCheckoutLoading(true);
    try {
      let fulfillerGroups: { [key: string]: CartItem[] } = {};

      for (let i = 0; i < cartItems.length; i++) {
        if (fulfillerGroups[cartItems[i].fulfillerAddress]) {
          fulfillerGroups[cartItems[i].fulfillerAddress].push(cartItems[i]);
        } else {
          fulfillerGroups[cartItems[i].fulfillerAddress] = [cartItems[i]];
        }
      }

      const fulfillerDetails = await encryptItems(
        litClient,
        dispatch,
        {
          sizes: cartItems?.reduce((accumulator: string[], item) => {
            accumulator.push(String(item.chosenSize));
            return accumulator;
          }, []),
          colors: cartItems?.reduce((accumulator: string[], item) => {
            accumulator.push(String(item.chosenColor));
            return accumulator;
          }, []),
          collectionIds: cartItems?.reduce((accumulator: number[], item) => {
            accumulator.push(Number(item.collectionId));
            return accumulator;
          }, []),
          collectionAmounts: cartItems?.reduce(
            (accumulator: number[], item) => {
              accumulator.push(Number(item.amount));
              return accumulator;
            },
            []
          ),
        },
        fulfillerGroups,
        fulfillmentDetails,
        ethers.utils.computeAddress(currentPKP?.publicKey!) as `0x${string}`
      );

      const provider = new ethers.providers.JsonRpcProvider(
        `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_POLYGON_KEY}`,
        137
      );
      const tx = createTxData(fulfillerDetails!, provider);

      const results = await litClient.executeJS({
        ipfsId: IPFS_CID_PKP,
        authSig: await generateAuthSignature(),
        jsParams: {
          pkpAddress: PKP_ADDRESS,
          publicKey: PKP_PUBLIC_KEY,
          tx,
        },
      });

      const signature = results.response.signatures[0];
      const sig: {
        r: string;
        s: string;
        recid: number;
        signature: string;
        publicKey: string;
        dataSigned: string;
      } = signature as {
        r: string;
        s: string;
        recid: number;
        signature: string;
        publicKey: string;
        dataSigned: string;
      };

      const encodedSignature = joinSignature({
        r: "0x" + sig.r,
        s: "0x" + sig.s,
        recoveryParam: sig.recid,
      });
      const serialized = serialize(tx as any, encodedSignature);
      const transactionHash = await provider.sendTransaction(serialized);

      await transactionHash.wait();

      dispatch(setCart([]));
      setFulfillmentDetails({
        name: "",
        contact: "",
        address: "",
        zip: "",
        city: "",
        state: "",
        country: "",
      });
      const orders = await getOrders(address as string);
      dispatch(orders?.data?.orderCreateds);
      await router.push("/account");
    } catch (err: any) {
      console.error(err.message);
    }
    setFiatCheckoutLoading(false);
  };

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setFiatCheckoutLoading(false);
          dispatch(
            setMessagesModal({
              actionOpen: true,
              actionMessage: "Payment succeeded!",
            })
          );
          dispatch(setCart([]));
          setFulfillmentDetails({
            name: "",
            contact: "",
            address: "",
            zip: "",
            city: "",
            state: "",
            country: "",
          });
          retrieveOrders();
          break;
        case "processing":
          setFiatCheckoutLoading(true);
          dispatch(
            setMessagesModal({
              actionOpen: true,
              actionMessage: "Your payment is processing.",
            })
          );
          break;
        case "requires_payment_method":
          setFiatCheckoutLoading(false);
          dispatch(
            setMessagesModal({
              actionOpen: true,
              actionMessage:
                "Your payment was not successful, please try again.",
            })
          );
          break;
        default:
          setFiatCheckoutLoading(false);
          dispatch(
            setMessagesModal({
              actionOpen: true,
              actionMessage: "Something went wrong. Try again?",
            })
          );
          break;
      }
    });
  }, [stripe]);

  useEffect(() => {
    if (paymentType !== "fiat") {
      getTotalAmount();
    }
  }, [
    checkoutCurrency,
    paymentType,
    cartItems?.length,
    cartItems?.reduce(
      (accumulator, currentItem) =>
        accumulator + (currentItem.price * currentItem.amount) / 10 ** 18,
      0
    ),
  ]);

  useEffect(() => {
    getAddressApproved();
  }, [
    address,
    totalAmount,
    checkoutCurrency,
    cartItems?.reduce(
      (accumulator, currentItem) =>
        accumulator + (currentItem.price * currentItem.amount) / 10 ** 18,
      0
    ),
  ]);

  useEffect(() => {
    if (!cartItem || !cartItems?.indexOf(cartItem)) {
      setCartItem(cartItems[0]);
    }

    if (cartItems?.length < 1) {
      setCartItem(undefined);
    }
  }, [cartItems]);

  return {
    cartItem,
    setCartItem,
    startIndex,
    setStartIndex,
    paymentType,
    setPaymentType,
    handleCheckoutFiat,
    handleCheckoutCrypto,
    cryptoCheckoutLoading,
    fiatCheckoutLoading,
    checkoutCurrency,
    setCheckoutCurrency,
    handleApproveSpend,
    fulfillmentDetails,
    setFulfillmentDetails,
    approved,
    oracleValue,
  };
};

export default useCheckout;
