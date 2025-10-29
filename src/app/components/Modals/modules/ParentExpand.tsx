import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import { ImCross } from "react-icons/im";
import copy from "copy-to-clipboard";
import { BiCopy } from "react-icons/bi";
import { ModalContext } from "@/app/providers";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import PrintTag from "../../Prerolls/modules/PrintTag";
import { AiOutlineCode } from "react-icons/ai";

const ParentExpand: FunctionComponent<{
  dict: any;
}> = ({ dict }): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm grid grid-flow-col auto-cols-auto w-full h-auto overflow-y-auto">
      <div className="relative w-full lg:w-fit max-h-[90vh] overflow-y-scroll col-start-1 place-self-center bg-black rounded-lg p-3">
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-full sm:w-fit h-full grid grid-flow-row auto-rows-auto gap-4 pb-8">
              <div className="relative w-fit h-fit row-start-1 self-center justify-self-end cursor-pointer">
                <ImCross
                  color="white"
                  size={12}
                  onClick={() => context?.setParentExpand(undefined)}
                />
              </div>
              <div className="relative w-fit h-fit flex flex-row gap-2">
                <div
                  className="relative flex cursor-pointer active:scale-95 hover:opacity-50 items-center justify-center"
                  title="FGO"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(
                      `https://fgo.themanufactory.xyz/library/parent/${context?.parentExpand?.parentContract}/${context?.parentExpand?.designId}`
                    );
                  }}
                >
                  <AiOutlineCode color="white" size={16} />
                </div>
              </div>
              <div className="relative w-[90vw] sm:w-fit h-full flex flex-col gap-6">
                <div className="relative w-full flex flex-col lg:flex-row justify-between items-stretch gap-6">
                  <div className="relative w-full lg:w-80 h-80 rounded-md border border-white/70 p-3 flex items-center justify-center">
                    <div
                      className="relative w-full h-full object-cover flex items-center justify-center cursor-pointer overflow-hidden"
                      onClick={() =>
                        context?.setVerImagen(
                          `${INFURA_GATEWAY}/ipfs/${
                            context?.parentExpand?.metadata?.image?.split(
                              "ipfs://"
                            )?.[1]
                          }`
                        )
                      }
                    >
                      <Image
                        src={`${INFURA_GATEWAY}/ipfs/${
                          context?.parentExpand?.metadata?.image?.split(
                            "ipfs://"
                          )?.[1]
                        }`}
                        layout="fill"
                        objectFit="cover"
                        objectPosition={"center"}
                        alt={context?.parentExpand?.metadata?.title}
                        draggable={false}
                      />
                    </div>
                  </div>

                  <div className="relative w-full lg:w-fit flex flex-col gap-5 text-white font-mana text-left lg:text-right">
                    <div className="flex flex-col gap-2 items-start lg:items-end justify-end w-full relative">
                      <div className="w-full relative flex text-3xl uppercase justify-start lg:justify-end items-start lg:items-end">
                        {context?.parentExpand?.metadata?.title}
                      </div>
                      <div className="text-sm w-full flex relative justify-start lg:justify-end items-start lg:items-end text-ama break-all">
                        {context?.parentExpand?.metadata?.description}
                      </div>
                    </div>

                    {context?.parentExpand?.designerProfile && (
                      <div className="flex font-aqua text-xs items-start lg:items-end">
                        <div className="text-white text-sm">
                          {context?.parentExpand?.designerProfile?.metadata
                            ?.title ??
                            `${context?.parentExpand?.designer?.slice(
                              0,
                              6
                            )}...${context?.parentExpand?.designer?.slice(-4)}`}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col text-left lg:text-right gap-3 text-xs relative w-full lg:w-fit items-start lg:items-end">
                      <div className="relative text-xl text-white font-aqua flex justify-start lg:justify-end items-start lg:items-end w-full lg:w-fit">
                        $MONA{" "}
                        {(Number(context?.parentExpand?.physicalPrice) +
                          Number(
                            context?.parentExpand?.childReferences?.reduce(
                              (accumulator, currentItem) =>
                                accumulator +
                                Number(currentItem.child?.physicalPrice),
                              0
                            )
                          )) /
                          10 ** 18}{" "}
                      </div>
                      <div className="flex w-full lg:w-fit justify-start lg:justify-end">
                        <PrintTag
                          dict={dict}
                          backgroundColor={
                            context?.parentExpand?.metadata?.tags.includes(
                              "hoodie"
                            )
                              ? "#32C5FF"
                              : context?.parentExpand?.metadata?.tags.includes(
                                  "shirt"
                                )
                              ? "#6236FF"
                              : context?.parentExpand?.metadata?.tags.includes(
                                  "poster"
                                )
                              ? "#FFC800"
                              : context?.parentExpand?.metadata?.tags.includes(
                                  "sticker"
                                )
                              ? "#29C28A"
                              : "#B620E0"
                          }
                          type={
                            context?.parentExpand?.metadata?.tags?.[0] as any
                          }
                        />
                      </div>

                      <div className="flex flex-col gap-1 items-start lg:items-end font-aqua">
                        <div className="text-moda font-monu uppercase tracking-wide">
                          {dict.ParentExpand?.editionInfo}
                        </div>
                        <div className="text-white text-xs">
                          {context?.parentExpand?.currentPhysicalEditions} /{" "}
                          {context?.parentExpand?.maxPhysicalEditions}{" "}
                          {dict.ParentExpand?.editions}
                        </div>
                        <div className="text-white text-xxs">
                          {dict.ParentExpand?.totalPurchases}:{" "}
                          {context?.parentExpand?.totalPurchases}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 font-aqua text-xs text-white">
                  {context?.parentExpand?.childReferences &&
                    context?.parentExpand?.childReferences?.length > 0 && (
                      <div className="flex flex-col gap-3">
                        <div className="text-leg font-monu uppercase tracking-wide">
                          {dict?.ParentExpand?.childReferences}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 relative w-fit h-fit gap-2">
                          {context?.parentExpand?.childReferences?.map(
                            (ref, index) => (
                              <div
                                key={index}
                                className="p-3 cursor-pointer flex flex-row gap-2 items-center justify-center w-fit h-fit flex-wrap"
                                onClick={() =>
                                  window.open(
                                    ref?.isTemplate
                                      ? `https://fgo.themanufactory.xyz/library/template/${ref?.childContract}/${ref?.childId}`
                                      : `https://fgo.themanufactory.xyz/library/child/${ref?.childContract}/${ref?.childId}`,
                                    "_blank"
                                  )
                                }
                              >
                                {ref?.child?.metadata?.image && (
                                  <div className="relative w-fit h-fit flex">
                                    <div className="relative w-12 h-12 flex">
                                      <Image
                                        layout="fill"
                                        objectFit="cover"
                                        draggable={false}
                                        src={`${INFURA_GATEWAY}/ipfs/${
                                          ref?.child?.metadata?.image?.split(
                                            "ipfs://"
                                          )?.[1]
                                        }`}
                                        alt={ref?.child?.metadata?.title}
                                      />
                                    </div>
                                  </div>
                                )}
                                <div className="relative flex-col flex gap-2">
                                  <div className="text-white text-sm">
                                    {ref?.isTemplate
                                      ? dict?.ParentExpand?.template
                                      : dict?.ParentExpand?.child}
                                  </div>
                                  <div className="text-moda text-xxs">
                                    {ref?.child?.metadata?.title ??
                                      `${ref?.childContract?.slice(5)}...`}
                                  </div>
                                  <div>
                                    {dict?.ParentExpand?.amount}: {ref?.amount}
                                  </div>
                                  {ref?.metadata?.instructions && (
                                    <div className="text-moda text-xxs mt-1 leading-relaxed">
                                      {ref?.metadata?.instructions}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {context?.parentExpand?.workflow && (
                    <div className="flex flex-col gap-3">
                      <div className="text-leg font-monu uppercase tracking-wide">
                        {dict?.ParentExpand?.workflow}
                      </div>
                      <div className="text-white text-sm">
                        {dict?.ParentExpand?.estimatedDelivery}:{" "}
                        {context?.parentExpand?.workflow
                          ?.estimatedDeliveryDuration / 86400}{" "}
                        {dict?.ParentExpand?.days}
                      </div>
                      {context?.parentExpand?.workflow?.physicalSteps &&
                        context?.parentExpand?.workflow?.physicalSteps?.length >
                          0 && (
                          <div className="flex flex-col gap-2">
                            <div className="text-white/70">
                              {dict?.ParentExpand?.physicalSteps}:
                            </div>
                            {context?.parentExpand?.workflow?.physicalSteps?.map(
                              (step, index) => (
                                <div
                                  key={index}
                                  className="border border-white rounded-md p-3 flex flex-col gap-1"
                                >
                                  <div className="text-white text-sm">
                                    {dict?.ParentExpand?.step} {index + 1}
                                  </div>
                                  <div className="text-white/80 text-xxs leading-relaxed">
                                    {step?.instructions}
                                  </div>
                                  {step?.fulfiller && (
                                    <div className="text-white/60 text-xxs">
                                      {dict?.ParentExpand?.fulfiller}:{" "}
                                      {step?.fulfiller?.metadata?.title}
                                    </div>
                                  )}
                                  {step?.subPerformers &&
                                    step?.subPerformers?.length > 0 && (
                                      <div className="text-white/60 text-xxs">
                                        {dict?.ParentExpand?.subPerformers}:{" "}
                                        {step?.subPerformers?.length}
                                      </div>
                                    )}
                                </div>
                              )
                            )}
                          </div>
                        )}
                      {context?.parentExpand?.workflow?.digitalSteps &&
                        context?.parentExpand?.workflow?.digitalSteps?.length >
                          0 && (
                          <div className="flex flex-col gap-2">
                            <div className="text-white/70">
                              {dict?.ParentExpand?.digitalSteps}:
                            </div>
                            {context?.parentExpand?.workflow?.digitalSteps?.map(
                              (step, index) => (
                                <div
                                  key={index}
                                  className="border border-white/10 bg-white/5 rounded-md p-3 flex flex-col gap-1"
                                >
                                  <div className="text-white text-sm">
                                    {dict?.ParentExpand?.step} {index + 1}
                                  </div>
                                  <div className="text-white/80 text-xxs leading-relaxed">
                                    {step?.instructions}
                                  </div>
                                  {step?.fulfiller && (
                                    <div className="text-white/60 text-xxs">
                                      {dict?.ParentExpand?.fulfiller}:{" "}
                                      {step?.fulfiller?.metadata?.title}
                                    </div>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  )}

                  {context?.parentExpand?.metadata?.attachments &&
                    context?.parentExpand?.metadata?.attachments?.length >
                      0 && (
                      <div className="flex flex-col gap-3">
                        <div className="text-leg font-monu uppercase tracking-wide">
                          {dict?.ParentExpand?.attachments}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {context?.parentExpand?.metadata?.attachments?.map(
                            (attachment, index) => (
                              <div
                                key={index}
                                className="relative w-20 h-20 cursor-pointer overflow-hidden"
                                onClick={() =>
                                  context?.setVerImagen(
                                    `${INFURA_GATEWAY}/ipfs/${
                                      attachment?.uri?.split("ipfs://")?.[1]
                                    }`
                                  )
                                }
                              >
                                <Image
                                  src={`${INFURA_GATEWAY}/ipfs/${
                                    attachment?.uri?.split("ipfs://")?.[1]
                                  }`}
                                  layout="fill"
                                  objectFit="contain"
                                  alt={`attachment-${index}`}
                                  draggable={false}
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {context?.parentExpand?.metadata?.prompt && (
                <div className="flex gap-3 text-white text-xs">
                  <div className="relative w-full">
                    <textarea
                      disabled
                      value={context?.parentExpand?.metadata?.prompt}
                      className="w-full min-h-12 overflow-y-scroll max-h-48 p-3 text-left font-bit text-white text-xs leading-relaxed"
                      style={{ resize: "none" }}
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 p-1 ursor-pointer"
                      onClick={() =>
                        copy(context?.parentExpand?.metadata?.prompt!)
                      }
                      aria-label="Copy prompt"
                    >
                      <BiCopy size={15} color="white" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentExpand;
