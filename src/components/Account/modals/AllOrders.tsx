import { FunctionComponent } from "react";
import { AllOrdersProps, Order as OrderType } from "../types/account.types";
import Order from "./Order";
import { setPreRollAnim } from "../../../../redux/reducers/preRollAnimSlice";
import { setLogin } from "../../../../redux/reducers/loginSlice";

const AllOrders: FunctionComponent<AllOrdersProps> = ({
  allOrders,
  connected,
  ordersLoading,
  orderOpen,
  setOrderOpen,
  decryptLoading,
  handleDecryptFulfillment,
  dispatch,
  updateFulfillmentInformation,
  updateLoading,
  updatedInformation,
  setUpdatedInformation,
  decryptMessageLoading,
  handleDecryptMessage,
  connectedPKP,
  chain,
  openChainModal,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col items-center gap-16 overflow-y-scroll justify-start overflow-x-hidden">
      <div className="relative w-full h-full flex flex-col text-white gap-4">
        <div className="font-monu text-2xl text-left w-fit h-fit flex justify-start items-center">
          All Orders.
        </div>
        {!connected && !connectedPKP ? (
          <div
            className="relative w-full h-fit justify-center text-left items-center cursor-pointer text-white font-mana text-base"
            onClick={() => dispatch(setLogin(true))}
          >
            Connect to View Your Orders.
          </div>
        ) : ordersLoading ? (
          Array.from({ length: 10 }).map((_, index: number) => {
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
            className="relative w-full h-fit justify-center text-left items-center cursor-pointer text-white font-mana text-base"
            onClick={() => dispatch(setPreRollAnim(true))}
          >
            No Orders Yet. Shop PreRolls? <br />
            <br />
            If you've bought some items but they're not showing in your account
            yet, no stress, these on-chain order updates aren&apos;t always
            instant - check back soon.
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
                updateFulfillmentInformation={updateFulfillmentInformation}
                updatedInformation={updatedInformation}
                updateLoading={updateLoading}
                setUpdatedInformation={setUpdatedInformation}
                decryptMessageLoading={decryptMessageLoading}
                handleDecryptMessage={handleDecryptMessage}
                openChainModal={openChainModal}
                chain={chain}
                connected={connected}
              />
            );
          })
        )}
      </div>
      <div className="relative w-full h-fit flex flex-col text-white gap-4 mt-auto">
        <div className="font-monu text-2xl text-left w-fit h-fit flex justify-start items-center">
          Shipping & Returns.
        </div>
        <div className="relative w-fit h-fit text-left justify-center break-all items-center font-mana text-sm">
          All orders are shipped expressed, domestic and international. Shipping
          can take up to 7-14 business days for US domestic delivery and more
          than 14-21 business days for international delivery. If there are any
          issues with your shipment, including export restrictions, you will be
          notified via your account page under order status.
          <br />
          <br />
          If you are unsatisfied with your purchase for any reason, you can
          return eligible items within 30 days of confirmed delivery for a full
          refund. Please reach out through Lens XMTP secure on-chain messaging
          to initiate the process. Once received, we will inspect the items and
          process your refund within 4-5 business days. Refunds are issued to
          your original payment method - either to your crypto wallet for crypto
          purchases or back to the card used at checkout for fiat purchases. If
          you experience any problems with your order, feel free to reach out
          via our social media channels for assistance.
        </div>
      </div>
    </div>
  );
};

export default AllOrders;
