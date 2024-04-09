import { FunctionComponent } from "react";
import Grid from "./Grid";
import { FormatProps } from "../types/format.types";

const Format: FunctionComponent<FormatProps> = ({
  templates,
  template,
  dispatch,
  t,
  router
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col">
      <Grid
        dispatch={dispatch}
        templates={templates}
        template={template}
        t={t}
        router={router}
      />
    </div>
  );
};

export default Format;
