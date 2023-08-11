import { FunctionComponent } from "react";
import { LoginProps } from "../../types/common.types";
import { ImCross } from "react-icons/im";
import { setLogin } from "../../../../../redux/reducers/loginSlice";
import { AiOutlineLoading } from "react-icons/ai";

const Login: FunctionComponent<LoginProps> = ({
  dispatch,
  openConnectModal,
  loginWithDiscord,
  loginLoading,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-full sm:w-[50vw] lg:w-[30vw] h-fit col-start-1 place-self-center bg-black rounded-lg border border-white">
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-4 pb-8">
              <div className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer">
                <ImCross
                  color="white"
                  size={15}
                  onClick={() => dispatch(setLogin(false))}
                />
              </div>
              <div className="relative w-full h-fit flex flex-col items-center justify-center px-4 gap-6">
                <div
                  className="relative  w-60 h-10 justify-center items-center text-white font-mana text-sm text-center cursor-pointer active:scale-95 border border-white  px-3 py-2 flex bg-sol/50"
                  onClick={() => dispatch(setLogin(false))}
                  onClickCapture={openConnectModal}
                >
                  <div className="relative w-fit h-fit flex items-center justify-center">
                    Connect Wallet
                  </div>
                </div>
                <div
                  className="relative w-60 h-10 justify-center items-center text-white font-mana text-sm text-center border border-white px-3 py-2 flex bg-sol/50 opacity-30"
                  // onClick={() => loginWithDiscord()}
                >
                  <div
                    className={`relative w-fit h-fit flex items-center justify-center ${
                      loginLoading && "animate-spin"
                    }`}
                  >
                    {loginLoading ? (
                      <AiOutlineLoading size={15} color="white" />
                    ) : (
                      "Connect Google Auth"
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
