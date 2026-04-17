export type ProgramSection = { heading: string; body: string };

export type Program = {
  slug: string;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  sections: ProgramSection[];
  highlights: string[];
  /** Typical day or session anchor (KES), shown on cards and detail */
  priceFromKes: number;
  /** e.g. "typical day", "half-day session", "per camp week" */
  priceUnitLabel: string;
};

export const PROGRAMS: Program[] = [
  {
    slug: "full-day",
    title: "Full day care",
    summary: "Structured learning, meals, rest, and play from morning through late afternoon.",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=900&q=80",
    imageAlt: "Bright daycare classroom",
    highlights: ["Circle time & literacy", "Outdoor gross motor", "Family app updates"],
    priceFromKes: 9800,
    priceUnitLabel: "typical day",
    sections: [
      {
        heading: "Daily rhythm",
        body: "Children follow a predictable schedule that balances guided activities with child-led exploration. Teachers document standout moments so you never feel out of the loop.",
      },
      {
        heading: "Nutrition & rest",
        body: "We coordinate with families on allergies and preferences. Nap rooms are calm, supervised, and adjusted to each child’s sleep patterns where possible.",
      },
    ],
  },
  {
    slug: "half-day",
    title: "Half day programs",
    summary: "Ideal for younger children easing into group care or families who need a shorter window.",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=900&q=80",
    imageAlt: "Children at a snack table",
    highlights: ["Gentle transitions", "Smaller group sizes", "Pickup by midday"],
    priceFromKes: 5600,
    priceUnitLabel: "half-day session",
    sections: [
      {
        heading: "Who it suits",
        body: "Half day is popular for first-time enrollees and siblings on staggered schedules. We focus on social confidence and communication skills in a compact day.",
      },
      {
        heading: "Handover",
        body: "Each session ends with a quick verbal or written note so you know how hydration, meals, and mood went.",
      },
    ],
  },
  {
    slug: "after-school",
    title: "After school club",
    summary: "Homework help, snacks, and supervised play until parents finish work.",
    image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=900&q=80",
    imageAlt: "Children learning together",
    highlights: ["Quiet homework zone", "Active games", "Safe pickup protocols"],
    priceFromKes: 3200,
    priceUnitLabel: "after-school session",
    sections: [
      {
        heading: "School-age focus",
        body: "We partner with nearby schools on drop-off windows and keep a consistent routine: snack, study block, then movement or creative clubs.",
      },
      {
        heading: "Safety",
        body: "Only authorized adults may collect children. Changes to pickup are confirmed in writing through the parent portal.",
      },
    ],
  },
  {
    slug: "infant-care",
    title: "Infant & toddler care",
    summary: "Low ratios, sensory-rich environments, and caregivers trained in early milestones.",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=900&q=80",
    imageAlt: "Calm nursery space",
    highlights: ["Individual care plans", "Daily logs", "Tummy time & sensory play"],
    priceFromKes: 10500,
    priceUnitLabel: "typical day",
    sections: [
      {
        heading: "Responsive care",
        body: "Feeding and sleep follow each infant’s home rhythm as closely as possible. We use gentle cues and plenty of floor time for motor development.",
      },
      {
        heading: "Family partnership",
        body: "Parents receive concise daily summaries. We welcome questions anytime through the app or a scheduled call.",
      },
    ],
  },
  {
    slug: "preschool-prep",
    title: "Preschool readiness",
    summary: "Play-based pre-literacy, numeracy, and social skills for children approaching primary school.",
    image: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=900&q=80",
    imageAlt: "Preschool activities",
    highlights: ["Phonics games", "Fine motor stations", "Conflict resolution practice"],
    priceFromKes: 9200,
    priceUnitLabel: "typical day",
    sections: [
      {
        heading: "Learning through play",
        body: "We weave letters, numbers, and problem-solving into games and projects so children stay curious—not stressed.",
      },
      {
        heading: "School visits",
        body: "Optional orientation visits with local schools help families feel prepared for the next big step.",
      },
    ],
  },
  {
    slug: "summer-camp",
    title: "Holiday & summer camps",
    summary: "Themed weeks with field trips, water play, and guest workshops during school breaks.",
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=900&q=80",
    imageAlt: "Outdoor summer play",
    highlights: ["Weekly themes", "Outdoor adventure", "Flexible weekly booking"],
    priceFromKes: 18500,
    priceUnitLabel: "per themed week",
    sections: [
      {
        heading: "What to expect",
        body: "Camp days are energetic by design: team games, art bursts, and plenty of sunshine with shade and hydration breaks.",
      },
      {
        heading: "Enrollment",
        body: "Spaces are limited. Book through the parent portal or contact us for sibling discounts and early-bird dates.",
      },
    ],
  },
];

export function getProgramBySlug(slug: string): Program | undefined {
  return PROGRAMS.find((p) => p.slug === slug);
}
