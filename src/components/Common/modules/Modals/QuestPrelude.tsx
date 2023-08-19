import { FunctionComponent } from "react";
import { QuestPreludeProps } from "../../types/common.types";
import { ImCross } from "react-icons/im";
import { setQuestPrelude } from "../../../../../redux/reducers/questPreludeSlice";
import { setLogin } from "../../../../../redux/reducers/loginSlice";
import Link from "next/link";
import { AiOutlineLoading } from "react-icons/ai";

const QuestPrelude: FunctionComponent<QuestPreludeProps> = ({
  dispatch,
  signUpForQuest,
  connected,
  chain,
  openChainModal,
  questSignUpLoading,
  isSubscribed,
  connectedPKP,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-full sm:w-[50vw] lg:w-[30vw] h-fit col-start-1 place-self-center bg-black rounded-lg border border-white">
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-4 pb-8">
              <div
                className={`relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer`}
              >
                <ImCross
                  color="white"
                  size={15}
                  onClick={() => dispatch(setQuestPrelude(false))}
                />
              </div>
              <div className="relative w-full h-fit flex flex-col items-center justify-center px-4 gap-6">
                <div className="relative text-xl font-vcr text-white text-center flex items-center justify-center">
                  The Machines Challenge You To A Dance Off.
                </div>
                <div
                  className={`relative w-full h-fit justify-center items-center text-sol font-vcr text-sm text-center text-center break-words flex`}
                >
                  <div className="relative w-fit h-fit flex flex-row gap-2 items-center justify-center flex-wrap">
                    <p className="flex">But first...got motion climbing</p>
                    <p className="text-eme flex">Maslow&apos;s self custody</p>
                    <p className="flex">ladder?</p>
                  </div>
                </div>
                <div
                  className="relative flex w-48 h-10 rounded-md bg-gris/50 border border-white items-center justify-center cursor-pointer active:scale-95 text-white font-vcr overflow-hidden text-sm"
                  id="glisten"
                  onClick={
                    !connected && !connectedPKP
                      ? () =>
                          dispatch(
                            setLogin({
                              actionOpen: true,
                              actionHighlight: undefined,
                            })
                          )
                      : connected && chain !== 137
                      ? openChainModal
                      : () => signUpForQuest()
                  }
                >
                  <div
                    className={`relative w-fit h-fit flex items-center justify-center ${
                      questSignUpLoading && "animate-spin"
                    }`}
                  >
                    {questSignUpLoading ? (
                      <AiOutlineLoading size={15} color="white" />
                    ) : (
                      "claim sig"
                    )}
                  </div>
                </div>
                {!isSubscribed && (
                  <div className="relative w-full h-fit gap-3 flex flex-col items-center justify-center text-center pt-4">
                    <div
                      className={`relative w-full h-fit justify-center items-center text-white font-vcr text-base text-center text-center break-words flex `}
                    >
                      <div className="relative w-fit h-fit flex items-center justify-center">
                        Need something extra before the main attraction?
                      </div>
                    </div>
                    <Link
                      className="relative flex w-48 h-10 rounded-md bg-eme/50 border border-white items-center justify-center cursor-pointer active:scale-95 text-white font-vcr overflow-hidden text-sm"
                      id="glisten"
                      href={"/pregame"}
                      onClick={() => dispatch(setQuestPrelude(false))}
                    >
                      <div
                        className={`relative w-fit h-fit flex items-center justify-center`}
                      >
                        level up or lose it
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestPrelude;
