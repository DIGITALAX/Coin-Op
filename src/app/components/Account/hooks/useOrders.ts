import { useContext, useEffect, useState } from "react";
import {
  getOrders,
  getOrdersMarket,
} from "../../../../../graphql/queries/getOrders";
import { Order } from "../types/account.types";
import {
  INFURA_GATEWAY,
  orderStatus,
  orderStatusMarket,
  paymentType,
} from "@/app/lib/constants";
import { decryptData } from "@/app/lib/helpers/encryption";
import { EncryptedData } from "../../Common/types/common.types";
import { ModalContext } from "@/app/providers";
import { OrderMarket } from "../../Sell/types/sell.types";

const isEncryptedDetails = (
  details: Order["details"] | OrderMarket["fulfillmentData"]
): details is EncryptedData => {
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return false;
  }

  return Object.values(details as Record<string, any>).every((value) => {
    if (!value || typeof value !== "object") {
      return false;
    }

    const candidate = value as {
      ciphertext?: unknown;
      iv?: unknown;
      ephemPublicKey?: unknown;
    };

    return (
      typeof candidate.ciphertext === "string" &&
      typeof candidate.iv === "string" &&
      typeof candidate.ephemPublicKey === "string"
    );
  });
};

const useOrders = (address: `0x${string}` | undefined, dict: any) => {
  const [allOrders, setAllOrders] = useState<{
    prerolls: Order[];
    market: OrderMarket[];
  }>({
    prerolls: [],
    market: [],
  });
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [decryptLoading, setDecryptLoading] = useState<{
    prerolls: boolean[];
    market: boolean[];
  }>({ prerolls: [], market: [] });
  const [orderOpen, setOrderOpen] = useState<{
    prerolls: boolean[];
    market: boolean[];
  }>({ prerolls: [], market: [] });
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const context = useContext(ModalContext);

  const reportError = (message?: string) => {
    context?.setError?.(message ?? dict?.Common?.error ?? "");
  };

  const getAllOrders = async () => {
    if (!address) {
      setAllOrders({
        prerolls: [],
        market: [],
      });
      return;
    }

    setOrdersLoading(true);
    try {
      const resProlls = await getOrders(address as string);
      const resMarket = await getOrdersMarket(address as string);
      if (
        (!resProlls || resProlls?.data?.orderCreateds?.length < 1) &&
        (!resMarket || resMarket?.data?.orders?.length < 1)
      ) {
        setOrdersLoading(false);
        return;
      }

      const ordersCleanedPrerolls = await Promise.all(
        (resProlls?.data?.orderCreateds || [])?.map(
          async (item: {
            orderId: string;
            totalPrice: string;
            status: string;
            details: string;
          }) => {
            let resolvedDetails: Order["details"] = item?.details;

            if (
              typeof item?.details === "string" &&
              item.details.trim() !== ""
            ) {
              try {
                const cid = item.details.includes("ipfs://")
                  ? item.details.split("ipfs://")?.[1]
                  : item.details;

                if (cid) {
                  const response = await fetch(`${INFURA_GATEWAY}/ipfs/${cid}`);
                  if (response.ok) {
                    resolvedDetails = await response.json();
                  }
                }
              } catch (error) {
                reportError();
              }
            }

            return {
              ...item,
              totalPrice: String(Number(item?.totalPrice) / 10 ** 18),
              details: resolvedDetails,
              status: orderStatus[Number(item?.status)],
              decrypted: Boolean(
                resolvedDetails &&
                  typeof resolvedDetails === "object" &&
                  !Array.isArray(resolvedDetails) &&
                  !isEncryptedDetails(resolvedDetails)
              ),
            };
          }
        )
      );

      const ordersCleanedMarket = await Promise.all(
        (resMarket?.data?.orders || [])?.map(
          async (item: {
            orderId: string;
            orderStatus: string;
            fulfillmentData: string;
            payments: {
              paymentType: string;
            }[];
          }) => {
            let resolvedDetails: OrderMarket["fulfillmentData"] =
              item?.fulfillmentData;

            if (
              typeof item?.fulfillmentData === "string" &&
              item.fulfillmentData.trim() !== ""
            ) {
              try {
                const cid = item.fulfillmentData.includes("ipfs://")
                  ? item.fulfillmentData.split("ipfs://")?.[1]
                  : item.fulfillmentData;

                if (cid) {
                  const response = await fetch(`${INFURA_GATEWAY}/ipfs/${cid}`);
                  if (response.ok) {
                    resolvedDetails = await response.json();
                  }
                }
              } catch (error) {
                reportError();
              }
            }

            return {
              ...item,
              fulfillmentData: resolvedDetails,
              orderStatus: orderStatusMarket[Number(item?.orderStatus)],
              payments: item?.payments?.map((item) => ({
                ...item,
                paymentType: paymentType[Number(item.paymentType)],
              })),
              decrypted: Boolean(
                resolvedDetails &&
                  typeof resolvedDetails === "object" &&
                  !Array.isArray(resolvedDetails) &&
                  !isEncryptedDetails(resolvedDetails)
              ),
            };
          }
        )
      );

      setAllOrders({
        prerolls: ordersCleanedPrerolls,
        market: ordersCleanedMarket,
      });
      setOrderOpen({
        prerolls: Array.from(
          { length: ordersCleanedPrerolls.length },
          () => false
        ),
        market: Array.from({ length: ordersCleanedMarket.length }, () => false),
      });
      setDecryptLoading({
        prerolls: Array.from(
          { length: ordersCleanedPrerolls.length },
          () => false
        ),
        market: Array.from({ length: ordersCleanedMarket.length }, () => false),
      });
    } catch (err: any) {
      reportError();
    }
    setOrdersLoading(false);
  };

  const handleDecryptFulfillment = async (
    order: Order | OrderMarket,
    prerolls: boolean
  ): Promise<void> => {
    if (!address) {
      return;
    }

    const orderIndex = (
      prerolls ? allOrders.prerolls : allOrders.market
    ).findIndex((o) => o.orderId === order.orderId);

    if (orderIndex === -1) {
      return;
    }

    if (
      order.decrypted ||
      !isEncryptedDetails(
        prerolls
          ? (order as Order).details
          : (order as OrderMarket).fulfillmentData
      )
    ) {
      setAllOrders((prev) => ({
        ...prev,
        [prerolls ? "prerolls" : "market"]: (prerolls
          ? prev.prerolls
          : prev.market
        ).map((currentOrder) =>
          currentOrder.orderId === order.orderId
            ? { ...currentOrder, decrypted: true }
            : currentOrder
        ),
      }));
      return;
    }

    setDecryptLoading((prev) => ({
      ...prev,
      [prerolls ? "prerolls" : "market"]: (prerolls
        ? prev.prerolls
        : prev.market
      ).map((val, idx) => (idx === orderIndex ? true : val)),
    }));

    try {
      let key = privateKey;

      if (!key) {
        const promptMessage = dict?.Account?.decryptPrompt;
        const promptValue = window.prompt(promptMessage);

        if (!promptValue) {
          return;
        }

        key = promptValue.trim();

        if (!key.startsWith("0x")) {
          key = `0x${key}`;
        }

        setPrivateKey(key);
      }

      const decrypted = await decryptData(
        (prerolls
          ? (order as Order).details
          : (order as OrderMarket).fulfillmentData) as EncryptedData,
        key,
        address
      );

      setAllOrders((prev) => ({
        ...prev,
        [prerolls ? "prerolls" : "market"]: (prerolls
          ? prev.prerolls
          : prev.market
        ).map((currentOrder) =>
          currentOrder.orderId === order.orderId
            ? {
                ...currentOrder,
                [prerolls ? "details" : "fulfillmentData"]: decrypted,
                decrypted: true,
              }
            : currentOrder
        ),
      }));
    } catch (err: any) {
      reportError();
      setPrivateKey(null);
    } finally {
      setDecryptLoading((prev) => ({
        ...prev,
        [prerolls ? "prerolls" : "market"]: (prerolls
          ? prev.prerolls
          : prev.market
        ).map((val, idx) => (idx === orderIndex ? false : val)),
      }));
    }
  };

  useEffect(() => {
    setPrivateKey(null);
    if (address) {
      getAllOrders();
    } else {
      setAllOrders({
        prerolls: [],
        market: [],
      });
    }
  }, [address]);

  useEffect(() => {
    setOrderOpen({
      prerolls: Array.from({ length: allOrders.prerolls.length }, () => false),
      market: Array.from({ length: allOrders.market.length }, () => false),
    });
    setDecryptLoading({
      prerolls: Array.from({ length: allOrders.prerolls.length }, () => false),
      market: Array.from({ length: allOrders.market.length }, () => false),
    });
  }, [allOrders.prerolls.length, allOrders.market.length]);

  return {
    ordersLoading,
    handleDecryptFulfillment,
    decryptLoading,
    orderOpen,
    setOrderOpen,
    allOrders,
  };
};

export default useOrders;
