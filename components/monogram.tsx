export function Monogram({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" role="img" aria-label="Inove Boutique">
      <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M38 32v56M38 34c24-8 29 8 15 23 23-11 34 17 5 28-7 3-14 3-20 3M74 31c-5 20-9 42-10 57M73 32c9 4 12 15 5 24M64 65c10-7 21-7 25 2" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Arabesque({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 240 28" aria-hidden="true"><path d="M2 14h72c18 0 20-12 6-12-13 0-8 24 40 24s53-24 40-24c-14 0-12 12 6 12h72" fill="none" stroke="currentColor" strokeWidth="1.5" pathLength="1" /></svg>;
}
