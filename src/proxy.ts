import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/i18n/config";

function preferredLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language");
  if (!header) return defaultLocale;

  for (const part of header.split(",")) {
    const base = part.split(";")[0].trim().toLowerCase().split("-")[0];
    const match = locales.find((locale) => locale === base);
    if (match) return match;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  request.nextUrl.pathname = `/${preferredLocale(request)}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
