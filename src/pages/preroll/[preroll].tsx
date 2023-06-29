import { NextPage } from "next";
import Head from "next/head";
const PreRoll: NextPage = (): JSX.Element => {
  return (
    <div
      className="relative w-full flex flex-col bg-black items-center justify-start h-full gap-6 z-0"
      id="calc"
    >
      <Head>
        <title>CoinOp | PreRoll</title>
      </Head>
    </div>
  );
};

export default PreRoll;
