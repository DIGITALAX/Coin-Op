import { useEffect, useState } from "react";
import { getOrders } from "../../../../graphql/subgraph/queries/getOrders";
import { useAccount } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { getPreRollId } from "../../../../graphql/subgraph/queries/getPreRolls";
import CoinOpMarketABI from "../../../../abis/CoinOpMarket.json";
import { setAllOrders } from "../../../../redux/reducers/allOrdersSlice";
import { fetchIpfsJson } from "../../../../lib/algolia/helpers/fetchIpfsJson";
import {
  checkAndSignAuthMessage,
  decryptString,
} from "@lit-protocol/lit-node-client";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { polygon } from "viem/chains";
import { COIN_OP_FULFILLMENT, COIN_OP_MARKET } from "../../../../lib/constants";
import { InformationType, Order } from "../types/account.types";
import { encryptItems } from "../../../../lib/subgraph/helpers/encryptItems";

const useOrders = () => {
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
  const { address } = useAccount();
  const dispatch = useDispatch();
  const allOrders = useSelector(
    (state: RootState) => state.app.allOrdersReducer.value
  );
  const litClient = useSelector(
    (state: RootState) => state.app.litClientReducer.value
  );
  const [connected, setConnected] = useState<boolean>(false);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [decryptLoading, setDecryptLoading] = useState<boolean[]>([]);
  const [decryptMessageLoading, setDecryptMessageLoading] = useState<boolean[]>(
    []
  );
  const [orderOpen, setOrderOpen] = useState<boolean[]>([]);
  const [updateLoading, setUpdateLoading] = useState<boolean[]>([]);
  const [updatedInformation, setUpdatedInformation] = useState<
    InformationType[]
  >([]);

  const getAllOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await getOrders(address as string);
      if (!res || res?.data?.orderCreateds?.length < 1) {
        setOrdersLoading(false);
        return;
      }
      let allOrders = [];
      for (let i = 0; i < res?.data?.orderCreateds?.length; i++) {
        const parsedInfo = JSON.parse(
          res?.data?.orderCreateds[i].fulfillmentInformation.replaceAll(
            "'",
            '"'
          )
        );

        let collectionDetails = [];

        for (
          let j = 0;
          j < res?.data?.orderCreateds[i].collectionIds?.length;
          j++
        ) {
          const coll = await getPreRollId(
            res?.data?.orderCreateds[i].collectionIds[j]
          );
          const uri = await fetchIpfsJson(
            coll?.data?.collectionCreateds[j]?.uri?.split("ipfs://")[1]
          );
          collectionDetails.push({
            ...res?.data?.orderCreateds[i].collectionIds[j],
            uri,
          });
        }

        let messages: {
          encryptedString: string;
          encryptedSymmetricKey: string;
        }[] = [];

        for (let j = 0; j < res?.data?.orderCreateds[i].message.length; j++) {
          const parsedInfoMessage = JSON.parse(
            res?.data?.orderCreateds[i].message[j].replaceAll("'", '"')
          );
          messages.push({
            encryptedString: JSON.parse(parsedInfoMessage.encryptedString),
            encryptedSymmetricKey: parsedInfoMessage.encryptedSymmetricKey,
          });
        }

        allOrders.push({
          ...res?.data?.orderCreateds[i],
          fulfillmentInformation: {
            encryptedString: JSON.parse(parsedInfo.encryptedString),
            encryptedSymmetricKey: parsedInfo.encryptedSymmetricKey,
            decryptedFulfillment: undefined,
          },
          message: messages,
          collectionDetails,
        });
      }

      dispatch(setAllOrders(allOrders));
    } catch (err: any) {
      console.error(err.message);
    }
    setOrdersLoading(false);
  };

  const getFulfillerAddress = async (): Promise<string | undefined> => {
    try {
      const data = await publicClient.readContract({
        address: COIN_OP_FULFILLMENT,
        abi: [
          {
            inputs: [
              {
                internalType: "uint256",
                name: "_fulfillerId",
                type: "uint256",
              },
            ],
            name: "getFulfillerAddress",
            outputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        functionName: "getFulfillerAddress",
        args: [1],
      });

      return data as string | undefined;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleDecryptMessage = async (order: Order): Promise<void> => {
    if (!order?.message || !address) {
      return;
    }
    setDecryptMessageLoading((prev) =>
      prev.map((val, idx) =>
        idx === allOrders.findIndex((o) => o.message === order.message)
          ? true
          : val
      )
    );
    try {
      const client = new LitNodeClient({ debug: false });
      await client.connect();
      const authSig = await checkAndSignAuthMessage({
        chain: "polygon",
      });
      const fulfillerAddress = await getFulfillerAddress();
      let fulfillerEditions = order.subOrderIds.map((_) => {
        return {
          contractAddress: "",
          standardContractType: "",
          chain: "polygon",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: fulfillerAddress?.toLowerCase(),
          },
        };
      });
      if (fulfillerAddress) {
        let stringsDecrypted: {
          message: string;
          date: string;
        }[] = [];

        for (let i = 0; i < order.message.length; i++) {
          const symmetricKey = await client.getEncryptionKey({
            accessControlConditions: [
              ...fulfillerEditions,
              {
                contractAddress: "",
                standardContractType: "",
                chain: "polygon",
                method: "",
                parameters: [":userAddress"],
                returnValueTest: {
                  comparator: "=",
                  value: address.toLowerCase() as string,
                },
              },
            ],
            toDecrypt: order?.message[i].encryptedSymmetricKey!,
            authSig,
            chain: "polygon",
          });
          const uintString = new Uint8Array(order?.message[i].encryptedString!)
            .buffer;
          const blob = new Blob([uintString], { type: "text/plain" });
          const decryptedString = await decryptString(blob, symmetricKey);
          stringsDecrypted.push(JSON.parse(decryptedString));
        }

        const updatedOrders = allOrders.map((currentOrder) => {
          if (
            currentOrder.fulfillmentInformation.encryptedString ===
            order.fulfillmentInformation.encryptedString
          ) {
            return {
              ...currentOrder,
              decryptedMessage: stringsDecrypted,
            };
          }
          return currentOrder;
        });

        dispatch(setAllOrders(updatedOrders));
      }
    } catch (err: any) {
      console.error(err);
    }
    setDecryptMessageLoading((prev) =>
      prev.map((val, idx) =>
        idx === allOrders.findIndex((o) => o.message === order.message)
          ? false
          : val
      )
    );
  };

  const handleDecryptFulfillment = async (order: Order): Promise<void> => {
    if (
      !order?.fulfillmentInformation?.encryptedSymmetricKey ||
      !order?.fulfillmentInformation?.encryptedString ||
      !address
    ) {
      return;
    }
    setDecryptLoading((prev) =>
      prev.map((val, idx) =>
        idx ===
        allOrders.findIndex(
          (o) =>
            o.fulfillmentInformation?.encryptedSymmetricKey ===
            order.fulfillmentInformation?.encryptedSymmetricKey
        )
          ? true
          : val
      )
    );
    try {
      const client = new LitNodeClient({ debug: false });
      await client.connect();
      const authSig = await checkAndSignAuthMessage({
        chain: "polygon",
      });
      const fulfillerAddress = await getFulfillerAddress();
      let fulfillerEditions = order.subOrderIds.map((_) => {
        return {
          contractAddress: "",
          standardContractType: "",
          chain: "polygon",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: fulfillerAddress?.toLowerCase(),
          },
        };
      });
      if (fulfillerAddress) {
        const symmetricKey = await client.getEncryptionKey({
          accessControlConditions: [
            ...fulfillerEditions,
            {
              contractAddress: "",
              standardContractType: "",
              chain: "polygon",
              method: "",
              parameters: [":userAddress"],
              returnValueTest: {
                comparator: "=",
                value: address.toLowerCase() as string,
              },
            },
          ],
          toDecrypt: order?.fulfillmentInformation?.encryptedSymmetricKey!,
          authSig,
          chain: "polygon",
        });
        const uintString = new Uint8Array(
          order?.fulfillmentInformation?.encryptedString!
        ).buffer;
        const blob = new Blob([uintString], { type: "text/plain" });
        const decryptedString = await decryptString(blob, symmetricKey);

        const updatedOrders = allOrders.map((currentOrder) => {
          if (
            currentOrder.fulfillmentInformation.encryptedString ===
            order.fulfillmentInformation.encryptedString
          ) {
            return {
              ...currentOrder,
              fulfillmentInformation: {
                encryptedString: order.fulfillmentInformation.encryptedString,
                encryptedSymmetricKey:
                  order.fulfillmentInformation.encryptedSymmetricKey,
                decryptedFulfillment: JSON.parse(decryptedString),
              },
            };
          }
          return currentOrder;
        });

        dispatch(setAllOrders(updatedOrders));
      }
    } catch (err: any) {
      console.error(err);
    }
    setDecryptLoading((prev) =>
      prev.map((val, idx) =>
        idx ===
        allOrders.findIndex(
          (o) =>
            o.fulfillmentInformation?.encryptedSymmetricKey ===
            order.fulfillmentInformation?.encryptedSymmetricKey
        )
          ? false
          : val
      )
    );
  };

  const updateFulfillmentInformation = async (index: number) => {
    setUpdateLoading((prev) =>
      prev.map((val, idx) => (idx === index ? true : val))
    );
    try {
      let fulfillerGroups: { [key: string]: any[] } = {};

      for (let i = 0; i < allOrders[index].collectionDetails.length; i++) {
        if (
          fulfillerGroups[
            allOrders[index].collectionDetails[i].fulfillerAddress
          ]
        ) {
          fulfillerGroups[
            allOrders[index].collectionDetails[i].fulfillerAddress
          ].push(allOrders[index].collectionDetails[i]);
        } else {
          fulfillerGroups[
            allOrders[index].collectionDetails[i].fulfillerAddress
          ] = [allOrders[index].collectionDetails[i]];
        }
      }

      const fulfillerDetails = await encryptItems(
        litClient,
        dispatch,
        {
          sizes:
            allOrders[index].fulfillmentInformation.decryptedFulfillment
              ?.sizes || [],
          colors:
            allOrders[index].fulfillmentInformation.decryptedFulfillment
              ?.colors || [],
          collectionIds:
            allOrders[
              index
            ].fulfillmentInformation.decryptedFulfillment?.collectionIds.map(
              (id) => Number(id)
            ) || [],
          collectionAmounts:
            allOrders[
              index
            ].fulfillmentInformation.decryptedFulfillment?.collectionAmounts.map(
              (id) => Number(id)
            ) || [],
        },
        fulfillerGroups,
        updatedInformation[index],
        address!
      );

      const { request } = await publicClient.simulateContract({
        address: COIN_OP_MARKET,
        abi: CoinOpMarketABI,
        functionName: "setOrderDetails",
        args: [allOrders[index].orderId, JSON.stringify(fulfillerDetails)],
        account: address?.toLowerCase() as `0x${string}`,
      });
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
    } catch (err: any) {
      console.error(err.message);
    }
    setUpdateLoading((prev) =>
      prev.map((val, idx) => (idx === index ? false : val))
    );
  };

  useEffect(() => {
    if ((allOrders.length < 1 || !allOrders) && address) {
      getAllOrders();
    } else if (!address) {
      dispatch(setAllOrders([]));
    }
  }, [address]);

  useEffect(() => {
    setConnected(address ? true : false);
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
    connected,
    updateFulfillmentInformation,
    updateLoading,
    updatedInformation,
    setUpdatedInformation,
    handleDecryptMessage,
    decryptMessageLoading,
  };
};

export default useOrders;