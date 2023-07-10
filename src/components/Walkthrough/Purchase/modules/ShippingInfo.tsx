import { FunctionComponent } from "react";
import { ShippingInfoProps } from "../types/synth.types";

const ShippingInfo: FunctionComponent<ShippingInfoProps> = ({
  fulfillmentDetails,
  setFulfillmentDetails,
}): JSX.Element => {
  return (
    <div className="relative w-3/4 h-fit flex flex-col gap-3 items-center justify-center">
      <div className="relative flex w-full h-full overflow-y-scroll">
        <div className="relative flex flex-col w-full h-fit justify-start items-start gap-3">
          <div className="relative w-full flex flex-row gap-3 items-center justify-start">
            <input
              placeholder="name"
              className="bg-black border h-8 border-white p-1.5 rounded-md font-mana text-white text-xs"
              value={fulfillmentDetails.name}
              onChange={(e) =>
                setFulfillmentDetails({
                  ...fulfillmentDetails,
                  name: e.target.value,
                })
              }
            />
            <input
              placeholder="email, lens, tumblr"
              className="bg-black border border-white p-1.5 rounded-md font-mana text-white h-8 text-xs"
              value={fulfillmentDetails.contact}
              onChange={(e) =>
                setFulfillmentDetails({
                  ...fulfillmentDetails,
                  contact: e.target.value,
                })
              }
            />
          </div>
          <input
            placeholder="address"
            className="bg-black border border-white p-1.5 rounded-md font-mana text-white w-full h-8 text-xs"
            value={fulfillmentDetails.address}
            onChange={(e) =>
              setFulfillmentDetails({
                ...fulfillmentDetails,
                address: e.target.value,
              })
            }
          />
          <div className="relative w-full h-fit flex flex-row gap-3 items-center justify-start">
            <input
              placeholder="zip"
              className="bg-black border border-white p-1.5 rounded-md font-mana w-16 text-white text-xs  h-full"
              value={fulfillmentDetails.zip}
              onChange={(e) =>
                setFulfillmentDetails({
                  ...fulfillmentDetails,
                  zip: e.target.value,
                })
              }
            />
            <input
              placeholder="city"
              className="bg-black border border-white p-1.5 rounded-md font-mana w-20 text-white text-xs  h-full"
              value={fulfillmentDetails.city}
              onChange={(e) =>
                setFulfillmentDetails({
                  ...fulfillmentDetails,
                  city: e.target.value,
                })
              }
            />
            <input
              placeholder="state"
              className="bg-black border border-white p-1.5 rounded-md font-mana w-20 text-white text-xs  h-full"
              value={fulfillmentDetails.state}
              onChange={(e) =>
                setFulfillmentDetails({
                  ...fulfillmentDetails,
                  state: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
