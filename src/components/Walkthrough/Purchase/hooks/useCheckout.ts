import { CartItem } from "@/components/Common/types/common.types";
import { useEffect, useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { setMessagesModal } from "../../../../../redux/reducers/messagesModalSlice";
import {
  ACCEPTED_TOKENS,
  // ACCEPTED_TOKENS_MUMBAI,
  COIN_OP_MARKET,
  COIN_OP_ORACLE,
} from "../../../../../lib/constants";
import { ethers } from "ethers";
import CoinOpMarketABI from "../../../../../abis/CoinOpMarket.json";
import { RootState } from "../../../../../redux/store";
import { setCart } from "../../../../../redux/reducers/cartSlice";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import { encryptItems } from "../../../../../lib/subgraph/helpers/encryptItems";
import { setModalOpen } from "../../../../../redux/reducers/modalOpenSlice";
import { setLogin } from "../../../../../redux/reducers/loginSlice";
import { setEncryptedInfo } from "../../../../../redux/reducers/encryptedInformationSlice";
import { setFulfillmentDetails } from "../../../../../redux/reducers/fulfillmentDetailsSlice";
import {
  removeCartItemsLocalStorage,
  removeFulfillmentDetailsLocalStorage,
} from "../../../../../lib/subgraph/utils";
import { createTxData } from "../../../../../lib/subgraph/helpers/createTxData";
import { litExecute } from "../../../../../lib/subgraph/helpers/litExecute";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { AnyAction, Dispatch } from "redux";

const useCheckout = (
  client: LitNodeClient,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}` | undefined,
  publicClient: PublicClient
) => {
  const fulfillmentDetails = useSelector(
    (state: RootState) => state.app.fulfillmentDetailsReducer.value
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartReducer.value
  );
  const encrypted = useSelector(
    (state: RootState) => state.app.encryptedInformationReducer
  );
  const currentPKP = useSelector(
    (state: RootState) => state.app.currentPKPReducer.value
  );
  const paymentType = useSelector(
    (state: RootState) => state.app.paymentTypeReducer.value
  );
  const stripe = useStripe();
  const elements = useElements();
  const [approved, setApproved] = useState<boolean>(false);
  const [cartItem, setCartItem] = useState<CartItem | undefined>();
  const [startIndex, setStartIndex] = useState<number>(0);
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
        Number(data as any) /
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
          )?.[2].toLowerCase() as `0x${string}`,
        ],
      });

      if (data) {
        const oracle = Number(data as any) / 10 ** 18;
        setOracleValue(oracle);
        setTotalAmount(Number(total) / Number(oracle));
      }
    }
  };

  const encryptFulfillerInformation = async () => {
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
      let fulfillerGroups: { [key: string]: CartItem[] } = {};

      for (let i = 0; i < cartItems.length; i++) {
        if (fulfillerGroups[cartItems[i].fulfillerAddress]) {
          fulfillerGroups[cartItems[i].fulfillerAddress].push(cartItems[i]);
        } else {
          fulfillerGroups[cartItems[i].fulfillerAddress] = [cartItems[i]];
        }
      }

      const returned = await encryptItems(
        client,
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
        currentPKP?.ethAddress as `0x${string}`,
        currentPKP?.authSig
      );

      dispatch(setEncryptedInfo(returned?.fulfillerDetails));
    } catch (err: any) {
      dispatch(setEncryptedInfo(undefined));
      console.error(err.message);
    }
    setFiatCheckoutLoading(false);
  };

  const handleCheckoutFiat = async () => {
    if (!stripe || !elements || !currentPKP) {
      dispatch(
        setLogin({
          actionOpen: true,
          actionHighlight: "fiat",
        })
      );
      return;
    }

    if (!encrypted.information) {
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
        confirmParams: {},
        redirect: "if_required",
      });

      if (error) {
        setFiatCheckoutLoading(false);
        dispatch(
          setMessagesModal({
            actionOpen: true,
            actionMessage: "There was an error with your payment, try again?",
          })
        );
        return;
      }

      await createPKPOrder();
      dispatch(setCart([]));
      removeCartItemsLocalStorage();
      removeFulfillmentDetailsLocalStorage();
      dispatch(
        setFulfillmentDetails({
          name: "",
          contact: "",
          address: "",
          zip: "",
          city: "",
          state: "",
          country: "",
        })
      );
      dispatch(setEncryptedInfo(undefined));
      dispatch(
        setMessagesModal({
          actionOpen: true,
          actionMessage:
            "It’s all yours now. Return to your account page soon for fulfillment and shipping updates.",
        })
      );
    } catch (err: any) {
      dispatch(setEncryptedInfo(undefined));
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
    if (!address) {
      dispatch(
        setLogin({
          actionOpen: true,
          actionHighlight: "crypto",
        })
      );
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

      const returned = await encryptItems(
        client,
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
            preRollIndexes: cartItems.map((item) =>
              ["shirt", "hoodie", "sleeve"].includes(
                item.printType.toLowerCase()
              )
                ? 0
                : item.sizes.indexOf(item.chosenSize)
            ),
            customIds: [],
            customAmounts: [],
            customIndexes: [],
            customURIs: [],
            fulfillmentDetails: JSON.stringify(returned?.fulfillerDetails),
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
      removeCartItemsLocalStorage();
      removeFulfillmentDetailsLocalStorage();
      dispatch(
        setFulfillmentDetails({
          name: "",
          contact: "",
          address: "",
          zip: "",
          city: "",
          state: "",
          country: "",
        })
      );
      dispatch(
        setMessagesModal({
          actionOpen: true,
          actionMessage:
            "It’s all yours now. Return to your account page soon for fulfillment and shipping updates.",
        })
      );
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

  const createPKPOrder = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        137
      );

      const tx = await createTxData(
        provider,
        CoinOpMarketABI,
        COIN_OP_MARKET,
        "buyTokens",
        [
          {
            preRollIds: cartItems?.reduce((accumulator: number[], item) => {
              accumulator.push(item.collectionId);
              return accumulator;
            }, []),
            preRollAmounts: cartItems?.reduce((accumulator: number[], item) => {
              accumulator.push(item.amount);
              return accumulator;
            }, []),
            preRollIndexes: cartItems.map((item) =>
              ["shirt", "hoodie", "sleeve"].includes(
                item.printType.toLowerCase()
              )
                ? 0
                : item.sizes.indexOf(item.chosenSize)
            ),
            customIds: [],
            customAmounts: [],
            customIndexes: [],
            customURIs: [],
            fulfillmentDetails: JSON.stringify(encrypted.information!),
            pkpTokenId: BigInt(currentPKP?.tokenId.hex!).toString(),
            chosenTokenAddress: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
            sinPKP: false,
          },
        ]
      );

      await litExecute(
        client,
        provider,
        tx,
        "coinOpBuyTokens",
        currentPKP?.authSig
      );
    } catch (err: any) {
      setFiatCheckoutLoading(false);
      console.error(err.message);
    }
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
    handleCheckoutFiat,
    handleCheckoutCrypto,
    cryptoCheckoutLoading,
    fiatCheckoutLoading,
    checkoutCurrency,
    setCheckoutCurrency,
    handleApproveSpend,
    fulfillmentDetails,
    approved,
    oracleValue,
    encryptFulfillerInformation,
  };
};

export default useCheckout;
