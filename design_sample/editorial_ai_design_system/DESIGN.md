---
name: Editorial AI Design System
colors:
  surface: '#fff8f6'
  surface-dim: '#f2d4ca'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1ec'
  surface-container: '#ffe9e3'
  surface-container-high: '#ffe2d9'
  surface-container-highest: '#fadcd3'
  on-surface: '#281812'
  on-surface-variant: '#5c4037'
  inverse-surface: '#3e2c26'
  inverse-on-surface: '#ffede8'
  outline: '#907065'
  outline-variant: '#e5beb2'
  surface-tint: '#aa3700'
  primary: '#a63500'
  on-primary: '#ffffff'
  primary-container: '#d04500'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb59c'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e1'
  on-secondary-container: '#656464'
  tertiary: '#005da6'
  on-tertiary: '#ffffff'
  tertiary-container: '#0076d0'
  on-tertiary-container: '#fdfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcf'
  primary-fixed-dim: '#ffb59c'
  on-primary-fixed: '#380c00'
  on-primary-fixed-variant: '#822800'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#d3e3ff'
  tertiary-fixed-dim: '#a3c9ff'
  on-tertiary-fixed: '#001c39'
  on-tertiary-fixed-variant: '#004882'
  background: '#fff8f6'
  on-background: '#281812'
  surface-variant: '#fadcd3'
typography:
  display:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.05'
    letterSpacing: -0.04em
  h1:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  h2:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Manrope
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 24px
  margin: 32px
---

## Brand & Style

This design system is built on a foundation of "Industrial Sophistication." It balances the warmth of a traditional editorial publication with the clinical precision of a modern AI-first platform. The brand personality is authoritative yet accessible, positioning the interface as a premium tool for high-stakes communication.

The design style follows a **Modern-Minimalist** approach with a heavy emphasis on typography and grid alignment. It avoids unnecessary decoration, relying instead on structural integrity, subtle tonal layering, and high-impact "billboard" headlines to guide the user. The aesthetic is tactile and trustworthy, designed to feel like a high-end physical document translated into a digital workspace.

## Colors

The palette is anchored by a warm, organic canvas that reduces eye strain while maintaining a premium feel. 

- **Primary Brand (Fin Orange):** Used sparingly for high-intent actions, primary buttons, and critical AI-driven insights.
- **Surface (Warm Off-White):** The primary canvas color, providing a soft background that feels more editorial than pure white.
- **Stroke (Oat):** A muted, earthy neutral used for all structural borders and dividers to maintain a soft but clear hierarchy.
- **Text (Off-Black):** Deep, high-contrast ink for maximum legibility.
- **Muted Text:** A desaturated version of the oat tone for secondary information and labels.

## Typography

This design system utilizes **Manrope** for its geometric clarity and modern proportions. The typographic hierarchy is designed to feel "editorial"—meaning headlines are intentionally tight and oversized to command attention.

Headlines should utilize negative letter-spacing (tracking) and aggressive line-heights to create a compact, "billboard" effect. Body text remains open and legible, ensuring that long-form help articles and chat transcripts are easy to consume. Labels use all-caps and increased letter-spacing to provide a distinct visual departure from prose.

## Layout & Spacing

The design system employs a **Fixed Grid** philosophy for desktop layouts, ensuring content density remains consistent across different screen sizes. A 12-column grid is standard, with generous 24px gutters.

Spacing follows a 4px base unit to match the industrial precision of the component borders. Vertical rhythm is critical; use larger "XL" spacing between major content sections to maintain the airy, premium feel of a document. Components should utilize internal padding that prioritizes horizontal breathing room.

## Elevation & Depth

Depth is achieved through **Low-Contrast Outlines** and tonal stacking rather than heavy shadows. In this design system, the primary method of separation is the 1px oat-toned border (#dedbd6).

- **Level 0 (Canvas):** The base off-white surface.
- **Level 1 (Cards/Containers):** Pure white backgrounds with a 1px oat border. 
- **Level 2 (Overlays/Modals):** Pure white with a 1px oat border and a very soft, diffused ambient shadow (0px 10px 30px rgba(0,0,0,0.04)). 

This approach maintains a "flat" industrial aesthetic while subtly indicating hierarchy.

## Shapes

The shape language is defined by a **4px (0.25rem) radius**. This specific measurement provides an "industrial-sharp" look—it is softer than a hard 90-degree angle, suggesting user-friendliness, but precise enough to feel professional and structured. 

This 4px rule applies to buttons, input fields, and cards. Larger containers such as modals may scale to 8px, but never beyond, to ensure the design system maintains its disciplined, geometric character.

## Components

### Buttons
Primary buttons use the Fin Orange background with white text. They feature a 1px stroke of a slightly darker orange for depth. On hover, buttons must use a `scale(1.1)` transform to provide a dynamic, "popping" tactile response. Secondary buttons use a white background with an oat border and off-black text.

### Input Fields
Inputs are styled with a white background, 4px border-radius, and a 1px oat border. When focused, the border transitions to Fin Orange. Placeholder text should be set in the muted oat-tone.

### Chips & Badges
Chips are used for categorization. They feature a subtle oat background (#f2f0ed) and off-black text in the "label-caps" typographic style. They remain flat and do not scale on hover.

### Cards
Cards are the primary container for AI insights. They should be pure white (#ffffff) against the warm canvas, using the 4px border-radius and oat border. Content within cards should follow the tight headline hierarchy to maintain the editorial feel.

### Lists
Lists use 1px oat dividers. For interactive list items, a subtle background shift to the canvas color (#faf9f6) on hover is preferred over a shadow or scale effect to maintain the "flat document" aesthetic.