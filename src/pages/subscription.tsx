import { NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Head from "next/head";
import { setPreRollAnim } from "../../redux/reducers/preRollAnimSlice";
import { useEffect } from "react";
import ActivateSub from "@/components/Subscription/modules/ActivateSub";

const Subscription: NextPage = (): JSX.Element => {
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
        <meta name="og:title" content="Coin Op | Subscription" />
        <meta
          name="og:description"
          content="We know it's a lot to keep up with. How can you know if this is
            the blend of instant convenience and purchasing power you've
            been waiting for?"
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
        <div className="relative w-3/4 h-fit flex items-center justify-center font-vcr text-white text-center text-lg">
          Subscribe to the learn it or lose it traning path. Complete the quests
          in this module before the credits you could have unlocked are gifted
          to creators who already get it.
        </div>
        <div className="relative w-fit h-fit items-center justify-center text-white font-sat text-2xl">
          $25 MONTHLY SUBSCRIPTION
        </div>
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative w-fit h-fit flex items-center justify-center font-vcr text-white text-center text-lg text-white gap-3">
            What&apos;s included?
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center font-vcr text-white text-center text-lg text-white">
            item one, item two, item three
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center font-vcr text-white text-center text-lg text-white">
            cancel anytime
          </div>
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

export default Subscription;
