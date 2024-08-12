import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: "/((?!_next|img|locales|favicon|fonts|blocked).*)",
};

const BLOCKED_COUNTRIES = [
  "BY", // Belarus
  "CU", // Cuba
  "KP", // North Korea
  "IR", // Iran
  "LB", // Lebanon
  "RU", // Russia
  "SY", // Syria
];

const BLOCKED_REGIONS = [
  {
    country: "UA", // Ukraine
    regions: [
      "43", // Crimea
      "14", // Donetsk
      "09", // Luhansk
    ],
  },
];

export function middleware(req: NextRequest) {
  const country = req.geo?.country;
  const region = req.geo?.region;

  if (country && BLOCKED_COUNTRIES.includes(country)) {
    return NextResponse.redirect(new URL("/blocked", req.url));
  }

  if (
    country &&
    region &&
    BLOCKED_REGIONS.find((x) => x.country === country)?.regions.includes(region)
  ) {
    return NextResponse.redirect(new URL("/blocked", req.url));
  }

  return NextResponse.next();
}
