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
  signInLoading,
  compositeRef,
  chain,
  openChainModal,
  apiKey
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col">
      <Grid
        chain={chain}
        openChainModal={openChainModal}
        dispatch={dispatch}
        shareSet={shareSet}
        setShareSet={setShareSet}
        address={address}
        profile={profile}
        handleLensSignIn={handleLensSignIn}
        openConnectModal={openConnectModal}
        models={models}
        signInLoading={signInLoading}
        compositeRef={compositeRef}
        apiKey={apiKey}
      />
    </div>
  );
};

export default Composite;
