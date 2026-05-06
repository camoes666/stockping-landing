import { trackCtaClick } from "../../lib/analytics";

interface Props {
  href: string;
  label: string;
  page: string;
  section: string;
  variant?: "primary" | "secondary" | "lime" | "cyan" | "warm";
}

const variantClass: Record<string, string> = {
  // Sentry muted-purple primary — tactile inset shadow
  primary:
    "inline-flex items-center justify-center rounded-[13px] border border-[#584674] bg-[#79628c] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.2px] text-white transition shadow-[rgba(0,0,0,0.1)_0px_1px_3px_0px_inset] hover:shadow-[rgba(0,0,0,0.18)_0px_0.5rem_1.5rem]",
  // Lime green — high-visibility CTA
  lime:
    "inline-flex items-center justify-center rounded-[13px] bg-[#c2ef4e] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.2px] text-[#1f1633] transition hover:brightness-110 hover:shadow-[rgba(194,239,78,0.25)_0px_4px_20px]",
  // Glass-white secondary
  secondary:
    "inline-flex items-center justify-center rounded-xl border border-[#362d59] bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-[rgba(54,22,107,0.3)]",
  // Cyan (kept for radar page compat)
  cyan:
    "inline-flex items-center gap-2 rounded-[13px] bg-[#6a5fc1] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.2px] text-white transition hover:bg-[#5a4fb1] shadow-[rgba(0,0,0,0.1)_0px_1px_3px_0px_inset]",
  // Warm (legacy, kept for compat)
  warm:
    "inline-flex items-center gap-2 bg-warm-primary text-white rounded px-5 py-2.5 text-sm font-semibold hover:bg-warm-primary-dark transition",
};

export function TrackedCtaButton({
  href,
  label,
  page,
  section,
  variant = "primary",
}: Props) {
  const handleClick = () => {
    trackCtaClick("cta_click", page, `${section}:${label}`);
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={variantClass[variant]}
      onClick={handleClick}
    >
      {label}
    </a>
  );
}
