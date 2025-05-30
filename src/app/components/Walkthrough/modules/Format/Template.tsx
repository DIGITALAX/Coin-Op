import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { SynthContext } from "@/app/providers";
import { TemplateProps } from "../../types/walkthrough.types";

const Template: FunctionComponent<TemplateProps> = ({
  template,
  chosenTemplate,
  locked,
  dict,
}): JSX.Element => {
  const synthContext = useContext(SynthContext);

  return (
    <div
      className={`relative h-full flex rounded-md bg-cross ${
        locked ? "md:w-full w-20" : "md:w-full w-40"
      } ${
        chosenTemplate === template
          ? "border-2 border-white opacity-60"
          : "border-ama border"
      } ${!locked && "cursor-pointer hover:opacity-80"}`}
      onClick={() => {
        !locked &&
          synthContext?.setCurrent((prev) => ({
            ...prev,
            template,
          }));
      }}
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
        {locked ? (
          <div className="absolute flex w-full h-full items-center justify-center rounded-md bg-black/40">
            <div className="relative flex items-center justify-center w-8 h-8 bg-black p-2 rounded-md border border-ama">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmY1iNCfGJavNt4cP4iKySrXKhsUDtHB3iZWUyQUgHobPd`}
                  layout="fill"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute flex w-full h-full items-center justify-center rounded-md">
            <div className="relative flex w-4/5 md:w-3/5 h-fit bg-black p-2 rounded-md border border-ama text-white font-mana text-xs flex-col break-all">
              <div className="relative w-fit h-fit flex items-start justify-center text-left break-all">
                {template?.type === "hoodie" || template?.type === "shirt"
                  ? dict?.Common?.streatwear
                  : dict?.Common?.art}
              </div>
              <div className="relative w-full h-fit flex items-center justify-end text-right break-all">
                <div className="relative w-fit h-fit flex">
                  {"> " + dict?.Common?.[template?.type!]}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Template;
