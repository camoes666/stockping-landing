---
name: Industrial Precision
colors:
  surface: '#f9f9f8'
  surface-dim: '#d9dad9'
  surface-bright: '#f9f9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f3'
  surface-container: '#edeeed'
  surface-container-high: '#e7e8e7'
  surface-container-highest: '#e1e3e2'
  on-surface: '#191c1c'
  on-surface-variant: '#45464d'
  inverse-surface: '#2e3131'
  inverse-on-surface: '#f0f1f0'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fd'
  on-secondary-container: '#57657b'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#00201d'
  on-tertiary-container: '#0c9488'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d5e3fd'
  secondary-fixed-dim: '#b9c7e0'
  on-secondary-fixed: '#0d1c2f'
  on-secondary-fixed-variant: '#3a485c'
  tertiary-fixed: '#89f5e7'
  tertiary-fixed-dim: '#6bd8cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#f9f9f8'
  on-background: '#191c1c'
  surface-variant: '#e1e3e2'
typography:
  display:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h1:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h2:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  h3:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
  tabular-nums:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 24px
  margin: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system is engineered for high-stakes financial environments where clarity, precision, and institutional trust are paramount. The aesthetic is **Modern Corporate** with an **Editorial** soul, blending the rigidity of a data terminal with the refined whitespace of a premium financial journal. 

The visual language communicates authority through a restrained color palette and sharp, industrial geometry. It avoids unnecessary decoration, opting instead for a "data-first" hierarchy that allows complex information to breathe. The emotional response is one of calm confidence—positioning the software as a sophisticated tool for professionals who value accuracy over artifice.

## Colors

The palette is anchored by **Navy (#0F172A)** and **Slate (#334155)**, providing a deep, professional foundation that ensures high contrast for typography. To avoid a sterile feel, the background uses a **Warm Off-White (#F8F9F8)**, which softens the digital experience and evokes the feel of high-quality printed bond paper.

Accents are strictly functional:
- **Teal (#0D9488)** is reserved for positive trends, success states, and primary growth indicators.
- **Cyan (#06B6D4)** acts as the interactive catalyst, used sparingly for primary call-to-actions to draw the eye without overwhelming the data.
- **Slate/Gray scales** are used for secondary information and structural borders to maintain a monochromatic, "ink-on-paper" hierarchy.

## Typography

The design system utilizes **Manrope** exclusively to maintain a cohesive, modern technical aesthetic. The typeface's semi-geometric structure bridges the gap between humanist readability and industrial precision.

Key typographic rules:
- **Headlines:** Use tighter tracking and heavier weights to anchor sections.
- **Data Display:** Numerical values must utilize the `tabular-nums` property to ensure columns of figures align perfectly in tables and dashboards.
- **Labels:** Small-caps are used for metadata and table headers to create a clear visual distinction from body content.
- **Hierarchy:** Use color (Slate vs. Navy) rather than just size to denote importance.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid Grid**. Content is housed within a maximum 1440px container to ensure readability on ultra-wide monitors, typical of financial workstations. A 12-column system is utilized with a generous 24px gutter to maintain the editorial feel.

The spacing scale is strictly based on a **4px baseline grid**. Horizontal margins are intentionally wide (32px+) to create a "gallery" effect for data visualizations, preventing the interface from feeling cluttered even when density is high.

## Elevation & Depth

In keeping with the "Industrial Precision" theme, this design system eschews heavy shadows in favor of **Tonal Layers** and **Crisp Outlines**. 

- **Surface Levels:** The base background is the warm off-white. Secondary containers (cards, sidebars) use pure white to "lift" them forward.
- **Borders:** Depth is primarily communicated through 1px solid borders in Slate-200. 
- **Shadows:** When necessary for modals or menus, use a "Hard Shadow"—a very low-blur, 10% opacity Navy shadow with a 2px or 4px offset. This mimics the appearance of stacked paper rather than floating elements.
- **Interactive Depth:** On hover, elements do not glow; they shift slightly in background tone or border weight.

## Shapes

The design system uses a **Sharp Geometry** to reinforce the feeling of a precision instrument. 

- **Standard Radius:** 4px (Soft) is the default for buttons, inputs, and small modules.
- **Container Radius:** 8px (Large) is reserved for primary dashboard cards and main content areas.
- **Interactive Elements:** No pill-shapes or circular buttons are permitted, except for standard radio buttons. 

This strict adherence to near-right angles ensures the UI feels architectural and structural rather than playful.

## Components

### Buttons & Actions
- **Primary:** Solid Cyan (#06B6D4) with white text. 4px radius. 
- **Secondary:** Transparent background with a 1px Navy border.
- **Ghost:** Slate text, no border, used for utility actions.

### Data Inputs
- **Fields:** Pure white background with a 1px Slate-200 border. Labels are always positioned above the field in `label-caps` style.
- **Focus State:** A 1px solid Navy border with a subtle 2px Slate outer glow. No roundedness change.

### Cards & Modules
- **Editorial Cards:** No shadow, 1px border, 8px radius. Header areas are separated by a subtle horizontal rule.
- **KPI Tiles:** Large `h1` or `display` typography for the metric, with a small Teal or Red sparkline to indicate directionality.

### Feedback & Indicators
- **Positive:** Soft Teal background with deep Teal text.
- **Critical:** Muted Red background with deep Burgundy text.
- **Data Viz:** Use the primary Navy and Slate for the majority of the chart, using Cyan and Teal only to highlight the "active" or "focal" data point.

### Financial Tables
- **Rows:** Alternate row stripping is not used; instead, use thin 1px horizontal dividers. 
- **Cells:** Right-align all numerical data and ensure the use of tabular-width numbers for vertical scanning.