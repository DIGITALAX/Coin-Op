import useSubscription from "@/components/Subscription/hooks/useSubscription";
import { FunctionComponent } from "react";
import { SubscribedProps } from "../types/account.types";
import Link from "next/link";
import { convertDate } from "../../../../lib/subgraph/helpers/convertDate";
import { AiOutlineLoading } from "react-icons/ai";

const Subscribed: FunctionComponent<SubscribedProps> = ({
  subscription,
}): JSX.Element => {
  const {
    handleCancelSubscription,
    handleReactivateSubscription,
    subscriptionCancelLoading,
    subscriptionReactivateLoading,
  } = useSubscription();
  return (
    <div className={`relative w-full border border-white bg-smo/10 p-2 h-fit`}>
      <div className="relative w-full h-28 sm:h-16 sm:gap-0 gap-3 inline-flex flex-wrap justify-between items-center text-white font-herm text-sm cursor-pointer">
        <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
          <div className="relative w-fit h-fit flex items-center justify-center">
            Subscription Id
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center font-sat">
            {subscription?.subscriberId}
          </div>
        </div>
        <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
          <div className="relative w-fit h-fit flex items-center justify-center">
            Total Subscription Price (per month)
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center font-sat">
            $25 (USD)
          </div>
        </div>
        <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
          <div className="relative w-fit h-fit flex items-center justify-center">
            Subscription Status
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center font-sat text-sol">
            {subscription?.isSubscribed ? "Subscribed" : "Unsubscribed"}
          </div>
        </div>
      </div>
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
                  href={`https://polygonscan.com/tx/${subscription?.transactionHash}`}
                  target="_blank"
                  rel={"noreferrer"}
                >
                  {subscription?.transactionHash}
                </Link>
              </div>
              <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                <div className="relative w-fit h-fit flex items-center justify-center">
                  {subscription?.isSubscribed &&
                  subscription?.resubscribedTimestamp === "0"
                    ? "Subscribed Date"
                    : subscription?.isSubscribed &&
                      subscription?.resubscribedTimestamp !== "0"
                    ? "Reactivated Date"
                    : "Unsubscribed Date"}
                </div>
                <div className="relative w-fit h-fit flex items-center justify-center font-sat">
                  {convertDate(
                    subscription?.isSubscribed &&
                      subscription?.resubscribedTimestamp === "0"
                      ? subscription?.subscribedTimestamp
                      : subscription?.isSubscribed &&
                        subscription?.resubscribedTimestamp !== "0"
                      ? subscription?.resubscribedTimestamp
                      : subscription?.unSubscribedTimestamp
                  )}
                </div>
              </div>
            </div>
            <div className="relative w-full h-fit items-start justify-center flex flex-col gap-2">
              <div className="relative w-fit h-fit flex items-center justify-center font-satB text-base break-all">
                Monthly Assets
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center font-sat">
                Check back soon as you level up.
              </div>
            </div>
            <div>
              <div
                className={`relative w-40 h-8 justify-center flex items-center flex-col text-base text-black font-monu border border-black bg-sol ${
                  (subscriptionCancelLoading ||
                    subscriptionReactivateLoading) &&
                  "cursor-pointer hover:opacity-70"
                }`}
                onClick={
                  subscriptionCancelLoading || subscriptionReactivateLoading
                    ? subscription?.isSubscribed
                      ? () => handleCancelSubscription()
                      : () => handleReactivateSubscription()
                    : () => {}
                }
              >
                <div
                  className={`relative flex w-fit h-fit items-center justify-center text-center text-xxs  ${
                    (subscriptionCancelLoading ||
                      subscriptionReactivateLoading) &&
                    "animate-spin"
                  }`}
                >
                  {subscriptionCancelLoading ||
                  subscriptionReactivateLoading ? (
                    <AiOutlineLoading size={12} color="black" />
                  ) : subscription?.isSubscribed ? (
                    "Cancel Subscription"
                  ) : (
                    "Reactivate Subscription"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribed;
