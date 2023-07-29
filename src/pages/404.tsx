import Head from "next/head";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";

const Custom404: FunctionComponent = (): JSX.Element => {
  const router = useRouter();
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-x-hidden">
      <Head>
        <title>Page Not Found</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative w-full h-full flex flex-col items-center justify-center">

      </div>
    </div>
  );
};

export default Custom404;
