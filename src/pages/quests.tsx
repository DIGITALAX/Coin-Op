import { NextPage } from "next";
import Head from "next/head";

const Quests: NextPage = (): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col gap-5">
      <Head>
        <title>Coin Op | Quests</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
};

export default Quests;
