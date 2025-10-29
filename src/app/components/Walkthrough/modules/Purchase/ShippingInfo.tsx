import { FunctionComponent, JSX } from "react";
import Image from "next/legacy/image";
import { usePathname } from "next/navigation";
import { Details, ShippingInfoProps } from "../../types/walkthrough.types";
import { COUNTRIES, INFURA_GATEWAY } from "@/app/lib/constants";

const ShippingInfo: FunctionComponent<ShippingInfoProps> = ({
  fulfillmentDetails,
  setFulfillmentDetails,
  openCountryDropDown,
  setOpenCountryDropDown,
  dict,
  checkoutLoading,
}): JSX.Element => {
  const path = usePathname();
  return (
    <div
      className={`relative w-full h-fit flex flex-col items-start justify-start gap-3 ${
        path?.includes("/en/") ? "font-mana" : "font-bit"
      }`}
    >
      <div className="relative w-fit h-fit flex text-white text-lg">
        {dict?.Common?.full}
      </div>
      <div className="relative flex flex-row items-start justify-start gap-3 w-full h-fit flex-wrap">
        <div className="relative w-full h-fit flex flex-col sm:flex-row gap-2">
          {[dict?.Common?.addr].map((item: string, index: number) => {
            return (
              <div
                key={index}
                className={`relative w-full h-fit flex items-start justify-center flex-col gap-2 ${
                  checkoutLoading && "opacity-20"
                }`}
              >
                <div className="relative w-fit h-fit flex text-white text-xs">
                  {item}
                </div>

                <input
                  className={`relative border border-white rounded-md flex bg-offBlack text-white text-xs p-2 h-10 w-full`}
                  placeholder={
                    (fulfillmentDetails?.[
                      item?.toLowerCase() as keyof Details
                    ] as string) || ""
                  }
                  disabled={checkoutLoading}
                  onChange={(e) => {
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
          {[dict?.Common?.zip, dict?.Common?.city].map(
            (item: string, index: number) => {
              return (
                <div
                  key={index}
                  className={`relative w-full h-fit flex items-start justify-center flex-col gap-2 ${
                    checkoutLoading && "opacity-20"
                  }`}
                >
                  <div className="relative w-fit h-fit flex text-white text-xs">
                    {item}
                  </div>
                  <input
                    className={`relative border border-white rounded-md flex bg-offBlack text-white text-xs p-2 h-10 w-full`}
                    placeholder={
                      (fulfillmentDetails?.[
                        item?.toLowerCase() as keyof Details
                      ] as string) || ""
                    }
                    disabled={checkoutLoading}
                    onChange={(e) => {
                      setFulfillmentDetails({
                        ...fulfillmentDetails,
                        [item?.toLowerCase()]: e.target.value,
                      });
                    }}
                  />
                </div>
              );
            }
          )}
        </div>
        <div className="relative w-full h-fit flex flex-col sm:flex-row  gap-2">
          {[
            {
              title: dict?.Common?.state,
              drop: false,
            },
            {
              title: dict?.Common?.coun,
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
                    checkoutLoading && "opacity-20"
                  }`}
                >
                  <div className="relative w-fit h-fit flex text-white text-xs">
                    {item?.title}
                  </div>
                  {item?.drop ? (
                    <div className="relative w-full h-fit flex flex-col items-start justify-start gap-1">
                      <div
                        className={`relative h-10 flex flex-row justify-between p-2 w-full items-center border border-white rounded-md ${
                          !checkoutLoading
                            ? "cursor-pointer"
                            : "opacity-70"
                        }`}
                        onClick={() =>
                          !checkoutLoading &&
                          setOpenCountryDropDown(!openCountryDropDown)
                        }
                      >
                        <div className="relative w-fit h-fit flex items-center justify-center text-white text-xs">
                          {fulfillmentDetails?.country}
                        </div>
                        <div className="relative w-fit h-fit flex">
                          <div className="relative w-4 h-3 flex items-center justify-center">
                            <Image
                              layout="fill"
                              draggable={false}
                              src={`${INFURA_GATEWAY}/ipfs/QmRKmMYJj7KAwf4BDGwrd51tKWoS8djnLGWT5XNdrJMztk`}
                            />
                          </div>
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
                                    className="relative w-full py-1 h-10 flex items-center justify-center text-white border-y border-white text-xs cursor-pointer hover:opacity-80"
                                    onClick={() => {
                                      if (checkoutLoading) return;
                                      setOpenCountryDropDown(false);
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
                      className={`relative border border-white rounded-md flex bg-offBlack text-white text-xs p-2 h-10 w-full`}
                      placeholder={
                        fulfillmentDetails?.[
                          item?.title?.toLowerCase() as keyof Details
                        ] || ""
                      }
                      disabled={checkoutLoading}
                      onChange={(e) => {
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
