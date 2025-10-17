import { getDictionary } from "../dictionaries";
import { tParams } from "../layout";
import { Metadata } from "next";
import { LOCALES } from "@/app/lib/constants";
import SellEntry from "@/app/components/Sell/modules/SellEntry";

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
  params,
  searchParams,
}: {
  params: tParams;
  searchParams: Promise<{ sessionId?: string; data?: string }>;
}) {
  const { lang } = await params;
  const resolvedSearchParams = await searchParams;

  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <SellEntry dict={dict} searchParams={resolvedSearchParams} />;
}
