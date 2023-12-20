import { FunctionComponent } from "react";
import { ShippingInfoProps } from "../types/synth.types";
import Image from "next/legacy/image";
import { COUNTRIES, INFURA_GATEWAY } from "../../../../../lib/constants";
import { Details } from "@/components/Common/types/common.types";

const ShippingInfo: FunctionComponent<ShippingInfoProps> = ({
  fulfillmentDetails,
  setFulfillmentDetails,
  encrypted,
  openCountryDropDown,
  setOpenCountryDropDown,
  setEncrypted
}): JSX.Element => {
  return (
    <div className="relative w-3/4 h-fit flex flex-col items-start justify-start gap-3">
      <div className="relative w-fit h-fit flex text-white font-mana text-lg">
        Fulfillment Details
      </div>
      <div className="relative flex flex-row items-start justify-start gap-3 w-full h-fit flex-wrap">
        <div className="relative w-full h-fit flex flex-col sm:flex-row gap-2">
          {["Name", "Address"].map((item: string, index: number) => {
            return (
              <div
                key={index}
                className={`relative w-full h-fit flex items-start justify-center flex-col gap-2 ${
                  encrypted && "opacity-20"
                }`}
              >
                <div className="relative w-fit h-fit flex text-white font-mana text-xs">
                  {item}
                </div>

                <input
                  className={`relative border border-white rounded-md flex bg-offBlack font-mana text-white text-xs p-2 h-10 w-full`}
                  placeholder={
                    (fulfillmentDetails?.[
                      item?.toLowerCase() as keyof Details
                    ] as string) || ""
                  }
                  onChange={(e) => {
                    setEncrypted(undefined);
                    setFulfillmentDetails((prev) => ({
                      ...prev,
                      [item?.toLowerCase()]: e.target.value,
                    }));
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="relative w-full h-fit flex flex-col sm:flex-row  gap-2">
          {["Zip", "City"].map((item: string, index: number) => {
            return (
              <div
                key={index}
                className={`relative w-full h-fit flex items-start justify-center flex-col gap-2 ${
                  encrypted && "opacity-20"
                }`}
              >
                <div className="relative w-fit h-fit flex text-white font-mana text-xs">
                  {item}
                </div>
                <input
                  className={`relative border border-white rounded-md flex bg-offBlack font-mana text-white text-xs p-2 h-10 w-full`}
                  placeholder={
                    (fulfillmentDetails?.[
                      item?.toLowerCase() as keyof Details
                    ] as string) || ""
                  }
                  onChange={(e) => {
                    setEncrypted(undefined);
                    setFulfillmentDetails({
                      ...fulfillmentDetails,
                      [item?.toLowerCase()]: e.target.value,
                    });
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="relative w-full h-fit flex flex-col sm:flex-row  gap-2">
          {[
            {
              title: "State",
              drop: false,
            },
            {
              title: "Country",
              drop: true,
            },
          ].map(
            (
              item: {
                title: string;
                drop: boolean;
              },
              index: number
            ) => {
              return (
                <div
                  key={index}
                  className={`relative w-full h-fit flex items-start justify-center flex-col gap-2 ${
                    encrypted && "opacity-20"
                  }`}
                >
                  <div className="relative w-fit h-fit flex text-white font-mana text-xs">
                    {item?.title}
                  </div>
                  {item?.drop ? (
                    <div className="relative w-full h-fit flex flex-col items-start justify-start gap-1">
                      <div
                        className={`relative h-10 flex flex-row justify-between p-2 w-full items-center justify-center border border-white rounded-md ${
                          !encrypted ? "cursor-pointer" : "opacity-70"
                        }`}
                        onClick={() =>
                          setOpenCountryDropDown(!openCountryDropDown)
                        }
                      >
                        <div className="relative w-fit h-fit flex items-center justify-center font-mana text-white text-xs">
                          {fulfillmentDetails?.country}
                        </div>
                        <div className="relative w-4 h-3 flex items-center justify-center">
                          <Image
                            layout="fill"
                            draggable={false}
                            src={`${INFURA_GATEWAY}/ipfs/QmRKmMYJj7KAwf4BDGwrd51tKWoS8djnLGWT5XNdrJMztk`}
                          />
                        </div>
                      </div>
                      {openCountryDropDown && (
                        <div className="absolute top-10 bg-offBlack z-10 w-full h-60 flex border border-white rounded-md overflow-y-scroll">
                          <div className="relative w-full h-fit flex flex-col items-center justify-start">
                            {COUNTRIES?.map(
                              (country: string, index: number) => {
                                return (
                                  <div
                                    key={index}
                                    className="relative w-full py-1 h-10 flex items-center justify-center text-white border-y border-white font-mana text-xs cursor-pointer hover:opacity-80"
                                    onClick={() => {
                                      setOpenCountryDropDown(false);
                                      setEncrypted(undefined);
                                      setFulfillmentDetails({
                                        ...fulfillmentDetails,
                                        country,
                                      });
                                    }}
                                  >
                                    {country}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      className={`relative border border-white rounded-md flex bg-offBlack font-mana text-white text-xs p-2 h-10 w-full`}
                      placeholder={
                        (fulfillmentDetails?.[
                          item?.title?.toLowerCase() as keyof Details
                        ] as string) || ""
                      }
                      onChange={(e) => {
                        setEncrypted(undefined);
                        setFulfillmentDetails({
                          ...fulfillmentDetails,
                          [item?.title?.toLowerCase()]: e.target.value,
                        });
                      }}
                    />
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
