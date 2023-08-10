import { FunctionComponent } from "react";
import { ApiAddProps } from "../../types/common.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { ImCross } from "react-icons/im";
import { setApiAdd } from "../../../../../redux/reducers/apiAddSlice";
import Link from "next/link";

const ApiAdd: FunctionComponent<ApiAddProps> = ({ dispatch }): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-full lg:w-[30vw] h-fit col-start-1 place-self-center bg-black rounded-lg">
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-4 pb-8">
              <div className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer">
                <ImCross
                  color="white"
                  size={15}
                  onClick={() =>
                    dispatch(
                      setApiAdd({
                        actionOpen: false,
                        actionKey: undefined,
                      })
                    )
                  }
                />
              </div>
              <div className="relative w-full h-fit flex flex-col items-center justify-center px-4 gap-6">
                <Link
                  className="relative w-3/4 h-fit justify-center items-center text-white font-mana text-sm text-center cursor-pointer active:scale-95"
                  href={"/quests"}
                  onClick={() =>
                    dispatch(
                      setApiAdd({
                        actionOpen: false,
                        actionKey: undefined,
                      })
                    )
                  }
                >
                  Set your api key to synth {`>`}
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

export default ApiAdd;
