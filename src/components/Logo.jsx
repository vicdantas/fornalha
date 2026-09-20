export function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="22" r="21" fill="#0D0D0D" stroke="#C9A227" strokeWidth="1.2"/>
      <circle cx="22" cy="22" r="17" fill="none" stroke="rgba(201,162,39,0.2)" strokeWidth="0.5"/>
      <text x="10" y="31" fontFamily="Cinzel,serif" fontSize="23" fontWeight="700" fill="#C9A227">F</text>
      <line x1="7" y1="21.5" x2="37" y2="21.5" stroke="#C9A227" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M34 18.5C36 19.5 37.5 20.5 37 21.5C37.5 22.5 36 23.5 34 24.5" stroke="#C9A227" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <rect x="7" y="19.5" width="8" height="4" rx="1.2" fill="#C9A227" opacity="0.65"/>
      <line x1="11" y1="19.5" x2="11" y2="23.5" stroke="rgba(201,162,39,0.4)" strokeWidth="0.8"/>
      <line x1="13" y1="19.5" x2="13" y2="23.5" stroke="rgba(201,162,39,0.4)" strokeWidth="0.8"/>
    </svg>
  )
}
