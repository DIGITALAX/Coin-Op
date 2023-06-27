import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <meta name="og:url" content="https://coin.manufactory.xyz/" />
      <meta name="og:title" content="Coin Op" />
      <meta name="og:description" content="" />
      <meta name="og:image" content="https://coin.manufactory.xyz/card.png/" />
      <meta name="twitter:card" content="summary" />
      <meta name="og:url" content="https://coin.manufactory.xyz/" />
      <meta name="og:image" content="https://coin.manufactory.xyz/card.png/" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@digitalax_" />
      <meta name="twitter:creator" content="@digitalax_" />
      <meta
        name="twitter:image"
        content="https://coin.manufactory.xyz/card.png/"
      />
      <meta name="twitter:url" content="https://coin.manufactory.xyz/" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="canonical" href="https://coin.manufactory.xyz/" />
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
      <style
        dangerouslySetInnerHTML={{
          __html: `
              @font-face {
                font-family: "Megamax Jones";
                font-weight: 400;
                src: url("./fonts/MegamaxJones.ttf");
              }

              @font-face {
                font-family: "Monument Regular";
                src: url("./fonts/MonumentExtendedR.otf");
              }

              @font-face {
                font-family: "Aquatico Regular";
                src: url("./fonts/AquaticoRegular.otf");
              }
            `,
        }}
      ></style>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
