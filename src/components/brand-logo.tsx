/** Leaf + figure mark inspired by warm childcare branding (original artwork). */
export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="leafGrad" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="0.45" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <path
        d="M24 5C13 8 6 18 6 28c0 9 7 15 18 15 11 0 18-8 18-17 0-12-9-22-18-21z"
        fill="url(#leafGrad)"
      />
      <circle cx="24" cy="16" r="3.2" fill="white" opacity="0.95" />
      <path
        d="M24 20v9M19 26l5 5 5-5M19 32h10"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.95"
      />
    </svg>
  );
}
