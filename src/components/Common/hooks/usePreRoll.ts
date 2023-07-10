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
      const preRollsAdded = data?.data?.collectionCreateds?.map(
        (obj: PreRoll) => {
          const modifiedObj = {
            ...obj,
            tags: [
              "hoodie",
              "smile",
              "oil",
              "painting",
              "streetwear",
              "graffiti",
              "tagging",
            ],
            chosenSize: "M",
            chosenColor: "#ffffff",
            colors: ["#030D6B", "#FBDB86", "#ffffff", "#000000"],
            sizes: ["XS", "S", "M", "L", "XL"],
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
