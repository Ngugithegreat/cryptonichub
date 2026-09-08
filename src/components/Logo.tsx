export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  // Cryptonichub mark: a faceted hexagon (blockchain/crypto facet) in a
  // gold gradient on an obsidian tile, with a genesis-node diamond at its
  // core — a distinct geometric mark, same premium weight.
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="32" height="32" rx="9" fill="url(#chbg)" />
      <rect width="32" height="32" rx="9" fill="url(#chgloss)" fillOpacity="0.25" />
      {/* faceted hexagon outline */}
      <path
        d="M24.5 16.5 20.3 23.9 11.8 23.9 7.5 16.5 11.8 9.1 20.3 9.1Z"
        stroke="url(#chg)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* internal facet lines */}
      <path
        d="M16 5.5 16 26.5M7.5 16.5 24.5 16.5"
        stroke="url(#chg)"
        strokeOpacity="0.28"
        strokeWidth="1"
      />
      {/* genesis-node diamond at the core */}
      <path
        d="M16 12 19 16 16 20 13 16Z"
        fill="url(#chg)"
      />
      <defs>
        <linearGradient id="chbg" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#1c1a15" />
          <stop offset="1" stopColor="#0a0a0c" />
        </linearGradient>
        <linearGradient id="chgloss" x1="16" y1="0" x2="16" y2="32">
          <stop stopColor="#fff" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="chg" x1="7.5" y1="9.1" x2="24.5" y2="23.9">
          <stop stopColor="#F1D28C" />
          <stop offset="1" stopColor="#C99A3F" />
        </linearGradient>
      </defs>
    </svg>
  );
}
