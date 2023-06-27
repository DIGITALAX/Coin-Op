import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PageContainer from "../components/Common/modules/PageContainer";
import PreRolls from "../components/Common/modules/PreRolls";

export default function Home(): JSX.Element {
  const pageSwitcher = useSelector(
    (state: RootState) => state.app.pageReducer.value
  );
  const preRolls = useSelector((state: RootState) => state.app.preRollReducer);
  return (
    <div className="relative overflow-hidden w-full h-fit flex flex-row px-6 gap-10">
      <PreRolls preRoll={preRolls.left} />
      <PageContainer pageSwitcher={pageSwitcher} />
      <PreRolls preRoll={preRolls.right} />
    </div>
  );
}
