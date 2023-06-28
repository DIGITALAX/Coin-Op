import Format from "@/components/Walkthrough/Format/modules/Format";
import Purchase from "@/components/Walkthrough/Purchase/modules/Purchase";
import { FunctionComponent } from "react";
import { PageSwitchProps } from "../types/common.types";
import templates from "./../../../../public/items/templates.json";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

const PageSwitch: FunctionComponent<PageSwitchProps> = ({
  pageSwitcher,
}): JSX.Element => {
  const dispatch = useDispatch();
  const template = useSelector(
    (state: RootState) => state.app.templateReducer.value
  );
  switch (pageSwitcher) {
    case "purchase":
      return <Purchase />;
    default:
      return (
        <Format dispatch={dispatch} template={template} templates={templates} />
      );
  }
};

export default PageSwitch;
