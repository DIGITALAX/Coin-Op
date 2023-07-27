import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { getAllPreRolls } from "../../../../graphql/subgraph/queries/getPreRolls";
import { setPreRoll } from "../../../../redux/reducers/preRollSlice";
import { PreRoll } from "../types/common.types";

const usePreRoll = () => {
  const dispatch = useDispatch();
  const preRolls = useSelector((state: RootState) => state.app.preRollReducer);
  const algoila = useSelector(
    (state: RootState) => state.app.algoliaReducer.value
  );
  const [preRollsLoading, setPreRollsLoading] = useState<boolean>(false);

  const getPreRolls = async () => {
    setPreRollsLoading(true);
    try {
      const data = await getAllPreRolls();
      console.log(data);
      const preRollsAdded = data?.data?.collectionCreateds?.map(
        (obj: PreRoll) => {
          const modifiedObj = {
            ...obj,
            tags: [
              ...(obj.printType === "Stickers" ? ["stickers"] : []),
              ...(obj.printType === "Posters" ? ["posters"] : []),
              ...(obj.printType === "Hoodie"
                ? ["hoodie", "hoodies", "apparel"]
                : ["shirt", "shirts", "apparel"]),
              "smile",
              "oil",
              "painting",
              "streetwear",
              "graffiti",
              "tagging",
            ],
            chosenSize:
              obj.printType === "Stickers"
                ? '2"x2"'
                : obj.printType === "Poster"
                ? '11"x17"'
                : "M",
            chosenColor: "#ffffff",
            colors:
              obj.printType === "Stickers"
                ? ["#ffffff", "#000000"]
                : obj.printType === "Poster"
                ? ["#ffffff", "#000000"]
                : ["#030D6B", "#FBDB86", "#ffffff", "#000000"],
            sizes:
              obj.printType === "Stickers"
                ? ['2"x2"', '4"x4"', '6"x6"']
                : obj.printType === "Poster"
                ? ['11"x17"', '18"x24"', '24"x36"']
                : ["XS", "S", "M", "L", "XL"],
            bgColor:
              obj.printType === "Hoodie"
                ? "#32C5FF"
                : obj.printType === "Shirt"
                ? "#6236FF"
                : obj.printType === "Poster"
                ? "#FFC800"
                : "#B620E0",
          };

          return modifiedObj;
        }
      );
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

      algoila && algoila.saveObjects(preRollsAdded, { replaceExisting: true });
    } catch (err: any) {
      console.error(err.message);
    }
    setPreRollsLoading(false);
  };

  useEffect(() => {
    if (preRolls.left?.length < 1 && preRolls.right?.length < 1) {
      getPreRolls();
    }
  }, [preRolls]);

  return {
    preRollsLoading,
  };
};

export default usePreRoll;
