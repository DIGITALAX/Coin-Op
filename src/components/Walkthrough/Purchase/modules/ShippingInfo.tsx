import { FunctionComponent } from "react";

const ShippingInfo: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-3/4 h-fit flex flex-col gap-3 items-center justify-center">
      <div className="relative flex w-full h-full overflow-y-scroll">
        <div className="relative flex flex-col w-full h-fit justify-start items-start gap-3">
          <div className="relative w-full flex flex-row gap-3 items-center justify-start">
            <input
              placeholder="name"
              className="bg-black border h-8 border-white p-1.5 rounded-md font-mana text-white text-xs"
            />
            <input
              placeholder="email, lens, tumblr"
              className="bg-black border border-white p-1.5 rounded-md font-mana text-white h-8 text-xs"
            />
          </div>
          <input
            placeholder="address"
            className="bg-black border border-white p-1.5 rounded-md font-mana text-white w-full h-8 text-xs"
          />
          <div className="relative w-full h-fit flex flex-row gap-3 items-center justify-start">
            <input
              placeholder="zip"
              className="bg-black border border-white p-1.5 rounded-md font-mana w-16 text-white text-xs  h-full"
            />
            <input
              placeholder="city"
              className="bg-black border border-white p-1.5 rounded-md font-mana w-20 text-white text-xs  h-full"
            />
            <input
              placeholder="state"
              className="bg-black border border-white p-1.5 rounded-md font-mana w-20 text-white text-xs  h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
