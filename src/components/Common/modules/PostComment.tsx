import { FunctionComponent, useRef } from "react";
import { PostCommentProps } from "../types/common.types";
import createProfilePicture from "../../../../lib/lens/helpers/createProfilePicture";
import { Profile } from "../types/generated";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";
import handleSearchProfiles from "../../../../lib/lens/helpers/handleSearchProfiles";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { setPostCollect } from "../../../../redux/reducers/postCollectSlice";

const PostComment: FunctionComponent<PostCommentProps> = ({
  commentPost,
  makePostComment,
  setMakePostComment,
  commentPostLoading,
  id,
  itemId,
  height,
  index,
  main,
  mentionProfiles,
  profilesOpen,
  setMentionProfiles,
  setProfilesOpen,
  lensConnected,
  caretCoord,
  setCaretCoord,
  router,
  postCollect,
  dispatch,
}): JSX.Element => {
  const textElement = useRef(null);
  return (
    <div className="relative w-full h-fit flex flex-col items-start justify-start gap-2">
      <div
        className="relative w-full p-2 border border-white text-white font-sat text-sm bg-black flex items-center justify-center text-left rounded-md"
        style={{
          height,
        }}
      >
        <textarea
          className="bg-black relative w-full text-xs h-full p-1 flex"
          style={{ resize: "none" }}
          value={makePostComment?.content}
          onChange={(e) => {
            setMakePostComment((prev) => {
              const arr = [...prev];
              arr[index] = {
                ...arr[index],
                content: e.target.value,
              };
              return arr;
            });
            handleSearchProfiles(
              e,
              setProfilesOpen,
              setMentionProfiles,
              index,
              lensConnected,
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
            {mentionProfiles?.map((user: Profile, indexTwo: number) => {
              const profileImage = createProfilePicture(
                user?.metadata?.picture
              );
              return (
                <div
                  key={indexTwo}
                  className={`relative border-y border-white w-full h-10 px-3 py-2 bg-black flex flex-row gap-3 cursor-pointer items-center justify-center`}
                  onClick={() => {
                    setProfilesOpen((prev) => {
                      const arr = [...prev];
                      arr[index] = false;
                      return arr;
                    });

                    setMakePostComment((prev) => {
                      const arr = [...prev];
                      arr[index] = {
                        ...arr[index],
                        content:
                          makePostComment?.content?.substring(
                            0,
                            makePostComment?.content?.lastIndexOf("@")
                          ) + `${user?.handle?.suggestedFormatted?.localName}`,
                      };
                      return arr;
                    });
                  }}
                >
                  <div className="relative flex flex-row w-full h-full text-white font-sat items-center justify-center gap-2">
                    <div
                      className={`relative rounded-full flex bg-black w-3 h-3 items-center justify-center`}
                    >
                      {profileImage && (
                        <Image
                          src={profileImage}
                          objectFit="cover"
                          alt="pfp"
                          layout="fill"
                          className="relative w-fit h-fit rounded-full items-center justify-center flex"
                          draggable={false}
                        />
                      )}
                    </div>
                    <div className="relative items-center justify-center w-fit h-fit text-xxs flex">
                      {user?.handle?.suggestedFormatted?.localName}
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
              dispatch(
                setPostCollect({
                  actionId: id,
                  actionCollectTypes: postCollect?.collectTypes,
                })
              )
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
              !commentPostLoading && "cursor-pointer active:scale-95"
            }`}
            onClick={() =>
              !commentPostLoading &&
              (main || router.asPath?.includes("item")
                ? (
                    commentPost as (
                      id: string,
                      main?: boolean,
                      mirror?: string
                    ) => Promise<void>
                  )(itemId ? itemId : id, main, id)
                : (commentPost as (
                    id: string,
                    mirror?: string
                  ) => Promise<void>)!(itemId ? itemId : id, id))
            }
          >
            <div
              className={`${
                commentPostLoading && "animate-spin"
              } relative w-fit h-fit flex items-center justify-center text-center`}
            >
              {commentPostLoading ? (
                <AiOutlineLoading size={15} color="white" />
              ) : (
                "Send It"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComment;
