import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";

let locales = ["en", "es"];
let defaultLocale = "en";

function getLocale(request: NextRequest) {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  let headers = {
    "accept-language": request.headers.get("accept-language") || "en",
  };
  let languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale);
}

function isBot(userAgent: string) {
  return /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou/i.test(
    userAgent
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get("user-agent") || "";

  if (pathname.startsWith("/api")) {
    const origin = request.headers.get("origin");
    
    // Allow specific production origins and any localhost
    const allowedOrigins = [
      "https://thedial.infura-ipfs.io",
      "https://ik.imagekit.io", 
      "https://themanufactory.xyz",
      "https://coinop.themanufactory.xyz"
    ];
    
    // Check if origin is localhost with any port
    const isLocalhost = origin && /^http:\/\/localhost:\d+$/.test(origin);
    const isAllowed = origin && (allowedOrigins.includes(origin) || isLocalhost);
    
    const response = NextResponse.next();
    
    if (isAllowed) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }
    
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, X-Requested-With, Accept");
    response.headers.set("Access-Control-Max-Age", "86400");
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: response.headers });
    }
    
    return response;
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/videos") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/opengraph_image.png") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.startsWith("/BingSiteAuth.xml")
  ) {
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  if (isBot(userAgent)) {
    return NextResponse.next();
  }

  const locale = getLocale(request);

  if (locale === defaultLocale) {
    return NextResponse.next();
  }

  const response = NextResponse.redirect(
    new URL(`/${locale}${pathname}${request.nextUrl.search}`, request.url)
  );

  response.cookies.set("NEXT_LOCALE", locale, { path: "/", sameSite: "lax" });

  return response;
}

export const config = {
  matcher: [
    "/((?!_next|images|fonts|videos|favicon.ico|opengraph_image.png|api|sitemap|BingSiteAuth).*)",
  ],
};
