import { JSX } from "react";
import FooterEntry from "./FooterEntry";
import HeaderEntry from "./HeaderEntry";
import PrerollsEntry from "../../Prerolls/modules/PrerollsEntry";
import ModalsEntry from "../../Modals/modules/ModalsEntry";

export default function Wrapper({
  dict,
  page,
}: {
  dict: any;
  page: JSX.Element;
}) {
  return (
    <div className="relative overflow-x-hidden w-full h-fit flex flex-col selection:bg-oscurazul selection:text-white gap-5 items-center justify-start">
      <HeaderEntry dict={dict} />
      <div className="relative overflow-hidden w-full h-fit xl:h-[60rem] flex flex-col xl:flex-row px-2 preG:px-6 gap-10 xl:items-start xl:justify-between items-center justify-start">
        <PrerollsEntry left={true} dict={dict} />
        {page}
        <PrerollsEntry right={true} dict={dict} />
      </div>
      <FooterEntry dict={dict} />
      <ModalsEntry dict={dict} />
    </div>
  );
}
