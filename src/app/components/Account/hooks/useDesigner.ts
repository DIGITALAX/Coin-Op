import { useEffect, useState } from "react";
import { Designer } from "../../Sell/types/sell.types";
import { getDesigner } from "../../../../../graphql/queries/getDesigner";
import { COIN_OP_DESIGNER, INFRA_ID } from "@/app/lib/constants";
import { useAccount } from "wagmi";
import { ensureMetadata } from "@/app/lib/helpers/metadata";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { chains } from "@lens-chain/sdk/viem";
import { ABIS } from "@/app/abis";
import { DesignerFormData } from "../types/account.types";

const useDesigner = () => {
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: chains.mainnet,
    transport: http("https://rpc.lens.dev"),
  });
  const [designer, setDesigner] = useState<Designer | null>();
  const [designerLoading, setDesignerLoading] = useState<boolean>(false);
  const [createDesignerLoading, setCreateDesignerLoading] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<DesignerFormData>({
    title: "",
    description: "",
    link: "",
    image: null,
  });

  const handleCreateDesigner = async (edit: boolean) => {
    if (!address) return;
    setCreateDesignerLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: chains.mainnet,
        transport: custom((window as any).ethereum),
      });

      let imageUri = formData.image || "";

      if (imageUri && typeof imageUri !== "string") {
        const res = await fetch("/api/ipfs", {
          method: "POST",
          body: imageUri,
        });
        const json = await res.json();
        imageUri = `ipfs://${json?.cid}`;
      }

      const metadata = {
        title: formData.title,
        description: formData.description,
        link: formData.link,
        image: imageUri,
      };

      const resMet = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify(metadata),
      });
      const json = await resMet.json();

      const { request } = await publicClient.simulateContract({
        address: COIN_OP_DESIGNER,
        abi: ABIS.FGODesigners,
        functionName: edit ? "updateProfile" : "createProfile",
        chain: chains.mainnet,
        args: edit
          ? [Number(designer?.designerId), BigInt(Number(designer?.version) + 1), `ipfs://${json?.cid}`]
          : [BigInt(1), `ipfs://${json?.cid}`],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      
      await handleFetchDesigner();
    } catch (err: any) {
      console.error(err.message)
    }
    setCreateDesignerLoading(false);
  };

  const handleFetchDesigner = async () => {
    if (!address) return;
    setDesignerLoading(true);
    try {
      const result = await getDesigner(INFRA_ID, address);

      if (result.data.designers[0]?.designerId) {
        const designerWithMetadata = await ensureMetadata(
          result.data.designers[0]
        );

        setDesigner(designerWithMetadata);
        setFormData({
          title: designerWithMetadata.metadata.title || "",
          description: designerWithMetadata.metadata.description || "",
          link: designerWithMetadata.metadata.link || "",
          image: designerWithMetadata.metadata.image || null,
        });
      }
    } catch (err: any) {
       console.error(err.message)
    }
    setDesignerLoading(false);
  };

  useEffect(() => {
    if (!designer && address) {
      handleFetchDesigner();
    }
  }, [address]);

  return {
    designer,
    createDesignerLoading,
    designerLoading,
    handleCreateDesigner,
    formData,
    setFormData,
  };
};

export default useDesigner;
