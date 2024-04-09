import { FunctionComponent } from "react";
import {
  Preroll as PrerollInterface,
  PrerollsProps,
} from "../types/common.types";
import Preroll from "./Preroll";
import usePreroll from "../hooks/usePreroll";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import useInteractions from "../hooks/useInteractions";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import { useAccount } from "wagmi";
import { useTranslation } from "next-i18next";

const Prerolls: FunctionComponent<PrerollsProps> = ({
  left,
  right,
}): JSX.Element => {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const { t } = useTranslation("common");
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const prerolls = useSelector((state: RootState) => state.app.prerollReducer);
  const cartItems = useSelector(
    (state: RootState) => state.app.cartReducer.value
  );
  const lensConnected = useSelector(
    (state: RootState) => state.app.profileReducer?.profile
  );
  const prerollAnim = useSelector(
    (state: RootState) => state.app.prerollAnimReducer.value
  );
  const prerollsLoading = useSelector(
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
  } = usePreroll(dispatch, prerolls, lensConnected);
  const {
    mirror,
    like,
    openMirrorChoice,
    setOpenMirrorChoice,
    interactionsLoading,
  } = useInteractions(
    prerolls,
    lensConnected,
    dispatch,
    publicClient,
    address,
    t
  );

  return (
    <div className="relative w-full xl:m-w-[20rem] xl:w-80 h-fit xl:h-full flex overflow-x-scroll xl:overflow-x-hidden xl:overflow-y-scroll">
      <div className="relative w-fit xl:w-fit h-fit flex xl:flex-col flex-row justify-start items-center gap-10">
        {prerollsLoading
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
          : (left ? prerolls.left : prerolls.right)?.map(
              (preroll: PrerollInterface, index: number) => {
                return (
                  <Preroll
                    key={index}
                    t={t}
                    cartAddAnim={cartAddAnim}
                    preroll={preroll}
                    cartItems={cartItems}
                    dispatch={dispatch}
                    prerolls={prerolls}
                    left={left}
                    right={right}
                    prerollAnim={prerollAnim}
                    setImagesLoading={
                      left ? setImagesLoadingLeft : setImagesLoadingRight
                    }
                    imageLoading={
                      left
                        ? imagesLoadingLeft[index]
                        : imagesLoadingRight[index]
                    }
                    index={index}
                    mirror={mirror}
                    like={like}
                    interactionsLoading={interactionsLoading}
                    openMirrorChoice={openMirrorChoice}
                    setOpenMirrorChoice={setOpenMirrorChoice}
                  />
                );
              }
            )}
      </div>
    </div>
  );
};

export default Prerolls;
