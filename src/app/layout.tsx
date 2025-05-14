import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://coinop.themanufactory.xyz"),
  title: "Coinop",
  robots: {
    googleBot: {
      index: true,
      follow: true,
    },
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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
