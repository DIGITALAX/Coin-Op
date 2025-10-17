import { FunctionComponent, JSX } from "react";
import Link from "next/link";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/legacy/image";
import { Details } from "../../Walkthrough/types/walkthrough.types";
import { OrderProps } from "../types/account.types";
import { ASSETS, INFURA_GATEWAY } from "@/app/lib/constants";
import { convertDate } from "@/app/lib/helpers/convertDate";
import { useModal } from "connectkit";

const Order: FunctionComponent<OrderProps> = ({
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
  return (
    <div className={`relative w-full border border-white bg-smo/10 p-2 h-fit`}>
      <div
        className="relative w-full h-28 sm:h-16 sm:gap-0 gap-3 inline-flex flex-wrap justify-between items-center text-white font-herm text-sm cursor-pointer"
        onClick={() =>
          setOrderOpen(orderOpen.map((open, i) => (index === i ? !open : open)))
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
            {`${
              ASSETS.find(
                (subArray) =>
                  subArray?.contract?.address.toLowerCase() ===
                  order?.currency?.toLowerCase()
              )?.symbol || ""
            } `}{" "}
            {Number(order.totalPrice)}
          </div>
        </div>
        <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
          <div className="relative w-fit h-fit flex items-center justify-center">
            {dict?.Account?.status}
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center font-sat text-sol">
            {dict?.Account?.[order?.status]}
          </div>
        </div>
        <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
          <div className="relative w-fit h-fit flex items-center justify-center">
            {dict?.Account?.ful}
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center font-sat">
            {order?.isFulfilled ? "Yes" : "No"}
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
                    className="relative w-fit h-fit flex items-center justify-center font-sat cursor-pointer"
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
                        connected && chainId !== 137
                          ? () => openSwitchNetworks()
                          : (e) => {
                              e.stopPropagation();
                              !decryptLoading[index] &&
                                handleDecryptFulfillment(order);
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
                <div className="relative w-full h-fit items-center text-xs break-all">
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
                          value={(order.details as Details)?.address}
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
                          value={(order.details as Details)?.city}
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
                          value={(order.details as Details)?.state}
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
                          value={(order.details as Details)?.zip}
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
                          value={(order.details as Details)?.country}
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
                  className="relative w-full h-14 flex inline-flex break-all justify-between bg-sol/10 rounded-md items-center justify-start p-1.5"
                >
                  <div className="relative w-10 h-10 rounded-md">
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/${
                        order?.collection?.metadata?.images?.[0]?.split(
                          "ipfs://"
                        )[1]
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
                      {order?.amount}
                    </div>
                  </div>
                  <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-1">
                    <div className="relative w-fit h-fit flex items-center text-sm justify-center font-satB break-all">
                      {dict?.Account?.siz}
                    </div>
                    <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all text-xs">
                      {!order?.decrypted
                        ? "#$%"
                        : (order?.details as Details)?.size || "?"}
                    </div>
                  </div>
                  <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-1">
                    <div className="relative w-fit h-fit flex items-center text-sm justify-center font-satB break-all">
                      {dict?.Account?.col}
                    </div>
                    <div
                      className="relative w-4 h-4 rounded-full border border-white flex items-center justify-center font-sat break-all text-xxs"
                      style={{
                        backgroundColor: (order?.details as Details)?.color,
                      }}
                    >
                      {!order?.decrypted && "?"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
