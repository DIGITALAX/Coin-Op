import { FunctionComponent } from "react";
import TopBanner from "./TopBanner";
import Grid from "./Grid";
import { FormatProps } from "../types/format.types";

const Format: FunctionComponent<FormatProps> = ({
  setTemplate,
  templates,
  template,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col gap-5">
      <TopBanner />
      <Grid
        setTemplate={setTemplate}
        templates={templates}
        template={template}
      />
    </div>
  );
};

export default Format;
