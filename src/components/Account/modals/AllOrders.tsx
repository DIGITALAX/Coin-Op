import { FunctionComponent } from "react";
import { AllOrdersProps, Order as OrderType } from "../types/account.types";
import Order from "./Order";
import { setPrerollAnim } from "../../../../redux/reducers/prerollAnimSlice";

const AllOrders: FunctionComponent<AllOrdersProps> = ({
  allOrders,
  connected,
  ordersLoading,
  orderOpen,
  setOrderOpen,
  decryptLoading,
  handleDecryptFulfillment,
  dispatch,
  chain,
  openChainModal,
  openConnectModal,
  t,
  router,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col items-center gap-16 overflow-y-scroll justify-start overflow-x-hidden">
      <div className="relative w-full h-full flex flex-col text-white gap-4">
        <div className="font-monu text-2xl text-left w-fit h-fit flex justify-start items-center">
          {t("all")}
        </div>
        {!connected ? (
          <div
            className="relative w-full h-fit justify-center text-left items-center cursor-pointer text-white font-mana text-base"
            onClick={() =>
              !connected
                ? openConnectModal
                : connected && chain !== 137 && openChainModal
            }
          >
            {t("connect")}
          </div>
        ) : ordersLoading ? (
          Array.from({ length: 3 }).map((_, index: number) => {
            return (
              <div
                key={index}
                className="relative h-20 border border-white w-full"
                id="staticLoad"
              ></div>
            );
          })
        ) : !ordersLoading && allOrders?.length < 1 ? (
          <div
            className={`relative w-full h-fit justify-center text-left items-center cursor-pointer text-white text-base whitespace-pre-line ${
              router.locale == "en" ? "font-mana" : "font-bit"
            }`}
            onClick={() => dispatch(setPrerollAnim(true))}
          >
            {t("shop")}
          </div>
        ) : (
          allOrders?.map((order: OrderType, index: number) => {
            return (
              <Order
                key={index}
                order={order}
                orderOpen={orderOpen}
                setOrderOpen={setOrderOpen}
                index={index}
                handleDecryptFulfillment={handleDecryptFulfillment}
                decryptLoading={decryptLoading}
                openChainModal={openChainModal}
                chain={chain}
                connected={connected}
                t={t}
              />
            );
          })
        )}
      </div>
      <div className="relative w-full h-fit flex flex-col text-white gap-4 mt-auto">
        <div className="font-monu text-2xl text-left w-fit h-fit flex justify-start items-center">
          {t("returns")}
        </div>
        <div
          className={`relative w-fit h-fit text-left justify-center break-all items-center text-sm whitespace-pre-line ${
            router.locale == "en" ? "font-mana" : "font-bit"
          }`}
        >
          {t("faq")}
        </div>
      </div>
    </div>
  );
};

export default AllOrders;
