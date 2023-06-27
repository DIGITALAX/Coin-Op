import Format from "@/components/Walkthrough/Format/modules/Format";
import Purchase from "@/components/Walkthrough/Purchase/modules/Purchase";
import { FunctionComponent } from "react";
import { PageSwitchProps } from "../types/common.types";
import useTemplate from "@/components/Walkthrough/Format/hooks/useTemplate";

const PageSwitch: FunctionComponent<PageSwitchProps> = ({
  pageSwitcher,
}): JSX.Element => {
  const { setTemplate, template, templates } = useTemplate();
  switch (pageSwitcher) {
    case "purchase":
      return <Purchase />;
    default:
      return (
        <Format
          setTemplate={setTemplate}
          template={template}
          templates={templates}
        />
      );
  }
};

export default PageSwitch;
