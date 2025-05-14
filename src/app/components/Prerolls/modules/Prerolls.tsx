import { tParams } from "@/app/[lang]/layout";
import PrerollsEntry from "./PrerollsEntry";
import { getDictionary } from "../../../[lang]/dictionaries";

export default async function Prerolls({
  params,
  left,
  right,
}: {
  params: tParams;
  left?: boolean;
  right?: boolean;
}) {
  const { lang } = await params;

  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <PrerollsEntry dict={dict} left={left} right={right} />;
}
