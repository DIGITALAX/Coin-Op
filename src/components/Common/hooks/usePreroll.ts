import { useEffect, useState } from "react";
import { getAllPrerolls } from "../../../../graphql/subgraph/queries/getPrerolls";
import {
  PrerollState,
  setPreroll,
} from "../../../../redux/reducers/prerollSlice";
import { Profile } from "../types/generated";
import { setPrerollLoading } from "../../../../redux/reducers/prerollsLoadingSlice";
import { AnyAction, Dispatch } from "redux";
import handleCollectionProfilesAndPublications from "../../../../lib/subgraph/helpers/handleCollectionProfilesAndPublications";

const usePreroll = (
  dispatch: Dispatch<AnyAction>,
  prerolls: PrerollState,
  lensConnected: Profile | undefined
) => {
  const [imagesLoadingLeft, setImagesLoadingLeft] = useState<boolean[]>([]);
  const [imagesLoadingRight, setImagesLoadingRight] = useState<boolean[]>([]);

  const getPrerolls = async () => {
    dispatch(setPrerollLoading(true));
    try {
      const data = await getAllPrerolls();

      const colls = await handleCollectionProfilesAndPublications(
        data?.data?.collectionCreateds,
        lensConnected
      );

      const sorted = colls?.sort(() => Math.random() - 0.5);
      dispatch(
        setPreroll({
          actionLeft: sorted?.slice(0, Math.ceil(sorted.length / 2)),
          actionRight: sorted?.slice(Math.ceil(sorted.length / 2)),
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    dispatch(setPrerollLoading(false));
  };

  useEffect(() => {
    if (prerolls.left?.length < 1 && prerolls.right?.length < 1) {
      getPrerolls();
    }
  }, []);

  useEffect(() => {
    if (prerolls.left?.length > 0 && prerolls.right?.length > 0) {
      setImagesLoadingLeft(
        Array.from({ length: prerolls.left?.length }, () => false)
      );
      setImagesLoadingRight(
        Array.from({ length: prerolls.right?.length }, () => false)
      );
    }
  }, [prerolls]);

  return {
    imagesLoadingLeft,
    setImagesLoadingLeft,
    imagesLoadingRight,
    setImagesLoadingRight,
  };
};

export default usePreroll;
