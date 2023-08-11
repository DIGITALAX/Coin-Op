import { FunctionComponent } from "react";
import { FiatProps } from "../../types/common.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import Countdown from "react-countdown";
import { ImCross } from "react-icons/im";
import { setFiat } from "../../../../../redux/reducers/fiatSlice";
import Link from "next/link";

const Fiat: FunctionComponent<FiatProps> = ({ dispatch }): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-full sm:w-[50vw] lg:w-[30vw] h-fit col-start-1 place-self-center bg-black rounded-lg">
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-4 pb-8">
              <div className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer">
                <ImCross
                  color="white"
                  size={15}
                  onClick={() => dispatch(setFiat(false))}
                />
              </div>
              <div className="relative w-full h-fit flex flex-col items-center justify-center px-4 gap-6">
                <div className="relative w-3/4 h-fit justify-center items-center text-white font-mana text-sm text-center">
                  New to Web3? You're next Quest to overcome barriers into web3
                  and AI launching in...
                </div>
                <div className="relative w-3/4 h-fit justify-center items-center text-white font-mana text-sm text-center">
                  <Countdown date={new Date(2023, 7, 30)} />
                </div>
                <Link
                  href={"/quests"}
                  className="relative px-2 py-1.5 w-fit h-fit justify-center items-center text-white font-mana text-xs text-center cursor-pointer border border-white rounded-md"
                  onClick={() => dispatch(setFiat(false))}
                >
                  <div className="relative flex items-center justify-center">
                    {"quests >"}
                  </div>
                </Link>
                <div className="relative w-1/2 h-36 preG:h-52 lg:h-40 xl:h-52 justify-center items-center rounded-lg border border-white bg-cross">
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/QmXHbhAtBoW7UJL1uiHuavanFM8wd7dxqyWhZkjV9NVaFi`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fiat;
