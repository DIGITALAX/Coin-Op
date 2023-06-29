import { FunctionComponent } from "react";
import Grid from "./Grid";
import { FormatProps } from "../types/format.types";

const Format: FunctionComponent<FormatProps> = ({
  templates,
  template,
  dispatch,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col">
      <Grid dispatch={dispatch} templates={templates} template={template} />
    </div>
  );
};

export default Format;
