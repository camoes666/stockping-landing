import { trackCtaClick } from "../../lib/analytics";

interface Props {
  href: string;
  label: string;
  page: string;
  section: string;
  variant?: "primary" | "secondary" | "warm" | "cyan";
}

const variantClass: Record<string, string> = {
  primary:
    "inline-flex items-center justify-center rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-bold text-slate-900 transition hover:bg-amber-300",
  secondary:
    "inline-flex items-center justify-center rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50",
  warm:
    "inline-flex items-center gap-2 bg-warm-primary text-white rounded px-5 py-2.5 text-sm font-semibold hover:bg-warm-primary-dark transition",
  cyan:
    "inline-flex items-center gap-2 bg-cyan-600 text-white rounded px-5 py-2.5 text-sm font-semibold hover:bg-cyan-700 transition",
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
