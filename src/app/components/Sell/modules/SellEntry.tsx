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
    <div className="relative w-full h-full flex flex-col gap-5">
      <div className="relative w-full h-full flex flex-col overflow-y-scroll gap-8 justify-start items-start overflow-x-hidden p-6">
        <div className="relative w-full flex flex-col gap-4">
          <h1 className="font-bit text-3xl text-white">
            {dict?.Common?.reserveParent}
          </h1>
          <div className="text-white/80 font-herm text-sm">
            {dict?.Common?.reserveDesc}
          </div>
          <div className="w-full h-px bg-white/20"></div>
        </div>
        <div className="relative w-full flex flex-col lg:flex-row gap-6">
          <div className="relative w-full lg:w-1/2 flex flex-col gap-4">
            <h2 className="font-satB text-lg text-white">
              {dict?.Common?.front}
            </h2>
            <div className="relative w-full h-80 bg-black border border-white/20 rounded-sm overflow-hidden">
              {sellData?.front?.compositeImage && (
                <Image
                  src={sellData?.front?.compositeImage}
                  alt="Front design"
                  fill
                  className="object-contain rounded-sm"
                  draggable={false}
                />
              )}
            </div>
          </div>
          {sellData?.back && (
            <div className="relative w-full lg:w-1/2 flex flex-col gap-4">
              <h2 className="font-satB text-lg text-white">
                {dict?.Common?.back}
              </h2>
              <div className="relative w-full h-80 bg-black border border-white/20 rounded-sm overflow-hidden">
                <Image
                  src={sellData?.back?.compositeImage}
                  alt="Back design"
                  fill
                  className="object-contain rounded-sm"
                  draggable={false}
                />
              </div>
            </div>
          )}
        </div>
        {(sellData?.front?.children?.length ||
          sellData?.back?.children?.length) && (
          <div className="relative w-full flex flex-col gap-4">
            <h2 className="font-satB text-lg text-white">
              {dict?.Common?.designPatches}
            </h2>
            <div className="relative w-full flex flex-wrap gap-4">
              {sellData?.front?.children
                ?.filter((child) => child?.canvasImage)
                ?.map((child, index) => (
                  <div
                    key={`front-${index}`}
                    className="relative flex flex-col gap-2"
                  >
                    <div className="relative w-20 h-20 bg-black border border-white/20 rounded-sm overflow-hidden">
                      {child.canvasImage && (
                        <Image
                          src={child.canvasImage}
                          alt={`Front patch ${index + 1}`}
                          fill
                          className="object-contain rounded-sm"
                          draggable={false}
                        />
                      )}
                    </div>
                    <span className="text-xs text-white/70 text-center font-sat">
                      {dict?.Common?.front} {index + 1}
                    </span>
                  </div>
                ))}
              {sellData?.back?.children?.map((child, index) => (
                <div
                  key={`back-${index}`}
                  className="relative flex flex-col gap-2"
                >
                  <div className="relative w-20 h-20 bg-black border border-white/20 rounded-sm overflow-hidden">
                    {child.canvasImage && (
                      <Image
                        src={child.canvasImage}
                        alt={`Back patch ${index + 1}`}
                        fill
                        className="object-contain rounded-sm"
                        draggable={false}
                      />
                    )}
                  </div>
                  <span className="text-xs text-white/70 text-center font-sat">
                    {dict?.Common?.back} {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="relative w-full flex flex-col gap-4">
          <h2 className="font-satB text-lg text-white">
            {dict?.Common?.template}
          </h2>
          <div className="relative w-full p-4 bg-black/50 border border-white/20 rounded-sm">
            <div className="flex flex-row gap-4 items-center">
              <div className="relative w-20 h-20 bg-black border border-white/20 rounded-sm overflow-hidden">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/${
                    sellData?.front?.template?.metadata?.image.split(
                      "ipfs://"
                    )?.[1]
                  }`}
                  alt={sellData?.front?.template?.metadata?.title}
                  fill
                  className="object-contain rounded-sm"
                  draggable={false}
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="font-sat text-white text-sm">
                  {sellData?.front?.template?.metadata?.title}
                </h3>
                <p className="font-herm text-white/60 text-xs">
                  {formatPrice(sellData?.front?.template?.physicalPrice)} MONA
                </p>
              </div>
            </div>
          </div>
        </div>
        {(sellData?.front?.children?.length > 0 ||
          (sellData?.back && sellData?.back?.children?.length > 0)) && (
          <div className="relative w-full flex flex-col gap-4">
            <h2 className="font-satB text-lg text-white">
              {dict?.Common?.templateChildren}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    key={`front-${index}`}
                    className="relative w-full p-4 bg-black/50 border border-white/20 rounded-sm"
                  >
                    <div className="flex flex-row gap-4 items-center">
                      <div className="relative w-16 h-16 bg-black border border-white/20 rounded-sm overflow-hidden">
                        <Image
                          src={`${INFURA_GATEWAY}/ipfs/${
                            child?.child?.metadata?.image.split("ipfs://")?.[1]
                          }`}
                          alt={child?.child?.metadata?.title}
                          fill
                          className="object-contain rounded-sm"
                          draggable={false}
                        />
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <h3 className="font-sat text-white text-xs">
                          {child?.child?.metadata?.title}
                        </h3>
                        <p className="font-herm text-white/60 text-xxs">
                          {formatPrice(child?.child?.physicalPrice)} MONA
                        </p>
                        <p className="font-herm text-white/40 text-xxs">
                          Front
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
              {sellData?.back &&
                sellData?.back?.children?.map(
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
                      key={`back-${index}`}
                      className="relative w-full p-4 bg-black/50 border border-white/20 rounded-sm"
                    >
                      <div className="flex flex-row gap-4 items-center">
                        <div className="relative w-16 h-16 bg-black border border-white/20 rounded-sm overflow-hidden">
                          <Image
                            src={`${INFURA_GATEWAY}/ipfs/${
                              child?.child?.metadata?.image.split(
                                "ipfs://"
                              )?.[1]
                            }`}
                            alt={child?.child?.metadata?.title}
                            fill
                            className="object-contain rounded-sm"
                            draggable={false}
                          />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                          <h3 className="font-sat text-white text-xs">
                            {child?.child?.metadata?.title}
                          </h3>
                          <p className="font-herm text-white/60 text-xxs">
                            {formatPrice(child?.child?.physicalPrice)} MONA
                          </p>
                          <p className="font-herm text-white/40 text-xxs">
                            Back
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
            </div>
          </div>
        )}
        <div className="relative w-full flex flex-col gap-4">
          <h2 className="font-satB text-lg text-white">
            {dict?.Common?.materialChildren}
          </h2>
          <div className="relative w-full p-4 bg-black/50 border border-white/20 rounded-sm">
            <div className="flex flex-row gap-4 items-center">
              <div className="relative w-20 h-20 bg-black border border-white/20 rounded-sm overflow-hidden">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/${
                    sellData?.material?.child?.metadata?.image.split(
                      "ipfs://"
                    )?.[1]
                  }`}
                  alt={sellData?.material?.child?.metadata?.title}
                  fill
                  className="object-cover rounded-sm"
                  draggable={false}
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="font-monu text-white text-sm">
                  {sellData?.material?.child?.metadata?.title}
                </h3>
                <p className="font-monu text-white/60 text-xs">
                  {formatPrice(sellData?.material?.child?.physicalPrice)} MONA
                </p>
                <p className="font-monu text-white/40 text-xxs">
                  {sellData?.material?.child?.metadata?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full flex flex-col gap-4">
          <h2 className="font-satB text-lg text-white">
            {dict?.Common?.colorChildren}
          </h2>
          <div className="relative w-full p-4 bg-black/50 border border-white/20 rounded-sm">
            <div className="flex flex-row gap-4 items-center">
              <div className="relative w-20 h-20 bg-black border border-white/20 rounded-sm overflow-hidden">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/${
                    sellData?.color?.child?.metadata?.image.split(
                      "ipfs://"
                    )?.[1]
                  }`}
                  alt={sellData?.color?.child?.metadata?.title}
                  fill
                  className="object-cover rounded-sm"
                  draggable={false}
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="font-monu text-white text-sm">
                  {sellData?.color?.child?.metadata?.title}
                </h3>
                <p className="font-monu text-white/60 text-xs">
                  {formatPrice(sellData?.color?.child?.physicalPrice)} MONA
                </p>
                <p className="font-monu text-white/40 text-xxs">
                  {sellData?.color?.child?.metadata?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full flex flex-col gap-4">
          <h2 className="font-satB text-lg text-white">
            {dict?.Common?.fulfiller}
          </h2>
          <div className="relative w-full p-4 bg-black/50 border border-white/20 rounded-sm">
            <div className="flex flex-col gap-2">
              <h3 className="font-monu text-white text-sm">
                {sellData?.fulfiller?.title}
              </h3>
              <p className="font-monu text-white/60 text-xs">
                {dict?.Common?.baseFee}: {sellData?.fulfiller?.base} MONA
              </p>
              <p className="font-monu text-white/60 text-xs">
                {dict?.Common?.vig}: {sellData?.fulfiller?.vig} %
              </p>
              <p className="font-monu text-white/40 text-xxs font-mono">
                {dict?.Common?.address}: {sellData?.fulfiller?.address}
              </p>
            </div>
          </div>
        </div>
        <div className="relative w-full flex flex-col gap-4">
          <h2 className="font-satB text-lg text-white">
            {dict?.Common?.details}
          </h2>
          <div className="relative w-full flex flex-col gap-2">
            <label className="font-sat text-white text-sm">
              {dict?.Common?.physicalPrice} {dict?.Common?.required}
              {priceBreakdown && (
                <span className="font-herm text-white/60 text-xs ml-2">
                  ({dict?.Common?.minPrice}:{" "}
                  {priceBreakdown.minPrice.toFixed(2)}) MONA
                </span>
              )}
            </label>
            <input
              type="number"
              step="0.0001"
              min={priceBreakdown?.minPrice || 0}
              value={formData.physicalPrice}
              onChange={(e) =>
                setFormData({ ...formData, physicalPrice: e.target.value })
              }
              className="w-full p-3 bg-black border border-white/20 rounded-sm font-monu text-white text-sm focus:outline-none focus:border-white/50"
              placeholder={`${dict?.Common?.physicalPrice?.replace(
                " *",
                ""
              )} (${dict?.Common?.minPrice} ${
                priceBreakdown?.minPrice.toFixed(2) || "0.0000"
              } MONA)`}
              required
            />
          </div>
          <div className="relative w-full flex flex-col gap-2">
            <label className="font-sat text-white text-sm">
              {dict?.Common?.maxPhysicalEditions} {dict?.Common?.required}
            </label>
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
              className="w-full p-3 bg-black border border-white/20 rounded-sm font-monu text-white text-sm focus:outline-none focus:border-white/50"
              placeholder={dict?.Common?.maxPhysicalEditionsPlaceholder}
              required
            />
          </div>
          <div className="relative w-full flex flex-col gap-2">
            <label className="font-sat text-white text-sm">
              {dict?.Common?.title} {dict?.Common?.required}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-3 bg-black border border-white/20 rounded-sm font-monu text-white text-sm focus:outline-none focus:border-white/50"
              placeholder={dict?.Common?.titlePlaceholder}
              required
            />
          </div>
          <div className="relative w-full flex flex-col gap-2">
            <label className="font-sat text-white text-sm">
              {dict?.Common?.description} {dict?.Common?.required}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-3 bg-black border border-white/20 rounded-sm font-monu text-white text-sm focus:outline-none focus:border-white/50 min-h-20"
              placeholder={dict?.Common?.descriptionPlaceholder}
              required
            />
          </div>
          <div className="relative w-full flex flex-col gap-2">
            <label className="font-sat text-white text-sm">
              {dict?.Common?.prompt}
            </label>
            <textarea
              value={formData.prompt}
              onChange={(e) =>
                setFormData({ ...formData, prompt: e.target.value })
              }
              className="w-full p-3 bg-black border border-white/20 rounded-sm font-monu text-white text-sm focus:outline-none focus:border-white/50"
              placeholder={dict?.Common?.promptPlaceholder}
            />
          </div>

          <div className="relative w-full flex flex-col gap-2">
            <label className="font-sat text-white text-sm">
              {dict?.Common?.tags} {dict?.Common?.required}
            </label>
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={handleTagKeyPress}
              className="w-full p-3 bg-black border border-white/20 rounded-sm font-monu text-white text-sm focus:outline-none focus:border-white/50"
              placeholder={dict?.Common?.tagsPlaceholder}
            />
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-black border border-white/20 rounded-sm px-2 py-1"
                  >
                    <span className="font-monu text-white text-xs">{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="font-monu text-white/60 hover:text-white text-xs ml-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative w-full flex flex-col gap-2">
            <label className="font-sat text-white text-sm">
              {dict?.Common?.loras}
            </label>
            <input
              type="text"
              value={currentLora}
              onChange={(e) => setCurrentLora(e.target.value)}
              onKeyPress={handleLoraKeyPress}
              className="w-full p-3 bg-black border border-white/20 rounded-sm font-monu text-white text-sm focus:outline-none focus:border-white/50"
              placeholder={dict?.Common?.lorasPlaceholder}
            />
            {formData.loras.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.loras.map((lora, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-black border border-white/20 rounded-sm px-2 py-1"
                  >
                    <span className="font-monu text-white text-xs">{lora}</span>
                    <button
                      type="button"
                      onClick={() => removeLora(index)}
                      className="font-monu text-white/60 hover:text-white text-xs ml-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative w-full flex flex-col gap-2">
            <label className="font-sat text-white text-sm">
              {dict?.Common?.aiModel}
            </label>
            <input
              type="text"
              value={formData.aiModel}
              onChange={(e) =>
                setFormData({ ...formData, aiModel: e.target.value })
              }
              className="w-full p-3 bg-black border border-white/20 rounded-sm font-monu text-white text-sm focus:outline-none focus:border-white/50"
              placeholder={dict?.Common?.aiModelPlaceholder}
            />
          </div>

          <div className="relative w-full flex flex-col gap-2">
            <label className="font-sat text-white text-sm">
              {dict?.Common?.workflow}
            </label>
            <textarea
              value={formData.workflow}
              onChange={(e) =>
                setFormData({ ...formData, workflow: e.target.value })
              }
              className="w-full p-3 bg-black border border-white/20 rounded-sm font-monu text-white text-sm focus:outline-none focus:border-white/50 min-h-24"
              placeholder={dict?.Common?.workflowPlaceholder}
            />
          </div>
        </div>
        {priceBreakdown &&
          formData.physicalPrice &&
          parseFloat(formData.physicalPrice) >= priceBreakdown.minPrice && (
            <div className="relative w-full flex flex-col gap-4">
              <h2 className="font-satB text-lg text-white">
                {dict?.Common?.revenueBreakdown}
              </h2>
              <div className="relative w-full p-4 bg-black/50 border border-white/20 rounded-sm">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-satB text-white/80 text-sm">
                      {dict?.Common?.suppliersReceive}
                    </h3>
                    <div className="flex justify-between items-center pl-4">
                      <span className="font-herm text-white/60 text-xs">
                        {dict?.Common?.templateMaterialChildren}
                      </span>
                      <span className="font-monu text-white text-xs">
                        {priceBreakdown.suppliersTotal.toFixed(2)} MONA
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="font-satB text-white/80 text-sm">
                      {dict?.Common?.fulfillerReceives}
                    </h3>
                    <div className="flex justify-between items-center pl-4">
                      <span className="font-herm text-white/60 text-xs">
                        {dict?.Common?.baseFee}:
                      </span>
                      <span className="font-monu text-white text-xs">
                        {priceBreakdown.fulfillmentBasePrice.toFixed(2)} MONA
                      </span>
                    </div>
                    <div className="flex justify-between items-center pl-4">
                      <span className="font-herm text-white/60 text-xs">
                        {dict?.Common?.vig} ({sellData?.fulfiller?.vig}%):
                      </span>
                      <span className="font-monu text-white text-xs">
                        {priceBreakdown.fulfillmentVigAmount.toFixed(2)} MONA
                      </span>
                    </div>
                    <div className="flex justify-between items-center pl-4 border-t border-white/10 pt-1">
                      <span className="font-herm text-white/60 text-xs font-bold">
                        {dict?.Common?.fulfillerTotal}
                      </span>
                      <span className="font-monu text-white text-xs font-bold">
                        {priceBreakdown.fulfillmentTotal.toFixed(2)} MONA
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="font-satB text-white/80 text-sm">
                      {dict?.Common?.youReceive}
                    </h3>
                    <div className="flex justify-between items-center pl-4">
                      <span className="font-herm text-white/60 text-xs">
                        {dict?.Common?.yourPriceFulfillerCosts}
                      </span>
                      <span className="font-monu text-white text-xs">
                        {priceBreakdown.designerReceives.toFixed(2)} MONA
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-px bg-white/20 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="font-satB text-white text-sm">
                      {dict?.Common?.totalParentPrice}
                    </span>
                    <span className="font-monu text-white text-sm font-bold">
                      {priceBreakdown.totalPrice.toFixed(2)} MONA
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        <div className="relative w-full flex flex-col gap-4">
          <button
            className="relative w-full p-4 bg-black border border-white font-bit text-white text-base hover:bg-white hover:text-black transition-colors duration-200 rounded-sm cursor-pointer active:scale-95"
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
