import { cn } from "@/lib/utils";

/**
 * Large, low-opacity version of the site's compass mark — used as a
 * decorative watermark behind hero/section content so the brand symbol
 * shows up beyond just the header logo, without competing with text.
 */
export default function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("pointer-events-none select-none", className)}
    >
      <circle cx="24" cy="24" r="22" fill="var(--primary)" opacity="0.12" />
      <circle cx="24" cy="24" r="18" stroke="var(--primary)" strokeWidth="1.2" fill="none" />
      <path d="M24 8 L24 40 M8 24 L40 24" stroke="var(--secondary)" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="24" cy="24" r="6" fill="var(--primary)" />
      <path d="M24 18 L26 22 L24 26 L22 22 Z" fill="var(--accent)" transform="translate(0, -2)" />
      <path d="M14 32 Q24 38 34 32" stroke="var(--secondary)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
