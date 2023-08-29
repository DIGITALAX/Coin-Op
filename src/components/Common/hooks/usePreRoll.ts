import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { getAllPreRolls } from "../../../../graphql/subgraph/queries/getPreRolls";
import { setPreRoll } from "../../../../redux/reducers/preRollSlice";
import { PreRoll } from "../types/common.types";
import { fetchIpfsJson } from "../../../../lib/algolia/helpers/fetchIpfsJson";
import { initializeAlgolia } from "../../../../lib/algolia/client";
import { setAlgolia } from "../../../../redux/reducers/algoliaSlice";

const usePreRoll = () => {
  const dispatch = useDispatch();
  const preRolls = useSelector((state: RootState) => state.app.preRollReducer);
  const algoila = useSelector(
    (state: RootState) => state.app.algoliaReducer.value
  );
  const [preRollsLoading, setPreRollsLoading] = useState<boolean>(false);
  const [imagesLoadingLeft, setImagesLoadingLeft] = useState<boolean[]>([]);
  const [imagesLoadingRight, setImagesLoadingRight] = useState<boolean[]>([]);

  const getPreRolls = async () => {
    setPreRollsLoading(true);
    try {
      const data = await getAllPreRolls();

      if (
        data?.data?.collectionCreateds?.length < 1 ||
        !data?.data?.collectionCreateds
      ) {
        setPreRollsLoading(false);
        return;
      }

      const preRollsAddedPromises = data?.data?.collectionCreateds?.map(
        async (obj: PreRoll, index: number) => {
          const modifiedObj = {
            ...obj,
            uri: await fetchIpfsJson((obj.uri as any)?.split("ipfs://")[1]),
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
                : "#B620E0",
            currentIndex: 0,
            newDrop: index < 5 ? true : false,
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

      // let algoilaIndex = algoila;

      if (!algoila) {
        const index = initializeAlgolia();
        dispatch(setAlgolia(index));
        // algoilaIndex = index;
      }

      // await algoilaIndex!.replaceAllObjects(preRollsAdded, {
      //   autoGenerateObjectIDIfNotExist: true,
      // });
    } catch (err: any) {
      console.error(err.message);
    }
    setPreRollsLoading(false);
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
    preRollsLoading,
    imagesLoadingLeft,
    setImagesLoadingLeft,
    imagesLoadingRight,
    setImagesLoadingRight,
  };
};

export default usePreRoll;
