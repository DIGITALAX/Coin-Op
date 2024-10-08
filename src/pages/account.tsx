import { NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import Head from "next/head";
import AllOrders from "@/components/Account/modals/AllOrders";
import useOrders from "@/components/Account/hooks/useOrders";
import { setPrerollAnim } from "../../redux/reducers/prerollAnimSlice";
import { useEffect } from "react";
import { setCartAddAnim } from "../../redux/reducers/cartAddAnimSlice";
import { useAccount } from "wagmi";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { NextRouter } from "next/router";
import { useTranslation, withTranslation } from "next-i18next";
const Account: NextPage<{ client: LitNodeClient; router: NextRouter }> = ({
  client,
  router,
}): JSX.Element => {
  const { t } = useTranslation("account");
  const { address } = useAccount();
  const { openChainModal } = useChainModal();
  const { openConnectModal } = useConnectModal();
  const dispatch = useDispatch();
  const allOrders = useSelector(
    (state: RootState) => state.app.allOrdersReducer.value
  );
  const prerollAnim = useSelector(
    (state: RootState) => state.app.prerollAnimReducer.value
  );
  const connected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const cartAddAnim = useSelector(
    (state: RootState) => state.app.cartAddAnimReducer.value
  );
  const chain = useSelector((state: RootState) => state.app.chainReducer.value);
  const {
    ordersLoading,
    handleDecryptFulfillment,
    decryptLoading,
    orderOpen,
    setOrderOpen,
  } = useOrders(client, address, dispatch, allOrders);

  useEffect(() => {
    if (prerollAnim) {
      setTimeout(() => {
        dispatch(setPrerollAnim(false));
      }, 3000);
    }
  }, [prerollAnim]);
  useEffect(() => {
    if (cartAddAnim) {
      setTimeout(() => {
        dispatch(setCartAddAnim(""));
      }, 3000);
    }
  }, [cartAddAnim]);

  return (
    <div className="relative w-full h-full flex flex-col gap-5">
      <Head>
        <title>Coin Op | Account</title>
        <meta name="og:url" content="https://coinop.themanufactory.xyz/" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="og:title" content="Coin Op | Account" />
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
      <AllOrders
        openConnectModal={openConnectModal}
        router={router}
        t={t}
        client={client}
        connected={connected}
        ordersLoading={ordersLoading}
        allOrders={allOrders}
        handleDecryptFulfillment={handleDecryptFulfillment}
        decryptLoading={decryptLoading}
        orderOpen={orderOpen}
        setOrderOpen={setOrderOpen}
        dispatch={dispatch}
        openChainModal={openChainModal}
        chain={chain}
      />
    </div>
  );
};

export default withTranslation()(Account);

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["account", "footer", "common"])),
  },
});
