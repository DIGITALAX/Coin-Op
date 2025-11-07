import { useContext, useEffect, useState } from "react";
import { COIN_OP_MARKET, COIN_OP_PARENT } from "@/app/lib/constants";
import { useAccount } from "wagmi";
import { ensureMetadata } from "@/app/lib/helpers/metadata";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { chains } from "@lens-chain/sdk/viem";
import { ABIS } from "@/app/abis";
import { Parent } from "../types/account.types";
import { getParents } from "../../../../../graphql/queries/getItems";
import { ModalContext } from "@/app/providers";
import { getStatusLabel } from "@/app/lib/helpers/getStatusLabel";
import { checkCreate } from "@/app/lib/helpers/canCreate";
import { ChildReference } from "../../Sell/types/sell.types";

const useParents = (dict: any) => {
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: chains.mainnet,
    transport: http("https://rpc.lens.xyz"),
  });
  const modalContext = useContext(ModalContext);
  const [parents, setParents] = useState<Parent[]>([]);
  const [parentsLoading, setParentsLoading] = useState<boolean>(false);
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  const [createParentLoading, setCreateParentLoading] =
    useState<boolean>(false);

  const handleParents = async () => {
    if (!address) return;
    setParentsLoading(true);
    try {
      const result = await getParents(address, COIN_OP_PARENT);
      if (result?.data?.parents) {
        const processedItems: Parent[] = await Promise.all(
          result.data.parents.map(async (parent: Parent) => {
            const processedParent = await ensureMetadata(parent);
            const res = await checkCreate(parent);
            const normalizedChildReferences =
              processedParent?.childReferences?.map((child: ChildReference) => ({
                ...child,
                child: child.isTemplate
                  ? (child as any).childTemplate ?? child.child
                  : child.child,
              })) ?? [];
            return {
              ...processedParent,
              childReferences: normalizedChildReferences,
              status: getStatusLabel(parent.status, dict),
              canApprove: !parent?.authorizedMarkets?.find(
                (mar) =>
                  mar.contractAddress.toLowerCase() ==
                  COIN_OP_MARKET.toLowerCase()
              ),
              canCreate: Number(parent?.status) === 0 && res,
            };
          })
        );
        setParents(processedItems);
      }
    } catch (err: any) {}
    setParentsLoading(false);
  };

  const handleCreateParent = async (parentId: number) => {
    setCreateParentLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: chains.mainnet,
        transport: custom((window as any).ethereum),
      });
      const { request } = await publicClient.simulateContract({
        address: COIN_OP_PARENT,
        abi: ABIS.FGOParent,
        functionName: "createParent",
        chain: chains.mainnet,
        args: [BigInt(parentId)],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      modalContext?.setModalOpen(dict?.Account?.createParentSuccess);
    } catch (err: any) {
      console.error(err.message);
    }
    setCreateParentLoading(false);
  };

  const handleApproveMarket = async (parentId: number) => {
    setApproveLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: chains.mainnet,
        transport: custom((window as any).ethereum),
      });
      const { request } = await publicClient.simulateContract({
        address: COIN_OP_PARENT,
        abi: ABIS.FGOParent,
        functionName: "approveMarket",
        args: [BigInt(parentId), COIN_OP_MARKET],
        account: address,
      });

      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      modalContext?.setModalOpen(dict?.Account?.approveMarketSuccess);
    } catch (err: any) {
      console.error(err.message);
    }
    setApproveLoading(false);
  };

  useEffect(() => {
    if (parents.length < 1 && address) {
      handleParents();
    }
  }, [address]);

  return {
    parents,
    handleCreateParent,
    handleApproveMarket,
    parentsLoading,
    createParentLoading,
    approveLoading,
  };
};

export default useParents;
