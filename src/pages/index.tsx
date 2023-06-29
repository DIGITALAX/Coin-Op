import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PageContainer from "../components/Common/modules/PageContainer";
import PreRolls from "../components/Common/modules/PreRolls";
import useComposite from "@/components/Walkthrough/Composite/hooks/useComposite";
import { useContext } from "react";
import { ScrollContext } from "./_app";

export default function Home(): JSX.Element {
  const scrollRef = useContext(ScrollContext);
  const dispatch = useDispatch();
  const { setShareSet, shareSet } = useComposite();
  const preRolls = useSelector((state: RootState) => state.app.preRollReducer);
  const cartItems = useSelector(
    (state: RootState) => state.app.cartReducer.value
  );
  const synthLayer = useSelector(
    (state: RootState) => state.app.synthLayerReducer.value
  );
  const template = useSelector(
    (state: RootState) => state.app.templateReducer.value
  );
  const synthLayerSelected = useSelector(
    (state: RootState) => state.app.layerToSynthReducer.value
  );
  return (
    <div className="relative overflow-hidden w-full h-[60rem] flex flex-row px-6 gap-10">
      <PreRolls
        cartItems={cartItems}
        dispatch={dispatch}
        preRolls={preRolls}
        left={true}
      />
      <PageContainer
        template={template}
        dispatch={dispatch}
        synthLayer={synthLayer}
        synthLayerSelected={synthLayerSelected}
        setShareSet={setShareSet}
        shareSet={shareSet}
        scrollRef={scrollRef}
        cartItems={cartItems}
      />
      <PreRolls
        cartItems={cartItems}
        dispatch={dispatch}
        preRolls={preRolls}
        right={true}
      />
    </div>
  );
}
