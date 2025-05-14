import { tParams } from "@/app/[lang]/layout";
import HeaderEntry from "./HeaderEntry";
import { getDictionary } from "../../../[lang]/dictionaries";

export default async function Header({ params }: { params: tParams }) {
  const { lang } = await params;

  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <HeaderEntry dict={dict} />;
}
