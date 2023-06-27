import { FunctionComponent } from "react";
import PageSwitch from "./PageSwitch";
import { PageContainerProps } from "../types/common.types";

const PageContainer: FunctionComponent<PageContainerProps> = ({
  pageSwitcher,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex">
      <PageSwitch pageSwitcher={pageSwitcher} />
    </div>
  );
};

export default PageContainer;
