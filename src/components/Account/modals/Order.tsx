import { FunctionComponent } from "react";
import { InformationType, OrderProps } from "../types/account.types";
import {
  ACCEPTED_TOKENS,
  ACCEPTED_TOKENS_MUMBAI,
  INFURA_GATEWAY,
} from "../../../../lib/constants";
import Link from "next/link";
import { convertDate } from "../../../../lib/subgraph/helpers/convertDate";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/legacy/image";

const Order: FunctionComponent<OrderProps> = ({
  order,
  orderOpen,
  setOrderOpen,
  index,
  handleDecryptFulfillment,
  decryptLoading,
  updateFulfillmentInformation,
  updateLoading,
  updatedInformation,
  setUpdatedInformation,
  decryptMessageLoading,
  handleDecryptMessage,
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
            {order?.sinPKP
              ? `${
                  ACCEPTED_TOKENS.find(
                    (subArray) =>
                      subArray[2].toLowerCase() ===
                      order.chosenAddress.toLowerCase()
                  )?.[1] || ""
                } `
              : "$"}{" "}
            {Number(order.totalPrice) /
              ((ACCEPTED_TOKENS.find(
                ([_, token]) =>
                  token.toLowerCase() === order.chosenAddress.toLowerCase()
              )?.[2] as `0x${string}`) ===
              "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
                ? 10 ** 6
                : 10 ** 18)}
          </div>
        </div>
        <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
          <div className="relative w-fit h-fit flex items-center justify-center">
            Order Status
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center font-sat text-sol">
            {order?.subOrderStatuses?.every((item) => item === "Fulfilled")
              ? "Fulfilled"
              : order?.subOrderStatuses?.every(
                  (item) => item === "Fulfilled" || item === "Shipped"
                )
              ? "Shipped"
              : "Ordered"}
          </div>
        </div>
        <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
          <div className="relative w-fit h-fit flex items-center justify-center">
            Is Fulfilled?
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center font-sat">
            {order?.subOrderIsFulfilled?.every(Boolean) ? "Yes" : "No"}
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
                {order?.decryptedMessage ? (
                  <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all text-sm text-white">
                    {order?.decryptedMessage?.length > 0 ? (
                      <div className="relative w-full h-fit flex flex-col gap-1.5 items-start">
                        {order.decryptedMessage?.map(
                          (
                            item: {
                              message: string;
                              date: string;
                            },
                            index: number
                          ) => {
                            return (
                              <div
                                key={index}
                                className="relative w-full h-fit flex  flex-row items-center justify-between break-all gap-3"
                              >
                                <div className="relative w-fit h-fit flex justify-start items-center break-all">
                                  {item.message}
                                </div>
                                <div className="relative w-fit h-fit flex items-center justify-start items-center break-all">
                                  {item.date}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    ) : (
                      <div className="relative w-fit h-fit flex items-center justify-center break-all">
                        No messages yet.
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={`relative w-40 h-8 justify-center flex items-center flex-col text-base text-black font-monu border border-black bg-sol ${
                      !decryptMessageLoading[index] &&
                      "cursor-pointer hover:opacity-70"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      !decryptMessageLoading[index] &&
                        handleDecryptMessage(order);
                    }}
                  >
                    <div
                      className={`relative flex w-fit h-fit items-center justify-center text-center text-xxs  ${
                        decryptMessageLoading[index] && "animate-spin"
                      }`}
                    >
                      {decryptMessageLoading[index] ? (
                        <AiOutlineLoading size={12} color="black" />
                      ) : (
                        "Decrypt Messages"
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative w-full h-fit flex flex-col gap-3 p-2 bg-sol/20">
                <div className="relative w-full h-fit justify-between inline-flex">
                  <div className="relative w-full h-fit justify-start flex items-center text-base font-monu">
                    Fulfillment Information
                  </div>
                  {!order.fulfillmentInformation.decryptedFulfillment?.name && (
                    <div
                      className={`relative w-40 h-8 justify-center flex items-center flex-col text-base text-black font-monu border border-black bg-sol ${
                        !decryptLoading[index] &&
                        "cursor-pointer hover:opacity-70"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        !decryptLoading[index] &&
                          handleDecryptFulfillment(order);
                      }}
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
                    {!order.fulfillmentInformation.decryptedFulfillment
                      ?.name ? (
                      <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all">
                        {"@#$!(*A5Le3t"}
                      </div>
                    ) : (
                      <input
                        className="relative bg-black border border-white w-32 h-6 p-1 font-sat"
                        onChange={(e) =>
                          setUpdatedInformation(((prev: any) =>
                            prev.map((val: InformationType, idx: number) =>
                              idx === index
                                ? { ...val, name: e.target.value }
                                : val
                            )) as any)
                        }
                        placeholder={
                          order.fulfillmentInformation.decryptedFulfillment
                            ?.name
                        }
                        value={
                          updatedInformation[index]?.name ||
                          order.fulfillmentInformation.decryptedFulfillment
                            ?.name
                        }
                      />
                    )}
                  </div>
                  <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                    <div className="relative w-fit h-fit flex items-center justify-center font-satB break-all">
                      Contact
                    </div>
                    {!order.fulfillmentInformation.decryptedFulfillment
                      ?.contact ? (
                      <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all">
                        {"@#$!(*A5Le3t"}
                      </div>
                    ) : (
                      <input
                        className="relative bg-black border border-white w-32 h-6 p-1 font-sat"
                        onChange={(e) =>
                          setUpdatedInformation(((prev: any) =>
                            prev.map((val: InformationType, idx: number) =>
                              idx === index
                                ? { ...val, contact: e.target.value }
                                : val
                            )) as any)
                        }
                        placeholder={
                          order.fulfillmentInformation.decryptedFulfillment
                            ?.contact
                        }
                        value={
                          updatedInformation[index]?.contact ||
                          order.fulfillmentInformation.decryptedFulfillment
                            ?.contact
                        }
                      />
                    )}
                  </div>
                  <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                    <div className="relative w-fit h-fit flex items-center justify-center font-satB break-all">
                      Address
                    </div>
                    <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all">
                      {!order.fulfillmentInformation.decryptedFulfillment
                        ?.address ? (
                        <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all">
                          {"@#$!(*A5Le3t"}
                        </div>
                      ) : (
                        <input
                          className="relative bg-black border border-white w-32 h-6 p-1 font-sat"
                          onChange={(e) =>
                            setUpdatedInformation(((prev: any) =>
                              prev.map((val: InformationType, idx: number) =>
                                idx === index
                                  ? { ...val, address: e.target.value }
                                  : val
                              )) as any)
                          }
                          placeholder={
                            order.fulfillmentInformation.decryptedFulfillment
                              ?.address
                          }
                          value={
                            updatedInformation[index]?.address ||
                            order.fulfillmentInformation.decryptedFulfillment
                              ?.address
                          }
                        />
                      )}
                    </div>
                  </div>
                  <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                    <div className="relative w-fit h-fit flex items-center justify-center font-satB break-all">
                      City
                    </div>
                    <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all">
                      {!order.fulfillmentInformation.decryptedFulfillment
                        ?.city ? (
                        <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all">
                          {"@#$!(*A5Le3t"}
                        </div>
                      ) : (
                        <input
                          className="relative bg-black border border-white w-32 h-6 p-1 font-sat"
                          onChange={(e) =>
                            setUpdatedInformation(((prev: any) =>
                              prev.map((val: InformationType, idx: number) =>
                                idx === index
                                  ? { ...val, city: e.target.value }
                                  : val
                              )) as any)
                          }
                          placeholder={
                            order.fulfillmentInformation.decryptedFulfillment
                              ?.city
                          }
                          value={
                            updatedInformation[index]?.city ||
                            order.fulfillmentInformation.decryptedFulfillment
                              ?.city
                          }
                        />
                      )}
                    </div>
                  </div>
                  <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                    <div className="relative w-fit h-fit flex items-center justify-center font-satB break-all">
                      State
                    </div>
                    <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all">
                      {!order.fulfillmentInformation.decryptedFulfillment
                        ?.state ? (
                        <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all">
                          {"@#$!(*A5Le3t"}
                        </div>
                      ) : (
                        <input
                          className="relative bg-black border border-white w-32 h-6 p-1 font-sat"
                          onChange={(e) =>
                            setUpdatedInformation(((prev: any) =>
                              prev.map((val: InformationType, idx: number) =>
                                idx === index
                                  ? { ...val, state: e.target.value }
                                  : val
                              )) as any)
                          }
                          placeholder={
                            order.fulfillmentInformation.decryptedFulfillment
                              ?.state
                          }
                          value={
                            updatedInformation[index]?.state ||
                            order.fulfillmentInformation.decryptedFulfillment
                              ?.state
                          }
                        />
                      )}
                    </div>
                  </div>
                  <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                    <div className="relative w-fit h-fit flex items-center justify-center font-satB break-all">
                      Zip
                    </div>
                    <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all">
                      {!order.fulfillmentInformation.decryptedFulfillment
                        ?.zip ? (
                        <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all">
                          {"@#$!(*A5Le3t"}
                        </div>
                      ) : (
                        <input
                          className="relative bg-black border border-white w-32 h-6 p-1 font-sat"
                          onChange={(e) =>
                            setUpdatedInformation(((prev: any) =>
                              prev.map((val: InformationType, idx: number) =>
                                idx === index
                                  ? { ...val, zip: e.target.value }
                                  : val
                              )) as any)
                          }
                          placeholder={
                            order.fulfillmentInformation.decryptedFulfillment
                              ?.zip
                          }
                          value={
                            updatedInformation[index]?.zip ||
                            order.fulfillmentInformation.decryptedFulfillment
                              ?.zip
                          }
                        />
                      )}
                    </div>
                  </div>
                  <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                    <div className="relative w-fit h-fit flex items-center justify-center font-satB break-all">
                      Country
                    </div>
                    <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all">
                      {!order.fulfillmentInformation.decryptedFulfillment
                        ?.country ? (
                        <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all">
                          {"@#$!(*A5Le3t"}
                        </div>
                      ) : (
                        <input
                          className="relative bg-black border border-white w-32 h-6 p-1 font-sat"
                          onChange={(e) =>
                            setUpdatedInformation(((prev: any) =>
                              prev.map((val: InformationType, idx: number) =>
                                idx === index
                                  ? { ...val, country: e.target.value }
                                  : val
                              )) as any)
                          }
                          placeholder={
                            order.fulfillmentInformation.decryptedFulfillment
                              ?.country
                          }
                          value={
                            updatedInformation[index]?.country ||
                            order.fulfillmentInformation.decryptedFulfillment
                              ?.country
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
                {order.fulfillmentInformation.decryptedFulfillment?.country && (
                  <div
                    className={`relative w-24 h-8 justify-center flex items-center flex-col text-base text-black font-monu border border-black bg-sol ${
                      !updateLoading[index] && "cursor-pointer hover:opacity-70"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      !updateLoading[index] &&
                        updateFulfillmentInformation(index);
                    }}
                  >
                    <div
                      className={`relative flex w-fit h-fit items-center justify-center text-center text-xxs  ${
                        updateLoading[index] && "animate-spin"
                      }`}
                    >
                      {updateLoading[index] ? (
                        <AiOutlineLoading size={12} color="black" />
                      ) : (
                        "Update Info"
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative w-full h-fit flex flex-col gap-3  pb-2 pt-4">
                <div className="relative w-full h-fit justify-between inline-flex">
                  <div className="relative w-full h-fit justify-start flex items-center text-base font-monu">
                    Order Items
                  </div>
                </div>
                <div className="relative w-full h-fit flex flex-col gap-2">
                  {order.collectionDetails?.map((collection, index: number) => {
                    return (
                      <div
                        key={index}
                        className="relative w-full h-14 flex inline-flex break-all justify-between bg-sol/10 rounded-md items-center justify-start p-1.5"
                      >
                        <div className="relative w-10 h-10 rounded-md">
                          <Image
                            src={`${INFURA_GATEWAY}/ipfs/${
                              collection.uri.image?.split("ipfs://")[1]
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
                            {order?.fulfillmentInformation?.decryptedFulfillment
                              ?.collectionAmounts?.[index] || "#$%"}
                          </div>
                        </div>
                        <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-1">
                          <div className="relative w-fit h-fit flex items-center text-sm justify-center font-satB break-all">
                            Size
                          </div>
                          <div className="relative w-fit h-fit flex items-center justify-center font-sat break-all text-xs">
                            {order?.fulfillmentInformation?.decryptedFulfillment
                              ?.sizes?.[index] || "#$%"}
                          </div>
                        </div>
                        <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-1">
                          <div className="relative w-fit h-fit flex items-center text-sm justify-center font-satB break-all">
                            Color
                          </div>
                          <div
                            className="relative w-4 h-4 rounded-full border border-white flex items-center justify-center font-sat break-all text-xxs"
                            style={{
                              backgroundColor:
                                order?.fulfillmentInformation
                                  ?.decryptedFulfillment?.colors?.[index],
                            }}
                          >
                            {!order?.fulfillmentInformation
                              ?.decryptedFulfillment?.colors?.[index] && "?"}
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
