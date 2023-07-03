import { FunctionComponent } from "react";
import { CompositeProps } from "../types/composite.types";
import Grid from "./Grid";

const Composite: FunctionComponent<CompositeProps> = ({
  dispatch,
  shareSet,
  setShareSet,
  address,
  profile,
  handleLensSignIn,
  openConnectModal,
  models,
  signInLoading
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col">
      <Grid
        dispatch={dispatch}
        shareSet={shareSet}
        setShareSet={setShareSet}
        address={address}
        profile={profile}
        handleLensSignIn={handleLensSignIn}
        openConnectModal={openConnectModal}
        models={models}
        signInLoading={signInLoading}
      />
    </div>
  );
};

export default Composite;
