interface Props {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "cyan";
}

export const ctaStyles = {
  primary:
    "inline-flex items-center justify-center rounded-md bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700",
  secondary:
    "inline-flex items-center justify-center rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50",
  cyan:
    "inline-flex items-center justify-center rounded-md bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700",
};

export function CtaButton({ href, label, variant = "primary" }: Props) {
  return (
    <a href={href} className={ctaStyles[variant]} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}
