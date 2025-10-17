import { useEffect, useState } from "react";
import {
  LitNodeClient,
  checkAndSignAuthMessage,
  uint8arrayToString,
} from "@lit-protocol/lit-node-client";
import { getOrders } from "../../../../../graphql/queries/getOrders";
import {
  EncryptedDetails,
  Order,
} from "../types/account.types";
import { LIT_NETWORK } from "@lit-protocol/constants";
import { INFURA_GATEWAY, orderStatus } from "@/app/lib/constants";

const useOrders = (address: `0x${string}` | undefined) => {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [decryptLoading, setDecryptLoading] = useState<boolean[]>([]);
  const [orderOpen, setOrderOpen] = useState<boolean[]>([]);
  const client = new LitNodeClient({
    litNetwork: LIT_NETWORK.Datil,
    debug: false,
  });

  const getAllOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await getOrders(address as string);
      if (!res || res?.data?.orderCreateds?.length < 1 ) {
        setOrdersLoading(false);
        return;
      }

      const ordersCleaned = await Promise.all(
        (res?.data?.orderCreateds || [])?.map(
          async (item: {
            totalPrice: string;
            status: string;
            details: string;
          }) => {
            if (item?.details) {
              const data = await fetch(
                `${INFURA_GATEWAY}/ipfs/${item?.details?.split("ipfs://")?.[1]}`
              );
              item.details = await data?.json();
            }

            return {
              ...item,
              totalPrice: String(Number(item?.totalPrice) / 10 ** 18),
              details: item?.details,
              status: orderStatus[Number(item?.status)],
              decrypted: false,
            };
          }
        )
      );

      setAllOrders(ordersCleaned);
      setOrderOpen(Array.from({ length: ordersCleaned.length }, () => false));
      setDecryptLoading(
        Array.from({ length: ordersCleaned.length }, () => false)
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setOrdersLoading(false);
  };

  const handleDecryptFulfillment = async (
    order: Order 
  ): Promise<void> => {
    if (order?.decrypted || !address) {
      return;
    }
    setDecryptLoading((prev) =>
      prev.map((val, idx) =>
        idx ===
        allOrders.findIndex(
          (o) =>
            (o.details as EncryptedDetails)?.ciphertext ===
            (order.details as EncryptedDetails)?.ciphertext
        )
          ? true
          : val
      )
    );
    try {
      let nonce = await client.getLatestBlockhash();
      const authSig = await checkAndSignAuthMessage({
        chain: "polygon",
        nonce,
      });
      await client.connect();

      const { decryptedData } = await client.decrypt({
        accessControlConditions: (order?.details as EncryptedDetails)
          ?.accessControlConditions,
        ciphertext: (order?.details as EncryptedDetails)?.ciphertext,
        dataToEncryptHash: (order?.details as EncryptedDetails)
          ?.dataToEncryptHash,
        chain: "polygon",
        authSig,
      });

      const details = await JSON.parse(uint8arrayToString(decryptedData));

      const updatedOrders = allOrders.map((currentOrder) => {
        if (
          (currentOrder?.details as EncryptedDetails).ciphertext ===
          (order?.details as EncryptedDetails).ciphertext
        ) {
          return {
            ...currentOrder,
            details,
            decrypted: true,
          };
        }
        return currentOrder;
      });
      setAllOrders(updatedOrders);
    } catch (err: any) {
      console.error(err);
    }
    setDecryptLoading((prev) =>
      prev.map((val, idx) =>
        idx ===
        allOrders.findIndex(
          (o) =>
            (o.details as EncryptedDetails)?.ciphertext ===
            (order.details as EncryptedDetails)?.ciphertext
        )
          ? false
          : val
      )
    );
  };

  useEffect(() => {
    if (address) {
      getAllOrders();
    } else {
      setAllOrders([]);
    }
  }, [address]);

  useEffect(() => {
    setDecryptLoading(Array.from({ length: allOrders.length }, () => false));
    setOrderOpen(Array.from({ length: allOrders.length }, () => false));
  }, [allOrders.length]);

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
