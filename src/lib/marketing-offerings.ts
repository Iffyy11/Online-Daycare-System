/**
 * Parent portal “What we offer” cards only (not shown on the public homepage — that page uses priced
 * program tiles instead). Images use the same CDN host as program cards so they load reliably.
 */
export type MarketingOffering = {
  title: string;
  desc: string;
  img: string;
  /** Shown as “From KES … / unit” when set */
  priceFromKes?: number;
  priceUnitLabel?: string;
  /** When no numeric anchor (e.g. included messaging) */
  priceNote?: string;
};

export const MARKETING_OFFERINGS: MarketingOffering[] = [
  {
    title: "Play & learning",
    desc: "Age-based rooms, circle time, and creative activities.",
    img: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=480&q=80",
    priceFromKes: 9800,
    priceUnitLabel: "typical day",
  },
  {
    title: "Safe & nurturing",
    desc: "Trained caregivers and clear allergy handling on your profile.",
    img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=480&q=80",
    priceFromKes: 10500,
    priceUnitLabel: "typical day (infant & toddler)",
  },
  {
    title: "Stay in the loop",
    desc: "Progress updates and direct messages — only for your family.",
    img: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=480&q=80",
    priceNote: "Included with enrollment",
  },
];
