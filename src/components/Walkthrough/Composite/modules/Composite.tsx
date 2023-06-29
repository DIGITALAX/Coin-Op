import { FunctionComponent } from "react";
import { CompositeProps } from "../types/composite.types";
import Grid from "./Grid";

const Composite: FunctionComponent<CompositeProps> = ({
  dispatch,
  shareSet,
  setShareSet,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col">
      <Grid dispatch={dispatch} shareSet={shareSet} setShareSet={setShareSet} />
    </div>
  );
};

export default Composite;
