import { createPublicClient, createWalletClient, custom, http } from "viem";
import { chains } from "@lens-chain/sdk/viem";
import { useState, useMemo, useContext } from "react";
import { ABIS } from "@/app/abis";
import { useAccount } from "wagmi";
import {
  COIN_OP_MARKET,
  COIN_OP_PARENT,
  FULFILLERS,
  printTypeToNumber,
} from "@/app/lib/constants";
import { parseEther } from "viem";
import { SellData } from "../types/sell.types";
import { dataURLToFile } from "@/app/lib/helpers/dataURLToFile";
import { ModalContext } from "@/app/providers";

const useSell = (sellData: SellData | null, dict: any) => {
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: chains.mainnet,
    transport: http("https://rpc.lens.xyz"),
  });
  const modalContext = useContext(ModalContext);
  const [createParentLoading, setCreateParentLoading] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<{
    physicalPrice: string;
    title: string;
    description: string;
    prompt: string;
    loras: string[];
    aiModel: string;
    tags: string[];
    maxPhysicalEditions: number;
    workflow: string;
  }>({
    physicalPrice: String(Number(sellData?.fulfiller.base) * 10 ** 18),
    title: "",
    description: "",
    prompt: "",
    loras: [],
    aiModel: "",
    tags: [],
    maxPhysicalEditions: 1,
    workflow: "",
  });

  const [currentTag, setCurrentTag] = useState("");
  const [currentLora, setCurrentLora] = useState("");

  const handleReserveParent = async () => {
    if (!address || !sellData) return false;

    const physicalPriceFloat = parseFloat(formData.physicalPrice);
    if (
      !priceBreakdown ||
      Number.isNaN(physicalPriceFloat) ||
      physicalPriceFloat < priceBreakdown.minPrice
    ) {
      modalContext?.setError?.(
        dict?.Common?.priceBelowMinimum ?? dict?.Common?.error
      );
      return false;
    }

    setCreateParentLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: chains.mainnet,
        transport: custom((window as any).ethereum),
      });

      const frontImageFile = dataURLToFile(
        sellData.front.compositeImage,
        "front.png"
      );
      const frontRes = await fetch("/api/ipfs", {
        method: "POST",
        body: frontImageFile,
      });
      const frontJson = await frontRes.json();
      const frontImageCid = frontJson?.cid;

      let backImageCid = null;
      if (sellData.back?.compositeImage) {
        const backImageFile = dataURLToFile(
          sellData.back.compositeImage,
          "back.png"
        );
        const backRes = await fetch("/api/ipfs", {
          method: "POST",
          body: backImageFile,
        });
        const backJson = await backRes.json();
        backImageCid = backJson?.cid;
      }

      const childrenCanvasUploads = await Promise.all(
        [
          ...(sellData?.front.children || [])?.filter(
            (child) => child?.canvasImage
          ),
          ...(sellData?.back?.children || [])?.filter(
            (child) => child?.canvasImage
          ),
        ].map(async (child) => {
          const canvasFile = dataURLToFile(
            child.canvasImage,
            `child-${child.childId}.png`
          );
          const res = await fetch("/api/ipfs", {
            method: "POST",
            body: canvasFile,
          });
          const json = await res.json();
          return {
            uri: "ipfs://" + json?.cid,
            type: "image/png",
          };
        })
      );

      let attachments = [];
      if (backImageCid) {
        attachments.push({
          uri: `ipfs://${backImageCid}`,
          type: "image/png",
        });
      }
      attachments.push(...childrenCanvasUploads);

      const ipfsRes = await fetch("/api/ipfs", {
        method: "POST",
        headers: {
          contentType: "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          image: `ipfs://${frontImageCid}`,
          tags: [sellData.type, ...formData.tags],
          prompt: formData.prompt,
          attachments,
          aiModel: formData.aiModel,
          loras: formData.loras,
          workflow: formData.workflow,
        }),
      });
      const json = await ipfsRes.json();

      const metadataUri = "ipfs://" + json?.cid;

      const reserveParentParams = {
        digitalPrice: BigInt(0),
        physicalPrice: parseEther(formData.physicalPrice || "0"),
        maxDigitalEditions: BigInt(0),
        maxPhysicalEditions: BigInt(formData.maxPhysicalEditions || "0"),
        printType: printTypeToNumber[sellData.type],
        availability: 1,
        digitalMarketsOpenToAll: false,
        physicalMarketsOpenToAll: false,
        uri: metadataUri,
        childReferences: [
          {
            childContract: sellData.front.templateContract,
            childId: sellData.front.templateId,
            prepaidAmount: BigInt("0"),
            prepaidUsed: BigInt("0"),
            futuresCreditsReserved: BigInt("0"),
            placementURI:
              "ipfs://QmNdShwAyD38iv2pWRP2QHtFTS4rCSrJFbqmhZ6ArWTdYp",
            amount: 1,
          },
          ...(sellData.back
            ? [
                {
                  childContract: sellData.back.templateContract,
                  childId: sellData.back.templateId,
                  prepaidAmount: BigInt("0"),
                  prepaidUsed: BigInt("0"),
                  futuresCreditsReserved: BigInt("0"),
                  placementURI:
                    "ipfs://QmNdShwAyD38iv2pWRP2QHtFTS4rCSrJFbqmhZ6ArWTdYp",
                  amount: 1,
                },
              ]
            : []),
          {
            childContract: sellData.material?.childContract,
            childId: sellData.material?.childId,
            prepaidAmount: BigInt("0"),
            prepaidUsed: BigInt("0"),
            futuresCreditsReserved: BigInt("0"),
            placementURI:
              "ipfs://QmNdShwAyD38iv2pWRP2QHtFTS4rCSrJFbqmhZ6ArWTdYp",
            amount: 1,
          },
          {
            childContract: sellData.color?.childContract,
            childId: sellData.color?.childId,
            prepaidAmount: BigInt("0"),
            prepaidUsed: BigInt("0"),
            futuresCreditsReserved: BigInt("0"),
            placementURI:
              "ipfs://QmNdShwAyD38iv2pWRP2QHtFTS4rCSrJFbqmhZ6ArWTdYp",
            amount: 1,
          },
        ],
        authorizedMarkets: [COIN_OP_MARKET],
        supplyRequests: [],
        workflow: {
          digitalSteps: [],
          estimatedDeliveryDuration: 1209600,
          physicalSteps: [
            {
              primaryPerformer: BigInt(FULFILLERS[0].fulfillerId),
              instructions: "Manufactory Fulfillment",
              subPerformers: [],
            },
          ],
        },
      };

      const { request } = await publicClient.simulateContract({
        address: COIN_OP_PARENT,
        abi: ABIS.FGOParent,
        functionName: "reserveParent",
        chain: chains.mainnet,
        args: [reserveParentParams],
        account: address,
      });

      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      modalContext?.setModalSuccess(dict?.Common?.successParent);
    } catch (err: any) {
      console.error(err.message);
    }
    setCreateParentLoading(false);
  };

  const priceBreakdown = useMemo(() => {
    if (!sellData) return null;

    const templatePrice =
      parseFloat(sellData?.front?.template?.physicalPrice) / 10 ** 18 +
      parseFloat(sellData?.back?.template?.physicalPrice ?? "0") / 10 ** 18;
    const materialPrice =
      parseFloat(sellData?.material?.child?.physicalPrice) / 10 ** 18;
    const colorPrice =
      parseFloat(sellData?.color?.child?.physicalPrice) / 10 ** 18;
    const fulfillmentBasePrice = sellData?.fulfiller?.base;

    let childrenPrice = 0;
    sellData?.front?.children?.forEach((child) => {
      childrenPrice += parseFloat(child?.child?.physicalPrice) / 10 ** 18;
    });
    if (sellData?.back) {
      sellData?.back?.children?.forEach((child) => {
        childrenPrice += parseFloat(child?.child?.physicalPrice) / 10 ** 18;
      });
    }

    const suppliersTotal =
      templatePrice + materialPrice + colorPrice + childrenPrice;
    const userPhysicalPrice =
      parseFloat(formData.physicalPrice) || fulfillmentBasePrice;
    const fulfillmentVigPercentage = sellData?.fulfiller?.vig / 100;
    const fulfillmentVigAmount = userPhysicalPrice * fulfillmentVigPercentage;
    const fulfillmentTotal = fulfillmentBasePrice + fulfillmentVigAmount;
    const designerReceives = userPhysicalPrice - fulfillmentTotal;
    const totalPrice = suppliersTotal + userPhysicalPrice;

    return {
      templatePrice,
      childrenPrice,
      materialPrice,
      suppliersTotal,
      fulfillmentBasePrice,
      fulfillmentVigAmount,
      fulfillmentTotal,
      userPhysicalPrice,
      designerReceives,
      totalPrice,
      minPrice: fulfillmentBasePrice,
    };
  }, [sellData, formData.physicalPrice]);

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(currentTag.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, currentTag.trim()],
        });
      }
      setCurrentTag("");
    }
  };

  const handleLoraKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentLora.trim()) {
      e.preventDefault();
      if (!formData.loras.includes(currentLora.trim())) {
        setFormData({
          ...formData,
          loras: [...formData.loras, currentLora.trim()],
        });
      }
      setCurrentLora("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, index) => index !== indexToRemove),
    });
  };

  const removeLora = (indexToRemove: number) => {
    setFormData({
      ...formData,
      loras: formData.loras.filter((_, index) => index !== indexToRemove),
    });
  };

  return {
    createParentLoading,
    handleReserveParent,
    formData,
    setFormData,
    priceBreakdown,
    currentTag,
    setCurrentTag,
    currentLora,
    setCurrentLora,
    handleTagKeyPress,
    handleLoraKeyPress,
    removeTag,
    removeLora,
  };
};

export default useSell;
