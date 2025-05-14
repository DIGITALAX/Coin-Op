import { ModalContext } from "@/app/providers";
import { FunctionComponent, JSX, useContext } from "react";
import { ImCross } from "react-icons/im";
import PostQuote from "./PostQuote";
import { useRouter } from "next/navigation";
import PostComment from "./PostComment";

const QuoteBox: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] sm:w-[70vw] tablet:w-[40vw] h-fit max-h-[90vh] min-h-[27vh] place-self-center bg-offBlack border border-white overflow-y-scroll">
        <div className="relative w-full h-full flex flex-col gap-3 p-2 items-start justify-center">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="white"
              size={10}
              onClick={() => context?.setQuoteBox(undefined)}
            />
          </div>
          {context?.quoteBox?.quote &&
            context?.quoteBox?.type !== "comment" && (
              <PostQuote
                pink
                router={router}
                quote={context?.quoteBox?.quote}
                disabled={true}
              />
            )}
          <div className="relative w-full h-full flex items-center justify-center pb-3">
            <div className="relative h-full w-4/5 items-center justify-center flex">
              <PostComment router={router} dict={dict} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteBox;
