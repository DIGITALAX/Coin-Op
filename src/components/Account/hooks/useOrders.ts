import { useEffect, useState } from "react";
import { setAllOrders } from "../../../../redux/reducers/allOrdersSlice";
import {
  LitNodeClient,
  checkAndSignAuthMessage,
  decryptToString,
} from "@lit-protocol/lit-node-client";
import { PublicClient } from "viem";
import { EncryptedDetails, Order } from "../types/account.types";
import { AnyAction, Dispatch } from "redux";
import {
  getCollectionOrder,
  getOrders,
} from "../../../../graphql/subgraph/queries/getOrders";

const useOrders = (
  client: LitNodeClient,
  address: `0x${string}` | undefined,
  dispatch: Dispatch<AnyAction>,
  allOrders: Order[]
) => {
  const [subscriptionsLoading, setSubscriptionsLoading] =
    useState<boolean>(false);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [decryptLoading, setDecryptLoading] = useState<boolean[]>([]);
  const [orderOpen, setOrderOpen] = useState<boolean[]>([]);

  const getAllOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await getOrders(address as string);
      if (!res || res?.data?.orderCreateds?.length < 1) {
        setOrdersLoading(false);
        return;
      }

      const promises = (res?.data?.orderCreateds || [])?.map(
        async (item: {
          orderId: string;
          totalPrice: string;
          currency: string;
          pubId: string;
          profileId: string;
          buyer: string;
          blockTimestamp: string;
          transactionHash: string;
          images: string[];
          names: string[];
          messages: string[];
          details: string;
          subOrderPrice: string[];
          subOrderStatus: string[];
          subOrderCollectionIds: string[];
          subOrderIsFulfilled: boolean[];
          subOrderAmount: string[];
        }) => ({
          ...item,
          totalPrice: String(Number(item?.totalPrice) / 10 ** 18),
          details: item?.details && (await JSON.parse(item?.details as string)),
          decrypted: false,
          subOrders: await Promise.all(
            item?.subOrderCollectionIds?.map(
              async (collectionId: string, index: number) => {
                const collection = await getCollectionOrder(collectionId);

                return {
                  collection: {
                    name: collection?.data?.collectionCreateds?.[0]
                      ?.collectionMetadata?.title as string,
                    image: collection?.data?.collectionCreateds?.[0]
                      ?.collectionMetadata?.images?.[0]
                      ? collection?.data?.collectionCreateds?.[0]
                          ?.collectionMetadata?.images?.[0]
                      : (collection?.data?.collectionCreateds?.[0]
                          ?.collectionMetadata?.cover as string),
                    origin: collection?.data?.collectionCreateds?.[0]
                      ?.origin as string,
                    pubId: collection?.data?.collectionCreateds?.[0]
                      ?.pubId as string,
                  },
                  price: String(
                    Number(item?.subOrderPrice?.[index]) / 10 ** 18
                  ) as string,
                  status: item?.subOrderStatus?.[index] as string,
                  isFulfilled: item?.subOrderIsFulfilled?.[index],
                  fulfillerAddress: "",
                  amount: item?.subOrderAmount?.[index] as string,
                };
              }
            )
          ),
        })
      );
      const awaited = await Promise.all(promises);
      dispatch(setAllOrders(awaited));
    } catch (err: any) {
      console.error(err.message);
    }
    setOrdersLoading(false);
  };

  const handleDecryptFulfillment = async (order: Order): Promise<void> => {
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
      let nonce = client.getLatestBlockhash();

      const authSig = await checkAndSignAuthMessage({
        chain: "polygon",
        nonce: nonce!,
      });

      await client.connect();

      const decryptedString = await decryptToString(
        {
          authSig,
          accessControlConditions: (order?.details as EncryptedDetails)
            ?.accessControlConditions,
          ciphertext: (order?.details as EncryptedDetails)?.ciphertext,
          dataToEncryptHash: (order?.details as EncryptedDetails)
            ?.dataToEncryptHash,
          chain: "polygon",
        },
        client as any
      );

      const updatedOrders = allOrders.map(async (currentOrder) => {
        if (
          (currentOrder?.details as EncryptedDetails).ciphertext ===
          (order?.details as EncryptedDetails).ciphertext
        ) {
          const details = await JSON.parse(decryptedString);
          return {
            ...currentOrder,
            details,
            subOrders: currentOrder?.subOrders.map((item, index) => ({
              ...item,
              size: details.sizes[details.sizes.length - 1 - index],
              color: details.colors[details.colors.length - 1 - index],
            })),
            decrypted: true,
          };
        }
        return currentOrder;
      });
      dispatch(setAllOrders(await Promise.all(updatedOrders)));
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
      dispatch(setAllOrders([]));
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
    subscriptionsLoading,
  };
};

export default useOrders;
