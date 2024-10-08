import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <meta name="og:url" content="https://coinop.themanufactory.xyz/" />
      <meta name="og:title" content="Coin Op" />
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
        href="/fonts/Bitblox.otf"
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
                font-family: "Vcr";
                src: url("./fonts/Vcr.ttf");
              }

              @font-face {
                font-family: "Aquatico Regular";
                src: url("./fonts/AquaticoRegular.otf");
              }

              @font-face {
                font-family: "Satoshi Regular";
                src: url("./fonts/SatoshiRegular.otf");
              }

              @font-face {
                font-family: "Satoshi Black";
                src: url("./fonts/SatoshiBlack.otf");
              }

              @font-face {
                font-family: "Hermano Alto Stamp";
                src: url("./fonts/HermanoAltoStamp.ttf");
              }

              @font-face {
                font-family: "Manaspace";
                src: url("./fonts/Manaspace.ttf");
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
