import { CartItem } from "@/components/Common/types/common.types";
import { useEffect, useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { waitForTransaction } from "@wagmi/core";
import { setMessagesModal } from "../../../../../redux/reducers/messagesModalSlice";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import {
  ACCEPTED_TOKENS,
  COIN_OP_MARKET,
  COIN_OP_ORACLE,
} from "../../../../../lib/constants";
import { BigNumber, ethers } from "ethers";
import CoinOpMarketABI from "../../../../../abis/CoinOpMarket.json";
import CoinOpMarketOracle from "../../../../../abis/CoinOpOracle.json";
import { RootState } from "../../../../../redux/store";
import { setCart } from "../../../../../redux/reducers/cartSlice";
import { useRouter } from "next/router";

const useCheckout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { address } = useAccount();
  const stripe = useStripe();
  const elements = useElements();
  const cartItems = useSelector(
    (state: RootState) => state.app.cartReducer.value
  );
  const [approved, setApproved] = useState<boolean>(false);
  const [cartItem, setCartItem] = useState<CartItem | undefined>();
  const [startIndex, setStartIndex] = useState<number>(0);
  const [paymentType, setPaymentType] = useState<string>("fiat");
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
  }>({
    name: "",
    contact: "",
    address: "",
    zip: "",
    city: "",
    state: "",
  });

  const { data: oracleData } = useContractRead({
    address: COIN_OP_ORACLE,
    abi: CoinOpMarketOracle,
    functionName: "getRateByAddress",
    args: [
      ACCEPTED_TOKENS.find(([_, token]) => token === checkoutCurrency)?.[2],
    ],
    enabled: Boolean(
      ACCEPTED_TOKENS.find(([_, token]) => token === checkoutCurrency)?.[2]
    ),
  });

  const { data } = useContractRead({
    address: ACCEPTED_TOKENS.find(
      ([_, token]) => token === checkoutCurrency
    )?.[2] as `0x${string}`,
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
    enabled: Boolean(address) || Boolean(approved),
  });

  const { config } = usePrepareContractWrite({
    address: ACCEPTED_TOKENS.find(
      ([_, token]) => token === checkoutCurrency
    )?.[2]! as `0x${string}`,
    abi:
      checkoutCurrency === "MONA"
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
          ],
    functionName: "approve",
    args: [COIN_OP_MARKET, ethers.utils.parseEther(totalAmount.toString())],
    enabled: Boolean(!Number.isNaN(totalAmount)),
    value: BigInt("0"),
  });

  const { config: buyNFTConfig } = usePrepareContractWrite({
    address: COIN_OP_MARKET,
    abi: CoinOpMarketABI,
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
        customURIs: [],
        fulfillmentDetails,
        chosenTokenAddress: ACCEPTED_TOKENS.find(
          ([_, token]) => token === checkoutCurrency
        )?.[2],
      },
    ],
    functionName: "buyTokens",
    enabled: Boolean(cartItems?.length > 0 && paymentType === "crypto"),
  });

  const { writeAsync } = useContractWrite(config as any);
  const { writeAsync: buyNFTAsync } = useContractWrite(buyNFTConfig);

  const getTotalAmount = () => {
    if (cartItems.length < 1) {
      setTotalAmount(0);
    } else {
      const total = cartItems?.reduce(
        (accumulator, currentItem) =>
          accumulator + (currentItem.price * currentItem.amount) / 10 ** 18,
        0
      );

      if (oracleData) {
        const oracle =
          Number((oracleData as BigNumber)?.toBigInt()?.toString()) / 10 ** 18;
        setOracleValue(oracle);
        setTotalAmount(Number((total / oracle).toFixed(2)));
      }
    }
  };

  const handleCheckoutFiat = async () => {
    setFiatCheckoutLoading(true);
    try {
      if (!stripe || !elements) {
        return;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `/success"`,
        },
      });

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
      const tx = await writeAsync?.();
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      if (res.status === "success") {
        setApproved(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setCryptoCheckoutLoading(false);
  };

  const handleCheckoutCrypto = async () => {
    setCryptoCheckoutLoading(true);
    try {
      const tx = await buyNFTAsync?.();
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      if (res.status === "success") {
        dispatch(setCart([]));
        setFulfillmentDetails({
          name: "",
          contact: "",
          address: "",
          zip: "",
          city: "",
          state: "",
        });
        router.push("/success");
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setCryptoCheckoutLoading(false);
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
          });
          router.push("/success");
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
              actionMessage: "Something went wrong.",
            })
          );
          break;
      }
    });
  }, [stripe]);

  useEffect(() => {
    if (address) {
      if (Number(data as BigNumber) / 10 ** 18 >= totalAmount) {
        setApproved(true);
      } else {
        setApproved(false);
      }
    }
  }, [
    address,
    totalAmount,
    cartItems?.reduce(
      (accumulator, currentItem) =>
        accumulator + (currentItem.price * currentItem.amount) / 10 ** 18,
      0
    ),
    data,
  ]);

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
