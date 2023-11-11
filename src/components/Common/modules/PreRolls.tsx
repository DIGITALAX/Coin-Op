import { FunctionComponent } from "react";
import {
  PreRoll as PreRollInterface,
  PreRollsProps,
} from "../types/common.types";
import PreRoll from "./PreRoll";
import usePreRoll from "../hooks/usePreRoll";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

const PreRolls: FunctionComponent<PreRollsProps> = ({
  left,
  right,
}): JSX.Element => {
  const dispatch = useDispatch();
  const preRolls = useSelector((state: RootState) => state.app.preRollReducer);
  const cartItems = useSelector(
    (state: RootState) => state.app.cartReducer.value
  );
  const preRollAnim = useSelector(
    (state: RootState) => state.app.preRollAnimReducer.value
  );
  const algolia = useSelector(
    (state: RootState) => state.app.algoliaReducer.value
  );
  const preRollsLoading = useSelector(
    (state: RootState) => state.app.prerollsLoadingReducer.value
  );
  const cartAddAnim = useSelector(
    (state: RootState) => state.app.cartAddAnimReducer.value
  );
  const {
    imagesLoadingLeft,
    setImagesLoadingLeft,
    imagesLoadingRight,
    setImagesLoadingRight,
  } = usePreRoll(dispatch, preRolls, algolia);
  return (
    <div className="relative w-full xl:min-w-80 xl:w-80 h-fit xl:h-full flex overflow-x-scroll xl:overflow-x-hidden xl:overflow-y-scroll">
      <div className="relative w-fit xl:w-full h-fit flex xl:flex-col flex-row justify-start items-center gap-10">
        {preRollsLoading
          ? Array.from({ length: 40 }).map((_, index: number) => {
              return (
                <div
                  className="relative w-48 h-60 xl:h-80 flex flex-col rounded-sm border border-white p-3"
                  key={index}
                >
                  <div
                    className="relative w-full h-full flex flex-col"
                    id={"staticLoad"}
                  ></div>
                </div>
              );
            })
          : (left ? preRolls.left : preRolls.right)?.map(
              (preRoll: PreRollInterface, index: number) => {
                return (
                  <PreRoll
                    key={index}
                    cartAddAnim={cartAddAnim}
                    preRoll={preRoll}
                    cartItems={cartItems}
                    dispatch={dispatch}
                    preRolls={preRolls}
                    left={left}
                    right={right}
                    preRollAnim={preRollAnim}
                    setImagesLoading={
                      left ? setImagesLoadingLeft : setImagesLoadingRight
                    }
                    imageLoading={
                      left
                        ? imagesLoadingLeft[index]
                        : imagesLoadingRight[index]
                    }
                    index={index}
                  />
                );
              }
            )}
      </div>
    </div>
  );
};

export default PreRolls;
