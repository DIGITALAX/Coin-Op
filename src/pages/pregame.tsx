import { NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Head from "next/head";
import { setPreRollAnim } from "../../redux/reducers/preRollAnimSlice";
import { useEffect } from "react";
import ActivateSub from "@/components/Subscription/modules/ActivateSub";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../lib/constants";

const Pregame: NextPage = (): JSX.Element => {
  const preRollAnim = useSelector(
    (state: RootState) => state.app.preRollAnimReducer.value
  );
  const subscriptionInfo = useSelector(
    (state: RootState) => state.app.subscriptionInfoReducer
  );
  const connectedPKP = useSelector(
    (state: RootState) => state.app.currentPKPReducer.value
  );

  const dispatch = useDispatch();
  useEffect(() => {
    if (preRollAnim) {
      setTimeout(() => {
        dispatch(setPreRollAnim(false));
      }, 3000);
    }
  }, [preRollAnim]);
  return (
    <div className="relative w-full h-full flex flex-col gap-5">
      <Head>
        <title>Coin Op | Subscription</title>
        <meta name="og:url" content="https://coinop.themanufactory.xyz/" />
        <meta name="og:title" content="Coin Op | Pregame" />
        <meta
          name="og:description"
          content="We know it's a lot to keep up with. How can you know if this is the blend of instant convenience and purchasing power you've been waiting for?"
        />
        <meta
          name="og:image"
          content="https://coinop.themanufactory.xyz/card.png/"
        />
        <meta name="twitter:card" content="summary" />
        <meta name="og:url" content="https://coinop.themanufactory.xyz/" />
        <meta
          name="og:image"
          content="https://coinop.themanufactory.xyz/card.png/"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@digitalax_" />
        <meta name="twitter:creator" content="@digitalax_" />
        <meta
          name="twitter:image"
          content="https://coinop.themanufactory.xyz/card.png/"
        />
        <meta name="twitter:url" content="https://coinop.themanufactory.xyz/" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="canonical" href="https://coinop.themanufactory.xyz/" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/MegamaxJones.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/fonts/Vcr.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/fonts/MonumentExtendedR.otf"
          as="font"
          crossOrigin="anonymous"
          type="font/otf"
        />
        <link
          rel="preload"
          href="/fonts/AquaticoRegular.otf"
          as="font"
          crossOrigin="anonymous"
          type="font/otf"
        />
        <link
          rel="preload"
          href="/fonts/SatoshiRegular.otf"
          as="font"
          crossOrigin="anonymous"
          type="font/otf"
        />
        <link
          rel="preload"
          href="/fonts/SatoshiBlack.otf"
          as="font"
          crossOrigin="anonymous"
          type="font/otf"
        />
        <link
          rel="preload"
          href="/fonts/HermanoAltoStamp.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/fonts/Manaspace.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
      </Head>
      <div className="relative w-full h-fit flex items-center justify-center flex-col gap-5">
        <div className="relative w-4/5 h-fit flex items-center justify-center font-vcr text-white text-center text-2xl">
          Don&apos;t waste your money on subscriptions when you can pregame
          instead.
        </div>
        <div className="relative w-4/5 h-80 flex items-center justify-center rounded-md border border-white">
          <Image
            layout="fill"
            objectFit="cover"
            className="rounded-md"
            src={`${INFURA_GATEWAY}/ipfs/QmSeWaaiUkQqVdJunnMUw1dnXJFZRC2yh9GHrhzhBHRb8j`}
            draggable={false}
            objectPosition={"bottom"}
          />
        </div>
        <div className="relative w-4/5 h-fit flex items-center justify-center font-vcr text-white text-center text-base">
          Can&apos;t keep up with the culture, web3 and the language machines if
          you&apos;re not in the game. We don&apos;t want you to pay to play.
        </div>
        <div className="relative w-3/4 h-fit items-center justify-center text-white font-sat text-base text-center">
          Buy in starts at $25 per month. Renews automatically for 90 days, then
          re-up to pregame indefinitely. All creds are in your hands when you
          hit Level 1 and above, if you claim your quests each month.
          <br />
          <br />
          Step by step you too can skill up or lose your creds to frenemies and
          earlier arrivals.
          <br />
          <br />
          Had enough of the levels up? Cancel anytime.
        </div>
      </div>
      <ActivateSub
        dispatch={dispatch}
        subscriptionInfo={subscriptionInfo}
        connectedPKP={connectedPKP}
      />
    </div>
  );
};

export default Pregame;
