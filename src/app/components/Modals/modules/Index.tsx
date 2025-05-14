import { ModalContext } from "@/app/providers";
import { FunctionComponent, JSX, useContext } from "react";

const Index: FunctionComponent = (): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="fixed bottom-5 right-5 w-fit h-fit z-50">
      <div className="w-fit h-10 sm:h-12 flex bg-black items-center justify-center border border-white">
        <div className="relative w-fit h-fit flex items-center justify-center px-4 py-2 text-xs text-white font-mana">
          {context?.indexar}
        </div>
      </div>
    </div>
  );
};

export default Index;
