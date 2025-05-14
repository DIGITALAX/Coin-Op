"use client";

import Head from "next/head";
import Link from "next/link";

export default function NotFoundEntry({ dict }: { dict: any }) {
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
          {dict?.[404]?.wrong}
        </Link>
      </div>
    </div>
  );
}
