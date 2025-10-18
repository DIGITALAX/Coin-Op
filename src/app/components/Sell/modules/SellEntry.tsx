"use client";

import { Child, SellProps } from "../types/sell.types";
import useSellData from "../hooks/useSellData";
import Image from "next/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { formatPrice } from "@/app/lib/helpers/formatPrice";
import useSell from "../hooks/useSell";
import { AiOutlineLoading } from "react-icons/ai";

export default function SellEntry({ dict, searchParams }: SellProps) {
  const { loading, error, sellData } = useSellData(searchParams);
  const {
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
  } = useSell(sellData, dict);
  if (loading) {
    return (
      <div className="relative min-h-screen w-full h-full items-center justify-center flex">
        <div className="relative w-fit h-fit flex flex-col items-center justify-center gap-3">
          <div className={`relative flex w-fit h-fit animate-spin`}>
            <AiOutlineLoading size={20} color="white" />
          </div>
          <div className="text-white font-bit text-sm">
            {dict?.Common?.loadingSellData}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full min-h-screen h-full items-center justify-center flex">
        <div className="relative w-fit h-fit flex flex-col items-center justify-center gap-3 p-6 border border-red-500/20 bg-red-500/10 rounded-sm">
          <div className="text-red-400 font-bit text-lg">
            {dict?.Common?.error}
          </div>
          <div className="text-red-300 font-herm text-sm text-center">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!sellData) {
    return (
      <div className="relative w-full h-full min-h-screen items-center justify-center flex">
        <div className="relative w-fit h-fit flex flex-col items-center justify-center gap-3 p-6 border border-white/20 bg-black/50 rounded-sm">
          <div className="text-white font-bit text-lg">
            {dict?.Common?.noData}
          </div>
          <div className="text-white/60 font-herm text-sm">
            {dict?.Common?.noSellData}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden w-full flex flex-col px-2 preG:px-6 gap-10 items-start justify-start pb-[32rem]">
      <div className="absolute bottom-0 left-0 flex w-full h-[60rem]">
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmUczkYYGyeMTKdRNmp8AX4AQc8Qvw6hR8nVnXKSfAuFdj`}
          draggable={false}
          layout="fill"
          objectFit="cover"
          alt="retro"
        />
      </div>
      <div className="relative w-full h-full flex flex-col gap-10 pt-8">
        <div className="realtive w-full h-fit flex flex-col gap-2">
          <div className="font-count flex text-3xl w-fit h-fit text-white uppercase">
            {dict?.Common?.reserveParent}
          </div>
          <div className="text-white font-mega text-sm w-full sm:w-3/4">
            {dict?.Common?.reserveDesc}
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-col lg:flex-row gap-6">
          <div className="relative w-full lg:w-1/2 flex flex-col gap-4">
            <div className="font-chic flex text-xl w-fit h-fit text-white">
              {dict?.Common?.front}
            </div>
            <div className="relative w-full bg-black border border-morado rounded-md overflow-hidden">
              {sellData?.front?.compositeImage && (
                <Image
                  src={sellData?.front?.compositeImage}
                  alt="Front design"
                  layout="responsive"
                  width={600}
                  height={600}
                  objectFit="contain"
                  className="rounded-md"
                  draggable={false}
                />
              )}
            </div>
          </div>
          {sellData?.back && (
            <div className="relative w-full lg:w-1/2 flex flex-col gap-4">
              <div className="font-chic flex text-xl w-fit h-fit text-white">
                {dict?.Common?.back}
              </div>
              <div className="relative w-full bg-black border border-morado rounded-md overflow-hidden">
                {sellData?.back?.compositeImage && (
                  <Image
                    src={sellData?.back?.compositeImage}
                    alt="Back design"
                    layout="responsive"
                    width={600}
                    height={600}
                    objectFit="contain"
                    className="rounded-md"
                    draggable={false}
                  />
                )}
              </div>
            </div>
          )}
        </div>
        <div className="relative w-full h-fit flex">
          <div className="absolute top-0 left-0 flex w-full h-full">
            <Image
              layout="fill"
              objectFit="cover"
              className="rounded-md"
              src={`${INFURA_GATEWAY}/ipfs/QmXZSyTXMxttm9jxioNH3k5L9uWpnbFTrTUK85muBen21F`}
              alt="spots"
              draggable={false}
            />
          </div>
          <div className="relative w-full h-fit flex overflow-y-scroll justify-start items-start p-4">
            <div className="w-full h-fit items-start justify-start grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              <div className="relative w-full h-fit flex flex-col rounded-lg bg-nube p-1">
                <div className="relative w-full h-80 flex rounded-lg bg-morado overflow-hidden">
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${
                      sellData?.front?.template?.metadata?.image.split(
                        "ipfs://"
                      )?.[1]
                    }`}
                    alt={sellData?.front?.template?.metadata?.title}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                    draggable={false}
                  />
                </div>
                <div className="relative w-full h-fit flex flex-col p-3 gap-2 items-start justify-start bg-black rounded-lg">
                  <div className="font-count text-white text-xs uppercase">
                    {dict?.Common?.template}
                  </div>
                  <div className="font-mega text-white text-sm">
                    {sellData?.front?.template?.metadata?.title}
                  </div>
                  <div className="font-mega text-white/60 text-xs">
                    {formatPrice(sellData?.front?.template?.physicalPrice)} MONA
                  </div>
                </div>
              </div>
              {sellData?.front?.children?.map(
                (
                  child: {
                    childId: string;
                    childContract: string;
                    child: Child;
                    canvasImage: string;
                  },
                  index: number
                ) => (
                  <div
                    key={index}
                    className="relative w-full h-fit flex flex-col rounded-lg bg-nube p-1"
                  >
                    <div className="relative w-full h-80 flex rounded-lg bg-arbol overflow-hidden">
                      <Image
                        src={`${INFURA_GATEWAY}/ipfs/${
                          child?.child?.metadata?.image.split("ipfs://")?.[1]
                        }`}
                        alt={child?.child?.metadata?.title}
                        layout="fill"
                        objectFit="contain"
                        className="rounded-lg"
                        draggable={false}
                      />
                    </div>
                    <div className="relative w-full h-fit flex flex-col p-3 gap-2 items-start justify-start bg-black rounded-lg">
                      <div className="font-count text-white text-xs uppercase">
                        Front
                      </div>
                      <div className="font-mega text-white text-sm">
                        {child?.child?.metadata?.title}
                      </div>
                      <div className="font-mega text-white/60 text-xs">
                        {formatPrice(child?.child?.physicalPrice)} MONA
                      </div>
                    </div>
                  </div>
                )
              )}
              {sellData?.back?.children?.map(
                (
                  child: {
                    childId: string;
                    childContract: string;
                    child: Child;
                    canvasImage: string;
                  },
                  index: number
                ) => (
                  <div
                    key={index}
                    className="relative w-full h-fit flex flex-col rounded-lg bg-nube p-1"
                  >
                    <div className="relative w-full h-80 flex rounded-lg bg-rosa overflow-hidden">
                      <Image
                        src={`${INFURA_GATEWAY}/ipfs/${
                          child?.child?.metadata?.image.split("ipfs://")?.[1]
                        }`}
                        alt={child?.child?.metadata?.title}
                        layout="fill"
                        objectFit="contain"
                        className="rounded-lg"
                        draggable={false}
                      />
                    </div>
                    <div className="relative w-full h-fit flex flex-col p-3 gap-2 items-start justify-start bg-black rounded-lg">
                      <div className="font-count text-white text-xs uppercase">
                        Back
                      </div>
                      <div className="font-mega text-white text-sm">
                        {child?.child?.metadata?.title}
                      </div>
                      <div className="font-mega text-white/60 text-xs">
                        {formatPrice(child?.child?.physicalPrice)} MONA
                      </div>
                    </div>
                  </div>
                )
              )}
              <div className="relative w-full h-fit flex flex-col rounded-lg bg-nube p-1">
                <div className="relative w-full h-80 flex rounded-lg bg-apagado overflow-hidden">
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${
                      sellData?.material?.child?.metadata?.image.split(
                        "ipfs://"
                      )?.[1]
                    }`}
                    alt={sellData?.material?.child?.metadata?.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                    draggable={false}
                  />
                </div>
                <div className="relative w-full h-fit flex flex-col p-3 gap-2 items-start justify-start bg-black rounded-lg">
                  <div className="font-count text-white text-xs uppercase">
                    {dict?.Common?.materialChildren}
                  </div>
                  <div className="font-mega text-white text-sm">
                    {sellData?.material?.child?.metadata?.title}
                  </div>
                  <div className="font-mega text-white/60 text-xs">
                    {formatPrice(sellData?.material?.child?.physicalPrice)} MONA
                  </div>
                </div>
              </div>
              <div className="relative w-full h-fit flex flex-col rounded-lg bg-nube p-1">
                <div className="relative w-full h-80 flex rounded-lg bg-mar overflow-hidden">
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${
                      sellData?.color?.child?.metadata?.image.split(
                        "ipfs://"
                      )?.[1]
                    }`}
                    alt={sellData?.color?.child?.metadata?.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                    draggable={false}
                  />
                </div>
                <div className="relative w-full h-fit flex flex-col p-3 gap-2 items-start justify-start bg-black rounded-lg">
                  <div className="font-count text-white text-xs uppercase">
                    {dict?.Common?.colorChildren}
                  </div>
                  <div className="font-mega text-white text-sm">
                    {sellData?.color?.child?.metadata?.title}
                  </div>
                  <div className="font-mega text-white/60 text-xs">
                    {formatPrice(sellData?.color?.child?.physicalPrice)} MONA
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-col gap-6">
          <div className="font-count flex text-xl w-fit h-fit text-white uppercase">
            {dict?.Common?.details}
          </div>
          <div className="relative w-full flex flex-col gap-3">
            <div className="relative w-full h-fit flex flex-col sm:flex-row gap-3">
              <div className="relative w-full sm:w-1/2 h-fit flex flex-col gap-1">
                <div className="font-mega text-white text-xs uppercase">
                  {dict?.Common?.physicalPrice}{" "}
                  {priceBreakdown &&
                    `(min: ${priceBreakdown.minPrice.toFixed(2)} MONA)`}
                </div>
                <input
                  type="number"
                  step="0.0001"
                  min={priceBreakdown?.minPrice || 0}
                  value={formData.physicalPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, physicalPrice: e.target.value })
                  }
                  className="bg-black font-mega text-white text-xs w-full flex py-1 px-4 h-10 border border-white"
                  style={{ transform: "skewX(-15deg)" }}
                  placeholder="0.0000"
                  required
                />
              </div>
              <div className="relative w-full sm:w-1/2 h-fit flex flex-col gap-1">
                <div className="font-mega text-white text-xs uppercase">
                  {dict?.Common?.maxPhysicalEditions}
                </div>
                <input
                  type="number"
                  min="1"
                  value={formData.maxPhysicalEditions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxPhysicalEditions: parseInt(e.target.value) || 1,
                    })
                  }
                  className="bg-black font-mega text-white text-xs w-full flex py-1 px-4 h-10 border border-white"
                  style={{ transform: "skewX(-15deg)" }}
                  placeholder="1"
                  required
                />
              </div>
            </div>
            <div className="relative w-full h-fit flex flex-col gap-1">
              <div className="font-mega text-white text-xs uppercase">
                {dict?.Common?.title}
              </div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="bg-black font-mega text-white text-xs w-full flex py-1 px-4 h-10 border border-agua"
                style={{ transform: "skewX(-15deg)" }}
                placeholder={dict?.Common?.titlePlaceholder}
                required
              />
            </div>
            <div className="relative w-full h-fit flex flex-col gap-1">
              <div className="font-mega text-white text-xs uppercase">
                {dict?.Common?.description}
              </div>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-black font-mega text-white text-xs w-full flex py-1 px-4 min-h-20 border border-agua"
                style={{ transform: "skewX(-15deg)" }}
                placeholder={dict?.Common?.descriptionPlaceholder}
                required
              />
            </div>
            <div className="relative w-full h-fit flex flex-col gap-1">
              <div className="font-mega text-white text-xs uppercase">
                {dict?.Common?.prompt}
              </div>
              <textarea
                value={formData.prompt}
                onChange={(e) =>
                  setFormData({ ...formData, prompt: e.target.value })
                }
                className="bg-black font-mega text-white text-xs w-full flex py-1 px-4 min-h-20 border border-agua"
                style={{ transform: "skewX(-15deg)" }}
                placeholder={dict?.Common?.promptPlaceholder}
              />
            </div>
            <div className="relative w-full h-fit flex flex-col sm:flex-row gap-3">
              <div className="relative w-full sm:w-1/2 h-fit flex flex-col gap-1">
                <div className="font-mega text-white text-xs uppercase">
                  {dict?.Common?.tags}
                </div>
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  className="bg-black font-mega text-white text-xs w-full flex py-1 px-4 h-10 border border-white"
                  style={{ transform: "skewX(-15deg)" }}
                  placeholder={dict?.Common?.tagsPlaceholder}
                />
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-agua px-2 py-1"
                      >
                        <span className="font-mega text-black text-xs">
                          {tag}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="font-mega text-black/60 cursor-pointer hover:text-black text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative w-full sm:w-1/2 h-fit flex flex-col gap-1">
                <div className="font-mega text-white text-xs uppercase">
                  {dict?.Common?.loras}
                </div>
                <input
                  type="text"
                  value={currentLora}
                  onChange={(e) => setCurrentLora(e.target.value)}
                  onKeyPress={handleLoraKeyPress}
                  className="bg-black font-mega text-white text-xs w-full flex py-1 px-4 h-10 border border-white"
                  style={{ transform: "skewX(-15deg)" }}
                  placeholder={dict?.Common?.lorasPlaceholder}
                />
                {formData.loras.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.loras.map((lora, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-agua px-2 py-1"
                      >
                        <span className="font-mega text-black text-xs">
                          {lora}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeLora(index)}
                          className="font-mega text-black/60 cursor-pointer hover:text-black text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="relative w-full h-fit flex flex-col gap-1">
              <div className="font-mega text-white text-xs uppercase">
                {dict?.Common?.aiModel}
              </div>
              <input
                type="text"
                value={formData.aiModel}
                onChange={(e) =>
                  setFormData({ ...formData, aiModel: e.target.value })
                }
                className="bg-black font-mega text-white text-xs w-full flex py-1 px-4 h-10 border border-agua"
                style={{ transform: "skewX(-15deg)" }}
                placeholder={dict?.Common?.aiModelPlaceholder}
              />
            </div>
            <div className="relative w-full h-fit flex flex-col gap-1">
              <div className="font-mega text-white text-xs uppercase">
                {dict?.Common?.workflow}
              </div>
              <textarea
                value={formData.workflow}
                onChange={(e) =>
                  setFormData({ ...formData, workflow: e.target.value })
                }
                className="bg-black font-mega text-white text-xs w-full flex py-1 px-4 min-h-24 border border-agua"
                style={{ transform: "skewX(-15deg)" }}
                placeholder={dict?.Common?.workflowPlaceholder}
              />
            </div>
          </div>
        </div>
        {priceBreakdown &&
          formData.physicalPrice &&
          parseFloat(formData.physicalPrice) >= priceBreakdown.minPrice && (
            <div className="relative w-full h-fit flex flex-col gap-4 p-4">
              <div className="font-count text-white text-3xl uppercase">
                {dict?.Common?.revenueBreakdown}
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <div className="font-mega text-white/90 text-xs uppercase">
                    {dict?.Common?.suppliersReceive}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mega text-agua text-xs">
                      {dict?.Common?.templateMaterialChildren}
                    </span>
                    <span className="font-mega text-white text-xs">
                      {priceBreakdown.suppliersTotal.toFixed(2)} MONA
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="font-mega text-white/90 text-xs uppercase">
                    {dict?.Common?.fulfillerReceives}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mega text-agua text-xs">
                      {dict?.Common?.baseFee}
                    </span>
                    <span className="font-mega text-white text-xs">
                      {priceBreakdown.fulfillmentBasePrice.toFixed(2)} MONA
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mega text-agua text-xs">
                      {dict?.Common?.vig} ({sellData?.fulfiller?.vig}%)
                    </span>
                    <span className="font-mega text-white text-xs">
                      {priceBreakdown.fulfillmentVigAmount.toFixed(2)} MONA
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-agua pt-1">
                    <span className="font-mega text-agua text-xs">
                      {dict?.Common?.fulfillerTotal}
                    </span>
                    <span className="font-mega text-white text-xs">
                      {priceBreakdown.fulfillmentTotal.toFixed(2)} MONA
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="font-mega text-white/90 text-xs uppercase">
                    {dict?.Common?.youReceive}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mega text-agua text-xs">
                      {dict?.Common?.yourPriceFulfillerCosts}
                    </span>
                    <span className="font-mega text-white text-xs">
                      {priceBreakdown.designerReceives.toFixed(2)} MONA
                    </span>
                  </div>
                </div>

                <div className="w-full h-px bg-agua"></div>
                <div className="flex justify-between items-center">
                  <span className="font-mega text-white text-sm uppercase">
                    {dict?.Common?.totalParentPrice}
                  </span>
                  <span className="font-mega text-white text-sm">
                    {priceBreakdown.totalPrice.toFixed(2)} MONA
                  </span>
                </div>
              </div>
            </div>
          )}
        <div className="relative w-fit h-fit flex">
          <button
            className="relative w-fit h-fit px-6 py-2 bg-lima border border-white font-mega text-white text-xs hover:opacity-80 transition-opacity cursor-pointer active:scale-95 uppercase"
            style={{ transform: "skewX(-15deg)" }}
            onClick={handleReserveParent}
            disabled={createParentLoading}
          >
            {createParentLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                {dict?.Common?.reserving}
              </div>
            ) : (
              dict?.Common?.reserveParent
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
