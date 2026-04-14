/** Public contact details for the marketing / reach-out sections */

export const SITE_CITY = "Nairobi";
export const SITE_COUNTRY = "Kenya";
export const SITE_LOCATION_SHORT = SITE_CITY;
export const SITE_LOCATION_FULL = `${SITE_CITY}, ${SITE_COUNTRY}`;

export const SITE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Nairobi%2C+Kenya";

/** Local format as provided */
export const SITE_PHONE_LOCAL = "0740331354";
export const SITE_PHONE_DISPLAY = "0740 331 354";
export const SITE_PHONE_E164 = "+254740331354";
export const SITE_PHONE_HREF = `tel:${SITE_PHONE_E164}`;

/**
 * Shown in the UI. Override with NEXT_PUBLIC_CONTACT_EMAIL in .env.local
 * (must be prefixed NEXT_PUBLIC_ to be available in client components).
 */
export const SITE_PUBLIC_EMAIL =
  typeof process.env.NEXT_PUBLIC_CONTACT_EMAIL === "string" &&
  process.env.NEXT_PUBLIC_CONTACT_EMAIL.trim() !== ""
    ? process.env.NEXT_PUBLIC_CONTACT_EMAIL.trim()
    : "ifraha461@gmail.com";

export const SITE_MAILTO_HREF = `mailto:${SITE_PUBLIC_EMAIL}?subject=${encodeURIComponent("Daycare inquiry")}`;

/** Override with NEXT_PUBLIC_SOCIAL_* in .env — defaults are generic; set URLs to your real profiles. */
export const SOCIAL_URLS = {
  instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM?.trim() || "https://www.instagram.com/",
  facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK?.trim() || "https://www.facebook.com/",
  tiktok: process.env.NEXT_PUBLIC_SOCIAL_TIKTOK?.trim() || "https://www.tiktok.com/",
  twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER?.trim() || "https://twitter.com/",
} as const;
