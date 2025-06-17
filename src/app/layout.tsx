import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { LOCALES } from "./lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL("https://coinop.themanufactory.xyz/"),
  title: "Coinop",
  robots: {
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: `https://coinop.themanufactory.xyz/`,
    languages: LOCALES.reduce((acc, item) => {
      acc[item] = `https://coinop.themanufactory.xyz/${item}/`;
      return acc;
    }, {} as { [key: string]: string }),
  },
  description:
    "We know it's a lot to keep up with. How can you know if this is the blend of instant convenience and purchasing power you've been waiting for?",
  keywords:
    "Web3, Web3 Fashion, Moda Web3, Open Source, CC0, Emma-Jane MacKinnon-Lee, Open Source LLMs, DIGITALAX, F3Manifesto, www.digitalax.xyz, www.f3manifesto.xyz, Women, Life, Freedom.",
  twitter: {
    card: "summary_large_image",
    site: "@digitalax_",
    title: "Coinop",
    description:
      "We know it's a lot to keep up with. How can you know if this is the blend of instant convenience and purchasing power you've been waiting for?",
  },
  openGraph: {
    title: "Coinop",
    description:
      "We know it's a lot to keep up with. How can you know if this is the blend of instant convenience and purchasing power you've been waiting for?",
  },
  creator: "Emma-Jane MacKinnon-Lee",
  publisher: "Emma-Jane MacKinnon-Lee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Coin Op",
              url: "https://coinop.themanufactory.xyz/",
              founder: {
                "@type": "Person",
                name: "Emma-Jane MacKinnon-Lee",
                url: "https://emmajanemackinnonlee.com/",
                sameAs: [
                  "https://emmajanemackinnonlee.com/",
                  "https://syntheticfutures.xyz/",
                  "https://web3fashion.xyz/",
                  "https://emancipa.xyz/",
                  "https://highlangu.com/",
                  "https://digitalax.xyz/",
                  "https://cc0web3fashion.com/",
                  "https://cc0web3.com/",
                  "https://cuntism.net/",
                  "https://dhawu.com/",
                  "https://twitter.com/emmajane1313",
                  "https://medium.com/@casadeespejos",
                  "https://www.flickr.com/photos/emmajanemackinnonlee/",
                ],
              },
            }),
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
