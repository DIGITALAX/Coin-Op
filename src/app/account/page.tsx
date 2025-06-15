import Wrapper from "../components/Common/modules/Wrapper";
import { Suspense } from "react";
import { getDictionary } from "../[lang]/dictionaries";
import AccountEntry from "../components/Account/modules/AccountEntry";
import { LOCALES } from "../lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
  alternates: {
    canonical: `https://coinop.themanufactory.xyz/account/`,
    languages: LOCALES.reduce((acc, item) => {
      acc[item] = `https://coinop.themanufactory.xyz/${item}/account/`;
      return acc;
    }, {} as { [key: string]: string }),
  },
};

export default async function Account() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return (
    <Wrapper
      dict={dict}
      page={
        <Suspense>
          <AccountEntry dict={dict} />
        </Suspense>
      }
    ></Wrapper>
  );
}
