import { NextResponse } from "next/server";
import { INFURA_GATEWAY_INTERNAL } from "../lib/constants";
import { getAllPrerolls } from "../../../graphql/queries/getPrerolls";

const locales = ["en", "es"];

function escapeXml(unsafe: string) {
  if (!unsafe) return "";
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://coinop.themanufactory.xyz";
  const prerolls = await getAllPrerolls();

  const collections = prerolls?.data?.collectionCreateds || [];

  const collectionsXml = collections
    .map((coll: any) => {
      const rawTitle = coll?.metadata?.title ?? "";
      const image = coll?.metadata?.images?.[0]?.split("ipfs://")?.[1];

      return `
       <image:image>
          <image:loc>${INFURA_GATEWAY_INTERNAL}${image}/</image:loc>
          <image:title><![CDATA[${rawTitle.replace(
            /-/g,
            " "
          )} | CoinOp | DIGITALAX]]></image:title>
          <image:caption><![CDATA[${rawTitle.replace(
            /-/g,
            " "
          )} | CoinOp | DIGITALAX]]></image:caption>
        </image:image>
    `;
    })
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset 
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
      xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
      xmlns:xhtml="http://www.w3.org/1999/xhtml"
    >
      <url>
        <loc>${baseUrl}/</loc>
        ${locales
          .map(
            (locale) => `
          <link rel="alternate" hreflang="${locale}" href="${baseUrl}/${locale}/" ></link>
          `
          )
          .join("")}
        <link rel="alternate" hreflang="x-default" href="${baseUrl}/" ></link>
            ${collectionsXml}
      </url>
    </urlset>`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
