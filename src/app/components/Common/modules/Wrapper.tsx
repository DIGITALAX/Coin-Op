import { JSX } from "react";
import FooterEntry from "./FooterEntry";
import HeaderEntry from "./HeaderEntry";
import PrerollsEntry from "../../Prerolls/modules/Prerolls";
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
      {page}
      <FooterEntry dict={dict} />
      <ModalsEntry dict={dict} />
    </div>
  );
}
