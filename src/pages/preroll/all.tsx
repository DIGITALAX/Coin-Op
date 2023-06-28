import { NextPage } from "next";
import Head from "next/head";

const All: NextPage = (): JSX.Element => {
  return (
    <div
      className="relative w-full flex flex-col bg-black items-center justify-start h-full gap-6 z-0"
      id="calc"
    >
      <Head>
        <title>CoinOp | All</title>
        {/* <meta
          name="og:url"
          content={`https://chromadin.xyz/autograph/${
            autoDispatch.profile?.handle?.split(".lens")[0]
          }/collection/${autoDispatch.profile?.name
            ?.replaceAll(" ", "-")
            ?.toLowerCase()}`}
        />
        <meta
          name="og:title"
          content={autoDispatch.profile?.name?.toUpperCase()}
        />
        <meta
          name="og:description"
          content={autoDispatch.profile?.metadata?.content}
        />
        <meta
          name="og:image"
          content={
            !autoDispatch?.collections?.[0]?.uri?.image
              ? "https://chromadin.xyz/card.png/"
              : `https://chromadin.infura-ipfs.io/ipfs/${autoDispatch?.collections?.[0]?.uri?.image?.split(
                  "ipfs://"
                )}`
          }
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@digitalax" />
        <meta name="twitter:creator" content="@digitalax" />
        <meta
          name="twitter:image"
          content={`https://chromadin.xyz/autograph/${
            autoDispatch.profile?.handle?.split(".lens")[0]
          }/collection/${autoDispatch.profile?.name
            ?.replaceAll(" ", "-")
            ?.toLowerCase()}`}
        />
        <meta
          name="twitter:url"
          content={`https://chromadin.xyz/autograph/${
            autoDispatch.profile?.handle?.split(".lens")[0]
          }/collection/${autoDispatch.profile?.name
            ?.replaceAll(" ", "-")
            ?.toLowerCase()}`}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="canonical"
          href={
            !autoDispatch?.collections?.[0]?.uri?.image
              ? "https://chromadin.xyz/card.png/"
              : `https://chromadin.infura-ipfs.io/ipfs/${autoDispatch?.collections?.[0]?.uri?.image?.split(
                  "ipfs://"
                )}`
          }
        /> */}
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://chromadin.xyz/fonts/ArcadeClassic.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="https://chromadin.xyz/fonts/DSDigi.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="https://chromadin.xyz/fonts/EarlsRevenge.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="https://chromadin.xyz/fonts/Geometria.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="https://chromadin.xyz/fonts/ClashDisplay.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="https://chromadin.xyz/fonts/DosisRegular.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="https://chromadin.xyz/fonts/EconomicaBold.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="https://chromadin.xyz/fonts/EconomicaRegular.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="https://chromadin.xyz/fonts/Manaspc.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
      </Head>
    </div>
  );
};

export default All;
