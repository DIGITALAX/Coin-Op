import AccountEntry from "@/app/components/Account/modules/AccountEntry";
import { getDictionary } from "../dictionaries";
import { tParams } from "../layout";
import { Metadata } from "next";
import { LOCALES } from "@/app/lib/constants";

export const metadata: Metadata = {
  title: "Account",
  alternates: {
    canonical: `https://coinop.themanufactory.xyz/account/`,
    languages: LOCALES.reduce((acc, item) => {
      acc[item] = `https://coinop.themanufactory/${item}/account/`;
      return acc;
    }, {} as { [key: string]: string }),
  },
};

export default async function Account({ params }: { params: tParams }) {
  const { lang } = await params;

  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <AccountEntry dict={dict} />;
}
