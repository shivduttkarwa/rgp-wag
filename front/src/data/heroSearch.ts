/**
 * heroSearch.ts
 * Single source of truth for the HeroSearchPanel —
 * suburb suggestions and filter option lists that mirror PropertiesPage exactly.
 */

/** Suburbs derived from listingProperties locations */
export const SUBURBS: string[] = [
  "Algester",
  "Caboolture",
  "Greenbank",
  "Heathwood",
  "Kingaroy",
  "Lilywood",
  "Narangba",
  "Park Ridge",
  "Ripley",
  "South Maclean",
  "South Ripley",
  "Springfield",
  "Yarrabilba",
];

export const PRICE_OPTIONS = [
  { value: "all",      label: "Any Price" },
  { value: "contact",  label: "Contact Agent" },
  { value: "under500", label: "Under $500k" },
  { value: "500-800",  label: "$500k – $800k" },
  { value: "800-1200", label: "$800k – $1.2M" },
  { value: "over1200", label: "Over $1.2M" },
] as const;

export const BEDS_OPTIONS = [
  { value: "any",  label: "Any Beds" },
  { value: "land", label: "Land / No Bedrooms" },
  { value: "3",    label: "3+ Beds" },
  { value: "4",    label: "4+ Beds" },
  { value: "5",    label: "5+ Beds" },
] as const;

export const BATHS_OPTIONS = [
  { value: "any", label: "Any Baths" },
  { value: "1",   label: "1+ Baths" },
  { value: "2",   label: "2+ Baths" },
  { value: "3",   label: "3+ Baths" },
] as const;
