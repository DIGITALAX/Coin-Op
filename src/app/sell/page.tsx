import Wrapper from "../components/Common/modules/Wrapper";
import { Suspense } from "react";
import { getDictionary } from "../[lang]/dictionaries";
import { LOCALES } from "../lib/constants";
import { Metadata } from "next";
import SellEntry from "../components/Sell/modules/SellEntry";

export const metadata: Metadata = {
  title: "Sell",
  alternates: {
    canonical: `https://coinop.themanufactory.xyz/sell/`,
    languages: LOCALES.reduce((acc, item) => {
      acc[item] = `https://coinop.themanufactory.xyz/${item}/sell/`;
      return acc;
    }, {} as { [key: string]: string }),
  },
};

export default async function Sell({
  searchParams,
}: {
  searchParams: Promise<{ sessionId?: string; data?: string }>;
}) {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  const resolvedSearchParams = await searchParams;
  
  return (
    <Wrapper
      dict={dict}
      page={
        <Suspense>
          <SellEntry searchParams={resolvedSearchParams} dict={dict} />
        </Suspense>
      }
    ></Wrapper>
  );
}
