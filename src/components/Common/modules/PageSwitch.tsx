import Format from "@/components/Walkthrough/Format/modules/Format";
import Purchase from "@/components/Walkthrough/Purchase/modules/Purchase";
import { FunctionComponent } from "react";
import { PageSwitchProps } from "../types/common.types";

const PageSwitch: FunctionComponent<PageSwitchProps> = ({
    pageSwitcher
}): JSX.Element => {

    switch (pageSwitcher) {

    case "purchase":
    return <Purchase />
    default:
        return <Format />
  }


}

export default PageSwitch;