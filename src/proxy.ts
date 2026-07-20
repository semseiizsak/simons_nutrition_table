import { NextRequest, NextResponse } from "next/server";
import { BRANDS } from "@/lib/brands";

const HOSTNAME_TO_BRAND: Record<string, string> = Object.fromEntries(
  Object.values(BRANDS).flatMap((b) => b.hostnames.map((h) => [h, b.slug]))
);
const DEFAULT_BRAND = "simons"; // fallback for localhost / unrecognized hosts

export function proxy(req: NextRequest) {
  const hostname = req.headers.get("host")?.split(":")[0] ?? "";
  const brand = HOSTNAME_TO_BRAND[hostname] ?? DEFAULT_BRAND;
  const { pathname } = req.nextUrl;

  const url = req.nextUrl.clone();
  if (pathname === "/") {
    url.pathname = `/${brand}`;
    return NextResponse.rewrite(url);
  }
  if (pathname === "/nutrition") {
    url.pathname = `/nutrition/${brand}`;
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/nutrition"],
};
