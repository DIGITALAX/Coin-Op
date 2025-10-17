import { FunctionComponent, JSX } from "react";
import { AppMarketProps } from "../types/common.types";
import Image from "next/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import useAppMarket from "../hooks/useAppMarket";
import InfiniteScroll from "react-infinite-scroll-component";

const AppMarket: FunctionComponent<AppMarketProps> = ({
  dict,
}): JSX.Element => {
  const { appMarketLoading, appMarket, getMoreAppMarket, data } =
    useAppMarket();

  const colors = [
    "bg-morado",
    "bg-arbol",
    "bg-rosa",
    "bg-apagado",
    "bg-mar",
    "bg-coral",
    "bg-pez",
    "bg-corazon",
    "bg-dorado",
  ];

  return (
    <div className="relative w-full h-fit flex">
      <div className="absolute top-0 left-0 flex w-full h-full">
        <Image
          layout="fill"
          objectFit="cover"
          className="rounded-md"
          src={`${INFURA_GATEWAY}/ipfs/QmXZSyTXMxttm9jxioNH3k5L9uWpnbFTrTUK85muBen21F`}
          alt="spots"
          draggable={false}
        />
      </div>
      <div className="relative w-full h-[50rem] flex overflow-y-scroll justify-start items-start p-2">
        <InfiniteScroll
          dataLength={appMarket?.length}
          loader={<></>}
          hasMore={data.hasMore}
          next={getMoreAppMarket}
          className="w-full h-fit items-start justify-start grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          {appMarketLoading || appMarket.length < 1
            ? Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="relative w-full h-fit flex flex-col rounded-lg bg-nube p-1"
                >
                  <div
                    className={`relative w-full h-80 flex p-4 rounded-lg ${
                      colors[i % 9]
                    }`}
                  ></div>
                  <div className="relative w-full h-20 flex"></div>
                </div>
              ))
            : appMarket?.map((item, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative w-full h-fit flex flex-col rounded-lg bg-nube p-1"
                  >
                    <div
                      className={`relative w-full h-80 flex p-4 rounded-lg ${
                        colors[index % 9]
                      }`}
                    ></div>
                    <div className="relative w-full h-20 flex"></div>
                  </div>
                );
              })}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default AppMarket;
