import { useEffect, useState } from "react";
import { getAllPreRolls } from "../../../../graphql/subgraph/queries/getPreRolls";
import {
  PreRollState,
  setPreRoll,
} from "../../../../redux/reducers/preRollSlice";
import { PreRoll } from "../types/common.types";
import { initializeAlgolia } from "../../../../lib/algolia/client";
import { setAlgolia } from "../../../../redux/reducers/algoliaSlice";
import { getOneProfile } from "../../../../graphql/lens/queries/getProfile";
import { DIGITALAX_PROFILE_ID_LENS } from "../../../../lib/constants";
import { Profile } from "../types/generated";
import { setPreRollLoading } from "../../../../redux/reducers/prerollsLoadingSlice";
import { AnyAction, Dispatch } from "redux";
import { SearchIndex } from "algoliasearch";
import fetchIPFSJSON from "../../../../lib/algolia/helpers/fetchIpfsJson";

const usePreRoll = (
  dispatch: Dispatch<AnyAction>,
  preRolls: PreRollState,
  algolia: SearchIndex | undefined
) => {
  const [imagesLoadingLeft, setImagesLoadingLeft] = useState<boolean[]>([]);
  const [imagesLoadingRight, setImagesLoadingRight] = useState<boolean[]>([]);

  const getPreRolls = async () => {
    dispatch(setPreRollLoading(true));
    try {
      const data = await getAllPreRolls();

      if (
        data?.data?.collectionCreateds?.length < 1 ||
        !data?.data?.collectionCreateds
      ) {
        dispatch(setPreRollLoading(false));
        return;
      }
      const profileCache: { [key: string]: Profile } = {};
      const digitalaxProfile = await getOneProfile({
        forProfileId: DIGITALAX_PROFILE_ID_LENS,
      });
      profileCache[DIGITALAX_PROFILE_ID_LENS] = digitalaxProfile?.data
        ?.profile as Profile;

      const preRollsAddedPromises = data?.data?.collectionCreateds?.map(
        async (obj: PreRoll, index: number) => {
          const uri = await fetchIPFSJSON(obj.uri as any);
          let profile: Profile = profileCache[DIGITALAX_PROFILE_ID_LENS];

          if (uri?.profile) {
            if (!profileCache[uri.profile]) {
              const res = await getOneProfile({
                forProfileId: uri.profile,
              });
              profileCache[uri.profile] = res?.data?.profile as Profile;
            }
            profile = profileCache[uri.profile];
          }

          const modifiedObj = {
            ...obj,
            uri: {
              ...uri,
              profile,
            },
            chosenSize:
              obj.printType === "sticker"
                ? '2"x2"'
                : obj.printType === "poster"
                ? '11"x17"'
                : "M",
            chosenColor: "#ffffff",
            colors:
              obj.printType === "sticker"
                ? ["#ffffff"]
                : obj.printType === "poster"
                ? ["#ffffff"]
                : ["#030D6B", "#FBDB86", "#ffffff", "#000000"],
            sizes:
              obj.printType === "sticker"
                ? ['2"x2"', '4"x4"', '6"x6"']
                : obj.printType === "poster"
                ? ['11"x17"', '18"x24"', '24"x36"']
                : ["XS", "S", "M", "L", "XL"],
            bgColor:
              obj.printType === "hoodie"
                ? "#32C5FF"
                : obj.printType === "shirt"
                ? "#6236FF"
                : obj.printType === "poster"
                ? "#FFC800"
                : obj.printType === "sleeve"
                ? "#29C28A"
                : "#B620E0",
            currentIndex: 0,
            newDrop: index < 28 ? true : false,
          };

          return modifiedObj;
        }
      );

      const preRollsAdded = await Promise.all(preRollsAddedPromises);
      preRollsAdded.sort(() => Math.random() - 0.5);
      dispatch(
        setPreRoll({
          actionLeft: preRollsAdded?.slice(
            0,
            Math.ceil(preRollsAdded.length / 2)
          ),
          actionRight: preRollsAdded?.slice(
            Math.ceil(preRollsAdded.length / 2)
          ),
        })
      );

      // let algoliaIndex = algolia;

      if (!algolia) {
        const index = initializeAlgolia();
        dispatch(setAlgolia(index));
        // algoliaIndex = index;
      }

      // await algoliaIndex!.replaceAllObjects(preRollsAdded, {
      //   autoGenerateObjectIDIfNotExist: true,

      // });
    } catch (err: any) {
      console.error(err.message);
    }
    dispatch(setPreRollLoading(false));
  };

  useEffect(() => {
    if (preRolls.left?.length < 1 && preRolls.right?.length < 1) {
      getPreRolls();
    }
  }, []);

  useEffect(() => {
    if (preRolls.left?.length > 0 && preRolls.right?.length > 0) {
      setImagesLoadingLeft(
        Array.from({ length: preRolls.left?.length }, () => false)
      );
      setImagesLoadingRight(
        Array.from({ length: preRolls.right?.length }, () => false)
      );
    }
  }, [preRolls]);

  return {
    imagesLoadingLeft,
    setImagesLoadingLeft,
    imagesLoadingRight,
    setImagesLoadingRight,
  };
};

export default usePreRoll;
