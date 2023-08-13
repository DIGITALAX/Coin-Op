import { FunctionComponent } from "react";
import { CartItem, PreRollProps } from "../types/common.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import PrintTag from "./PrintTag";
import ColorChoice from "./ColorChoice";
import { setCart } from "../../../../redux/reducers/cartSlice";
import { setImageViewer } from "../../../../redux/reducers/imageViewerSlice";
import SizingChoice from "./SizingChoice";

const PreRoll: FunctionComponent<PreRollProps> = ({
  preRoll,
  dispatch,
  cartItems,
  preRolls,
  left,
  right,
  preRollAnim,
}): JSX.Element => {
  return (
    <div
      className="relative w-48 xl:w-full h-fit flex flex-col rounded-sm border border-white p-3 gap-5"
      id={preRollAnim ? "anim" : ""}
    >
      <div
        className="relative w-full h-60 xl:h-80 flex flex-col object-cover bg-cross bg-cover bg-center cursor-pointer"
        onClick={() =>
          dispatch(
            setImageViewer({
              actionValue: open,
              actionImage: preRoll?.uri?.image?.split("ipfs://")[1],
            })
          )
        }
      >
        {preRoll.uri.image && (
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${
              preRoll?.uri?.image?.split("ipfs://")[1]
            }`}
            layout="fill"
            objectFit="cover"
            draggable={false}
            alt="preRoll"
            priority
          />
        )}
      </div>
      <div className="relative flex flex-row gap-2 w-full h-fit justify-between">
        <PrintTag backgroundColor={preRoll.bgColor} type={preRoll.printType} />
        <ColorChoice
          dispatch={dispatch}
          preRolls={preRolls}
          preRoll={preRoll}
          left={left}
          right={right}
        />
      </div>
      <SizingChoice
        dispatch={dispatch}
        preRolls={preRolls}
        preRoll={preRoll}
        left={left}
        right={right}
      />
      <div className="relative flex flex-row gap-2 w-full h-fit items-center">
        <div className="relative text-xl text-white font-aqua flex justify-start items-start w-fit h-fit">
          $
          {(preRoll?.printType === "shirt" || preRoll?.printType === "hoodie"
            ? preRoll.price?.[0]
            : preRoll.price?.[preRoll.sizes.indexOf(preRoll.chosenSize)]) /
            10 ** 18}
        </div>
        <div
          className="relative text-xl text-white font-aqua flex justify-end ml-auto w-5 items-center h-4 cursor-pointer active:scale-95"
          onClick={() => {
            let { colors, bgColor, ...newObj } = preRoll;
            const existing = [...cartItems].findIndex(
              (item) =>
                item.collectionId === newObj.collectionId &&
                item.chosenSize === newObj.chosenSize &&
                item.chosenColor === newObj.chosenColor
            );

            let newCartItems: CartItem[] = [...cartItems];

            if (existing !== -1) {
              newCartItems = [
                ...newCartItems.slice(0, existing),
                {
                  ...newCartItems[existing],
                  amount: newCartItems[existing].amount + 1,
                },
                ...newCartItems.slice(existing + 1),
              ];
            } else {
              newCartItems.push({
                ...newObj,
                amount: 1,
                price:
                  preRoll?.printType === "shirt" ||
                  preRoll?.printType === "hoodie"
                    ? preRoll.price?.[0]
                    : preRoll.price?.[
                        preRoll.sizes?.indexOf(preRoll.chosenSize)
                      ],
              });
            }

            dispatch(setCart(newCartItems));
          }}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmcDmX2FmwjrhVDLpNii6NdZ4KisoPLMjpRUheB6icqZcV`}
            layout="fill"
            objectFit="cover"
            draggable={false}
            alt="preRoll"
          />
        </div>
      </div>
    </div>
  );
};

export default PreRoll;
