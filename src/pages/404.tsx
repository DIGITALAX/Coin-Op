import Head from "next/head";
import Link from "next/link";
import { FunctionComponent } from "react";

const Custom404: FunctionComponent = (): JSX.Element => {
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
          Wrong Way? Head home.
        </Link>
      </div>
    </div>
  );
};

export default Custom404;
