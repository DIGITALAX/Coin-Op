import { FunctionComponent } from "react";
import { InformationType, OrderProps, Sub } from "../types/account.types";
import { ACCEPTED_TOKENS, INFURA_GATEWAY } from "../../../../lib/constants";
import Link from "next/link";
import { convertDate } from "../../../../lib/subgraph/helpers/convertDate";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/legacy/image";
import { Details } from "@/components/Common/types/common.types";

const Order: FunctionComponent<OrderProps> = ({
  order,
  orderOpen,
  setOrderOpen,
  index,
  handleDecryptFulfillment,
  decryptLoading,
  chain,
  openChainModal,
  connected,
}): JSX.Element => {
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
            Order Id
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center font-sat">
            {order.orderId}
          </div>
        </div>
        <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
          <div className="relative w-fit h-fit flex items-center justify-center">
            Total Order Price
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center font-sat">
            {`${
              ACCEPTED_TOKENS.find(
                (subArray) =>
                  subArray[2].toLowerCase() === order?.currency?.toLowerCase()
              )?.[1] || ""
            } `}{" "}
            {Number(order.totalPrice)}
          </div>
        </div>
        <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
          <div className="relative w-fit h-fit flex items-center justify-center">
            Order Status
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center font-sat text-sol">
            {order?.subOrders[0]?.isFulfilled ? "Fulfilled" : "Ordered"}
          </div>
        </div>
        <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
          <div className="relative w-fit h-fit flex items-center justify-center">
            Is Fulfilled?
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center font-sat">
            {order?.subOrders[0]?.isFulfilled ? "Yes" : "No"}
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
                    href={`https://polygonscan.com/tx/${order.transactionHash}`}
                    target="_blank"
                    rel={"noreferrer"}
                  >
                    {order.transactionHash}
                  </Link>
                </div>
                <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                  <div className="relative w-fit h-fit flex items-center justify-center">
                    Block Number
                  </div>
                  <div className="relative w-fit h-fit flex items-center justify-center font-sat">
                    {order.blockNumber}
                  </div>
                </div>
                <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                  <div className="relative w-fit h-fit flex items-center justify-center">
                    Order Date
                  </div>
                  <div className="relative w-fit h-fit flex items-center justify-center font-sat">
                    {convertDate(order.blockTimestamp)}
                  </div>
                </div>
              </div>
              <div className="relative w-full h-fit items-start justify-center flex flex-col gap-2">
                <div className="relative w-fit h-fit flex items-center justify-center font-satB text-base break-all">
                  Messages
                </div>
              </div>
              <div className="relative w-full h-fit flex flex-col gap-3 p-2 bg-sol/20">
                <div className="relative w-full h-fit justify-between inline-flex">
                  <div className="relative w-full h-fit justify-start flex items-center text-base font-monu">
                    Fulfillment Information
                  </div>
                  {!order.decrypted && (
                    <div
                      className={`relative w-40 h-8 justify-center flex items-center flex-col text-base text-black font-monu border border-black bg-sol ${
                        !decryptLoading[index] &&
                        "cursor-pointer hover:opacity-70"
                      }`}
                      onClick={
                        connected && chain !== 137
                          ? openChainModal
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
                          "Decrypt Fulfillment"
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative w-full h-fit inline-flex justify-between flex-wrap items-center text-xs break-all gap-2">
                  <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                    <div className="relative w-fit h-fit flex items-center justify-center font-satB break-all">
                      Name
                    </div>
                    {!order.decrypted ? (
                      <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all">
                        {"@#$!(*A5Le3t"}
                      </div>
                    ) : (
                      <input
                        className="relative bg-black border border-white w-32 h-6 p-1 font-sat"
                        disabled
                        value={(order.details as Details)?.name}
                      />
                    )}
                  </div>
                  <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                    <div className="relative w-fit h-fit flex items-center justify-center font-satB break-all">
                      Contact
                    </div>
                    {!order.decrypted ? (
                      <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all">
                        {"@#$!(*A5Le3t"}
                      </div>
                    ) : (
                      <input
                        className="relative bg-black border border-white w-32 h-6 p-1 font-sat"
                        disabled
                        value={(order.details as Details)?.contact}
                      />
                    )}
                  </div>
                  <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                    <div className="relative w-fit h-fit flex items-center justify-center font-satB break-all">
                      Address
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
                      City
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
                      State
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
                      Zip
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
                      Country
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
                    Order Items
                  </div>
                </div>
                <div className="relative w-full h-fit flex flex-col gap-2">
                  {order.subOrders?.map((collection: Sub, index: number) => {
                    return (
                      <div
                        key={index}
                        className="relative w-full h-14 flex inline-flex break-all justify-between bg-sol/10 rounded-md items-center justify-start p-1.5"
                      >
                        <div className="relative w-10 h-10 rounded-md">
                          <Image
                            src={`${INFURA_GATEWAY}/ipfs/${
                              order?.images?.[0]?.split("ipfs://")[1]
                            }`}
                            className="rounded-md"
                            layout="fill"
                            objectFit="cover"
                            draggable={false}
                          />
                        </div>
                        <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-1">
                          <div className="relative w-fit h-fit flex items-center text-sm justify-center font-satB break-all">
                            Amount
                          </div>
                          <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all text-xs">
                            {!order?.decrypted
                              ? "#$%"
                              : collection?.amount}
                          </div>
                        </div>
                        <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-1">
                          <div className="relative w-fit h-fit flex items-center text-sm justify-center font-satB break-all">
                            Size
                          </div>
                          <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all text-xs">
                            {!order?.decrypted
                              ? "#$%"
                              : collection?.size || "?"}
                          </div>
                        </div>
                        <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-1">
                          <div className="relative w-fit h-fit flex items-center text-sm justify-center font-satB break-all">
                            Color
                          </div>
                          <div
                            className="relative w-4 h-4 rounded-full border border-white flex items-center justify-center font-sat break-all text-xxs"
                            style={{
                              backgroundColor: collection?.color,
                            }}
                          >
                            {!order?.decrypted && "?"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
