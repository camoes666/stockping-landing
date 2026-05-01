import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { CtaButton } from "./CtaButton";

describe("CtaButton", () => {
  it("renders the label text", () => {
    render(<CtaButton href="https://example.com" label="앱에서 자세히 보기" />);
    expect(screen.getByRole("link", { name: "앱에서 자세히 보기" })).toBeInTheDocument();
  });

  it("sets href, target, and rel correctly", () => {
    render(<CtaButton href="https://play.google.com/store" label="앱 받기" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://play.google.com/store");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
