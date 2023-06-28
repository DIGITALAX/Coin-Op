import { FunctionComponent } from "react";
import { TemplateProps } from "../types/format.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { setTemplate } from "../../../../../redux/reducers/templateSlice";

const Template: FunctionComponent<TemplateProps> = ({
  template,
  chosenTemplate,
  height,
  dispatch,
}): JSX.Element => {
  return (
    <div
      className={`relative w-full flex cursor-pointer hover:opacity-80 rounded-md ${
        chosenTemplate === template
          ? "border-2 border-white opacity-60"
          : "border-ama border"
      }`}
      style={{ height }}
      onClick={() => dispatch(setTemplate(template!))}
    >
      <div className="relative w-full h-full object-cover">
        <Image
          src={`${INFURA_GATEWAY}/ipfs/${template?.image}`}
          layout="fill"
          objectFit="cover"
          alt="template"
          draggable={false}
          className="rounded-md"
        />
      </div>
    </div>
  );
};

export default Template;
