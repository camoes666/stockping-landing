interface Props {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "lime" | "cyan";
}

export const ctaStyles = {
  primary:
    "inline-flex items-center justify-center rounded-[13px] border border-[#584674] bg-[#79628c] px-5 py-3 text-sm font-bold uppercase tracking-[0.2px] text-white transition shadow-[rgba(0,0,0,0.1)_0px_1px_3px_0px_inset] hover:shadow-[rgba(0,0,0,0.18)_0px_0.5rem_1.5rem]",
  lime:
    "inline-flex items-center justify-center rounded-[13px] bg-[#c2ef4e] px-5 py-3 text-sm font-bold uppercase tracking-[0.2px] text-[#1f1633] transition hover:brightness-110",
  secondary:
    "inline-flex items-center justify-center rounded-xl border border-[#362d59] bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-[rgba(54,22,107,0.3)]",
  cyan:
    "inline-flex items-center justify-center rounded-[13px] bg-[#6a5fc1] px-5 py-3 text-sm font-bold uppercase tracking-[0.2px] text-white transition hover:bg-[#5a4fb1]",
};

export function CtaButton({ href, label, variant = "primary" }: Props) {
  return (
    <a href={href} className={ctaStyles[variant]} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}
