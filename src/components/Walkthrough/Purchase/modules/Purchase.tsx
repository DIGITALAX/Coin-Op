import { FunctionComponent } from "react";
import Grid from "./Grid";
import { PurchaseProps } from "../types/synth.types";

const Purchase: FunctionComponent<PurchaseProps> = ({
  dispatch,
  scrollRef,
  cartItems
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col">
      <Grid dispatch={dispatch} scrollRef={scrollRef} />
    </div>
  );
};

export default Purchase;
