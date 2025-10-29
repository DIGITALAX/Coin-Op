import { FunctionComponent, JSX } from "react";
import Link from "next/link";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/legacy/image";
import { Details } from "../../Walkthrough/types/walkthrough.types";
import { OrderMarketProps } from "../types/account.types";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { convertDate } from "@/app/lib/helpers/convertDate";
import { useModal } from "connectkit";

const OrderMarket: FunctionComponent<OrderMarketProps> = ({
  order,
  orderOpen,
  setOrderOpen,
  index,
  handleDecryptFulfillment,
  decryptLoading,
  dict,
  connected,
  chainId,
}): JSX.Element => {
  const { openSwitchNetworks } = useModal();

  const formatDuration = (seconds: number): string => {
    if (seconds === 0) return "Not specified";

    const weeks = Math.floor(seconds / 604800);
    const days = Math.floor((seconds % 604800) / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const parts = [];
    if (weeks > 0) parts.push(`${weeks} ${weeks === 1 ? "week" : "weeks"}`);
    if (days > 0) parts.push(`${days} ${days === 1 ? "day" : "days"}`);
    if (hours > 0) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
    if (minutes > 0)
      parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);

    return parts.length > 0 ? parts.join(", ") : `${seconds} seconds`;
  };

  return (
    <div
      className={`relative w-full text-white border border-white bg-smo/10 p-2 h-fit`}
    >
      <div
        className="relative w-full h-28 sm:h-16 sm:gap-0 gap-3 inline-flex flex-wrap justify-between items-center font-herm text-sm cursor-pointer"
        onClick={() =>
          setOrderOpen((prev) => ({
            ...prev,
            market: orderOpen.map((open, i) => (index === i ? !open : open)),
          }))
        }
      >
        <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
          <div className="relative w-fit h-fit flex items-center justify-center">
            {dict?.Account?.id}
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center font-sat">
            {order.orderId}
          </div>
        </div>
        <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
          <div className="relative w-fit h-fit flex items-center justify-center">
            {dict?.Account?.price}
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center font-sat">
            {`$MONA`} {Number(order.totalPayments)}
          </div>
        </div>
        <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
          <div className="relative w-fit h-fit flex items-center justify-center">
            {dict?.Account?.status}
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center font-sat text-sol">
            {dict?.Account?.[order?.orderStatus]}
          </div>
        </div>
        <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
          <div className="relative w-fit h-fit flex items-center justify-center">
            {dict?.Account?.ful}
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center font-sat">
            {order?.fulfillment?.fulfillmentOrderSteps?.every(
              (item) => item.isCompleted
            )
              ? "Yes"
              : "No"}
          </div>
        </div>
      </div>
      {orderOpen[index] && (
        <div className="relative w-full flex h-60 gap-3 flex-col">
          <div className="relative w-full h-px flex bg-white"></div>
          <div
            className="relative w-full h-full flex overflow-y-scroll"
            id="xScroll"
          >
            <div className="relative w-full h-fit flex flex-col gap-8">
              <div className="relative w-full h-fit inline-flex justify-between flex-wrap items-center text-xs sm:gap-0 gap-3">
                <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                  <div className="relative w-fit h-fit flex items-center justify-center">
                    TX Hash
                  </div>
                  <Link
                    className="relative w-fit h-fit flex items-center justify-center font-sat cursor-pointer break-all"
                    href={`https://explorer.lens.xyz/tx/${order.transactionHash}`}
                    target="_blank"
                    rel={"noreferrer"}
                  >
                    {order.transactionHash}
                  </Link>
                </div>
                <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                  <div className="relative w-fit h-fit flex items-center justify-center">
                    {dict?.Account?.bloc}
                  </div>
                  <div className="relative w-fit h-fit flex items-center justify-center font-sat">
                    {order.blockNumber}
                  </div>
                </div>
                <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                  <div className="relative w-fit h-fit flex items-center justify-center">
                    {dict?.Account?.fec}
                  </div>
                  <div className="relative w-fit h-fit flex items-center justify-center font-sat">
                    {convertDate(order.blockTimestamp)}
                  </div>
                </div>
              </div>
              <div className="relative w-full h-fit items-start justify-center flex flex-col gap-2">
                <div className="relative w-fit h-fit flex items-center justify-center font-satB text-base break-all">
                  {dict?.Account?.mes}
                </div>
              </div>
              <div className="relative w-full h-fit flex flex-col gap-3 p-2 bg-sol/20">
                <div className="relative w-full h-fit justify-between inline-flex">
                  <div className="relative w-full h-fit justify-start flex items-center text-base font-monu">
                    {dict?.Account?.info}
                  </div>
                  {!order.decrypted && (
                    <div
                      className={`relative w-40 h-8 justify-center flex items-center flex-col text-base text-black font-monu border border-black bg-sol ${
                        !decryptLoading[index] &&
                        "cursor-pointer hover:opacity-70"
                      }`}
                      onClick={
                        connected && chainId !== 37111
                          ? () => openSwitchNetworks()
                          : (e) => {
                              e.stopPropagation();
                              !decryptLoading[index] &&
                                handleDecryptFulfillment(order, false);
                            }
                      }
                    >
                      <div
                        className={`relative flex w-fit h-fit items-center justify-center text-center text-xxs  ${
                          decryptLoading[index] && "animate-spin"
                        }`}
                      >
                        {decryptLoading[index] ? (
                          <AiOutlineLoading size={12} color="black" />
                        ) : (
                          dict?.Account?.dec
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative w-fit flex flex-wrap h-fit items-center text-xs break-all gap-4">
                  <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                    <div className="relative w-fit h-fit flex items-center justify-center font-satB break-all">
                      {dict?.Account?.addr}
                    </div>
                    <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all">
                      {!order.decrypted ? (
                        <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all">
                          {"@#$!(*A5Le3t"}
                        </div>
                      ) : (
                        <input
                          className="relative bg-black border border-white w-32 h-6 p-1 font-sat"
                          disabled
                          value={(order.fulfillmentData as Details)?.address}
                        />
                      )}
                    </div>
                  </div>
                  <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                    <div className="relative w-fit h-fit flex items-center justify-center font-satB break-all">
                      {dict?.Account?.city}
                    </div>
                    <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all">
                      {!order.decrypted ? (
                        <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all">
                          {"@#$!(*A5Le3t"}
                        </div>
                      ) : (
                        <input
                          className="relative bg-black border border-white w-32 h-6 p-1 font-sat"
                          disabled
                          value={(order.fulfillmentData as Details)?.city}
                        />
                      )}
                    </div>
                  </div>
                  <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                    <div className="relative w-fit h-fit flex items-center justify-center font-satB break-all">
                      {dict?.Account?.state}
                    </div>
                    <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all">
                      {!order.decrypted ? (
                        <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all">
                          {"@#$!(*A5Le3t"}
                        </div>
                      ) : (
                        <input
                          className="relative bg-black border border-white w-32 h-6 p-1 font-sat"
                          disabled
                          value={(order.fulfillmentData as Details)?.state}
                        />
                      )}
                    </div>
                  </div>
                  <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                    <div className="relative w-fit h-fit flex items-center justify-center font-satB break-all">
                      {dict?.Account?.zip}
                    </div>
                    <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all">
                      {!order.decrypted ? (
                        <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all">
                          {"@#$!(*A5Le3t"}
                        </div>
                      ) : (
                        <input
                          className="relative bg-black border border-white w-32 h-6 p-1 font-sat"
                          disabled
                          value={(order.fulfillmentData as Details)?.zip}
                        />
                      )}
                    </div>
                  </div>
                  <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                    <div className="relative w-fit h-fit flex items-center justify-center font-satB break-all">
                      {dict?.Account?.coun}
                    </div>
                    <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all">
                      {!order.decrypted ? (
                        <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all">
                          {"@#$!(*A5Le3t"}
                        </div>
                      ) : (
                        <input
                          className="relative bg-black border border-white w-32 h-6 p-1 font-sat"
                          disabled
                          value={(order.fulfillmentData as Details)?.country}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative w-full h-fit flex flex-col gap-3  pb-2 pt-4">
                <div className="relative w-full h-fit justify-between inline-flex">
                  <div className="relative w-full h-fit justify-start flex items-center text-base font-monu">
                    {dict?.Account?.items}
                  </div>
                </div>
                <div
                  key={index}
                  className="relative w-full h-14 gap-4 flex-wrap flex break-all justify-between bg-sol/10 rounded-md items-center justify-start p-1.5 cursor-pointer"
                  onClick={() =>
                    window.open(
                      `https://fgo.themanufactory.xyz/library/parent/${order?.parentContract}/${order?.parentId}`
                    )
                  }
                >
                  <div className="relative w-10 h-10 rounded-md">
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/${
                        order?.parent?.metadata?.image?.split("ipfs://")[1]
                      }`}
                      className="rounded-md"
                      layout="fill"
                      objectFit="cover"
                      draggable={false}
                    />
                  </div>
                  <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-1">
                    <div className="relative w-fit h-fit flex items-center text-sm justify-center font-satB break-all">
                      {dict?.Account?.am}
                    </div>
                    <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all text-xs">
                      {order?.parentAmount}
                    </div>
                  </div>
                  <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-1">
                    <div className="relative w-fit h-fit flex items-center text-sm justify-center font-satB break-all">
                      {dict?.Account?.siz}
                    </div>
                    <div className="relative w-fit h-fit flex items-center justify-center uppercase font-sat break-all text-xs">
                      {!order?.decrypted
                        ? "#$%"
                        : (order?.fulfillmentData as Details)?.size || "?"}
                    </div>
                  </div>
                </div>
              </div>
              {!!order?.fulfillment && (
                <div className="relative w-full h-fit flex flex-col gap-3 pb-2 pt-4">
                  <div className="relative w-full h-fit justify-between inline-flex">
                    <div className="relative w-full h-fit justify-start flex items-center text-base font-monu">
                      {dict?.Account?.fulfillmentProgress}
                    </div>
                  </div>
                  <div className="relative w-full h-fit flex flex-wrap gap-4 bg-sol/10 rounded-md p-3 text-xs">
                    <div className="flex flex-col gap-1">
                      <div className="font-satB">
                        {dict?.Account?.currentStep}
                      </div>
                      <div className="font-sat">
                        {order?.fulfillment?.currentStep ??
                          dict?.Account?.unknown ??
                          "-"}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="font-satB">
                        {dict?.Account?.createdAt}
                      </div>
                      <div className="font-sat">
                        {order?.fulfillment?.createdAt
                          ? convertDate(order.fulfillment.createdAt)
                          : dict?.Account?.unknown ?? "-"}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="font-satB">
                        {dict?.Account?.lastUpdated}
                      </div>
                      <div className="font-sat">
                        {order?.fulfillment?.lastUpdated
                          ? convertDate(order.fulfillment.lastUpdated)
                          : dict?.Account?.unknown ?? "-"}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="font-satB">
                        {dict?.Account?.isPhysicalOrder}
                      </div>
                      <div className="font-sat">
                        {order?.fulfillment?.isPhysical
                          ? dict?.Common?.yes
                          : dict?.Common?.no}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="font-satB">
                        {dict?.ParentExpand?.estimatedDelivery}
                      </div>
                      <div className="font-sat">
                        {formatDuration(
                          Number(order?.fulfillment?.estimatedDeliveryDuration)
                        )}
                      </div>
                    </div>
                  </div>
                  {(order?.fulfillment?.isPhysical
                    ? order?.fulfillment?.physicalSteps
                    : order?.fulfillment?.digitalSteps
                  )?.length > 0 && (
                    <div className="relative w-full flex flex-col gap-2">
                      <div className="text-sm font-satB">
                        {dict?.Account?.fulfillmentSteps}
                      </div>
                      <div className="flex flex-col gap-2">
                        {(order?.fulfillment?.isPhysical
                          ? order?.fulfillment?.physicalSteps
                          : order?.fulfillment?.digitalSteps
                        )?.map((step, i) => {
                          const orderStep =
                            order?.fulfillment?.fulfillmentOrderSteps?.[i];

                          return (
                            <div
                              key={i}
                              className="relative w-full h-fit flex flex-col gap-2 bg-sol/10 rounded-md p-3 text-xs"
                            >
                              <div className="flex flex-wrap justify-between gap-2">
                                <div className="font-satB">
                                  {dict?.Account?.stepLabel} {Number(i) + 1}
                                </div>
                                <div className="font-sat">
                                  {orderStep?.isCompleted
                                    ? dict?.Account?.stepCompleted
                                    : dict?.Account?.stepPending}
                                </div>
                              </div>
                              {orderStep?.completedAt && (
                                <div className="flex flex-col gap-1">
                                  <div className="font-satB">
                                    {dict?.Account?.stepCompletedAt}
                                  </div>
                                  <div className="font-sat">
                                    {convertDate(orderStep.completedAt)}
                                  </div>
                                </div>
                              )}
                              {step?.instructions && (
                                <div className="flex flex-col gap-1">
                                  <div className="font-satB">
                                    {dict?.Account?.stepInstructions}
                                  </div>
                                  <div className="font-sat whitespace-pre-wrap break-words">
                                    {step.instructions}
                                  </div>
                                </div>
                              )}
                              {orderStep?.notes && (
                                <div className="flex flex-col gap-1">
                                  <div className="font-satB">
                                    {dict?.Account?.stepNotes}
                                  </div>
                                  <div className="font-sat whitespace-pre-wrap break-words">
                                    {orderStep.notes}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderMarket;
