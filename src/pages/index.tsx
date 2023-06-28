import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PageContainer from "../components/Common/modules/PageContainer";
import PreRolls from "../components/Common/modules/PreRolls";

export default function Home(): JSX.Element {
  const dispatch = useDispatch();
  const pageSwitcher = useSelector(
    (state: RootState) => state.app.pageReducer.value
  );
  const preRolls = useSelector((state: RootState) => state.app.preRollReducer);
  const cartItems = useSelector(
    (state: RootState) => state.app.cartReducer.value
  );
  return (
    <div className="relative overflow-hidden w-full h-fit flex flex-row px-6 gap-10">
      <PreRolls
        cartItems={cartItems}
        dispatch={dispatch}
        preRolls={preRolls}
        left={true}
      />
      <PageContainer pageSwitcher={pageSwitcher} />
      <PreRolls
        cartItems={cartItems}
        dispatch={dispatch}
        preRolls={preRolls}
        right={true}
      />
    </div>
  );
}
