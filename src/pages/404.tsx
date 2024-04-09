import Head from "next/head";
import Link from "next/link";
import { FunctionComponent } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const Custom404: FunctionComponent = (): JSX.Element => {
  const { t } = useTranslation("404");
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-x-hidden">
      <Head>
        <title>Page Not Found</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="og:image"
          content="https://coinop.themanufactory.xyz/card.png/"
        />
      </Head>
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <Link
          href={"/"}
          className="relative w-fit h-fit flex items-center justify-center font-mana text-white"
        >
          {t("wrong")}
        </Link>
      </div>
    </div>
  );
};

export default Custom404;

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["404", "footer"])),
  },
});
