import { FunctionComponent } from "react";

import { ImCross } from "react-icons/im";
import { setQuoteBox } from "../../../../../redux/reducers/quoteBoxSlice";
import PostQuote from "../PostQuote";
import PostComment from "../PostComment";
import { QuoteBoxProps } from "../../types/common.types";

const QuoteBox: FunctionComponent<QuoteBoxProps> = ({
  dispatch,
  quote,
  makePost,
  post,
  setMakePost,
  postLoading,
  postCollect,
  router,
  lensConnected,
  caretCoord,
  profilesOpen,
  mentionProfiles,
  setMentionProfiles,
  setProfilesOpen,
  setCaretCoord,
  type,
  t
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] sm:w-[70vw] tablet:w-[40vw] h-fit max-h-[90vh] min-h-[27vh] place-self-center bg-offBlack border border-white overflow-y-scroll">
        <div className="relative w-full h-full flex flex-col gap-3 p-2 items-start justify-center">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="white"
              size={10}
              onClick={() =>
                dispatch(
                  setQuoteBox({
                    actionOpen: false,
                  })
                )
              }
            />
          </div>
          {quote && type !== "comment" && (
            <PostQuote
              pink
              router={router}
              dispatch={dispatch}
              quote={quote}
              disabled={true}
            />
          )}
          <div className="relative w-full h-full flex items-center justify-center pb-3">
            <div className="relative h-full w-4/5 items-center justify-center flex">
              <PostComment
                t={t}
                dispatch={dispatch}
                itemId={undefined}
                router={router}
                setCaretCoord={setCaretCoord}
                caretCoord={caretCoord}
                profilesOpen={profilesOpen?.[0]}
                mentionProfiles={mentionProfiles}
                setMentionProfiles={setMentionProfiles}
                setProfilesOpen={setProfilesOpen}
                lensConnected={lensConnected}
                main={false}
                setMakePostComment={setMakePost}
                makePostComment={makePost?.[0]}
                commentPostLoading={postLoading?.[0]}
                commentPost={post}
                height="25vh"
                index={0}
                id={quote?.id}
                postCollect={postCollect}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteBox;
