import { FunctionComponent, JSX, useContext, useRef } from "react";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import useQuote from "../hooks/useQuote";
import { Account } from "@lens-protocol/client";
import { ModalContext } from "@/app/providers";
import handleSearchProfiles from "@/app/lib/helpers/handleSearchProfiles";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";

const PostComment: FunctionComponent<{
  dict: any;
  router: AppRouterInstance;
}> = ({ dict }): JSX.Element => {
  const textElement = useRef(null);
  const context = useContext(ModalContext);
  const {
    quote,
    quoteLoading,
    setMakeQuote,
    makeQuote,
    mentionProfiles,
    setMentionProfiles,
    caretCoord,
    setCaretCoord,
    setProfilesOpen,
    profilesOpen,
  } = useQuote(dict);

  return (
    <div className="relative w-full h-fit flex flex-col items-start justify-start gap-2">
      <div
        className="relative w-full p-2 border border-white text-white font-sat text-sm bg-black flex items-center justify-center text-left rounded-md"
        style={{
          height: "25vh",
        }}
      >
        <textarea
          className="bg-black relative w-full text-xs h-full p-1 flex"
          style={{ resize: "none" }}
          value={makeQuote}
          onChange={(e) => {
            setMakeQuote(e.target.value);
            handleSearchProfiles(
              e,
              setProfilesOpen,
              setMentionProfiles,
              context?.lensConectado,
              context?.clienteLens!,
              setCaretCoord,
              textElement
            );
          }}
          ref={textElement}
        ></textarea>
        {mentionProfiles?.length > 0 && profilesOpen && (
          <div
            className={`absolute w-32 border border-white max-h-28 h-fit flex flex-col overflow-y-auto items-start justify-start z-60`}
            style={{
              top: caretCoord.y + 30,
              left: caretCoord.x,
            }}
          >
            {mentionProfiles?.map((user: Account, indexTwo: number) => {
              return (
                <div
                  key={indexTwo}
                  className={`relative border-y border-white w-full h-10 px-3 py-2 bg-black flex flex-row gap-3 cursor-pointer items-center justify-center`}
                  onClick={() => {
                    setProfilesOpen(false);

                    setMakeQuote(
                      (prev) =>
                        prev?.substring(0, prev?.lastIndexOf("@")) +
                        `${user?.username?.localName}`
                    );
                  }}
                >
                  <div className="relative flex flex-row w-full h-full text-white font-sat items-center justify-center gap-2">
                    <div
                      className={`relative rounded-full flex bg-black w-3 h-3 items-center justify-center`}
                    >
                      <Image
                        src={handleProfilePicture(user?.metadata?.picture)}
                        objectFit="cover"
                        alt="pfp"
                        layout="fill"
                        className="relative w-fit h-fit rounded-full items-center justify-center flex"
                        draggable={false}
                      />
                    </div>
                    <div className="relative items-center justify-center w-fit h-fit text-xxs flex">
                      {user?.username?.localName}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="relative w-full h-fit flex flex-col sm:flex-row items-between justify-center sm:items-center sm:justify-between sm:gap-1.5 gap-4">
        <div className="relative w-full sm:w-fit h-fit items-center justify-start flex flex-row gap-2">
          <div
            className={`relative w-5 h-5 flex items-center justify-center cursor-pointer active:scale-95`}
            title={"collect options"}
            onClick={() =>
              context?.setPostCollect((prev) => ({
                ...(prev || {}),
                id: context?.quoteBox?.quote?.id,
              }))
            }
          >
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmXA7NqjfnoLMWBoA2KsesRQb1SNGQBe2SBxkcT2jEtT4G`}
              draggable={false}
            />
          </div>
        </div>
        <div className="relative w-full sm:w-fit h-fit items-center justify-end flex">
          <div
            className={`relative w-20 h-8 font-sat text-white flex items-center justify-center bg-black border border-white text-xs rounded-sm ${
              !quoteLoading && "cursor-pointer active:scale-95"
            }`}
            onClick={() => !quoteLoading && quote()}
          >
            <div
              className={`${
                quoteLoading && "animate-spin"
              } relative w-fit h-fit flex items-center justify-center text-center`}
            >
              {quoteLoading ? (
                <AiOutlineLoading size={15} color="white" />
              ) : (
                dict?.Common?.send
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComment;
