# Design System: Industrial Precision

## 1. Visual Theme & Atmosphere
The "Industrial Precision" theme is designed for a professional financial SaaS platform. It communicates trust, intelligence, and premium quality through a clean, data-driven aesthetic. The interface uses a palette of deep indigos and slate grays, moving away from cluttered news sites toward a sophisticated "terminal" feel.

The design emphasizes readability and clear hierarchy, with sharp geometry and purposeful use of color for status indicators and call-to-action elements.

**Key Characteristics:**
- Professional Blue & Indigo palette
- Clean, editorial typography with a focus on readability
- Minimalist card structures for data-heavy content
- Clear status categorization (Confirmed, Market View, Rumor)
- High-fidelity terminal-inspired components

## 2. Color Palette & Roles

### Primary & Brand
- **Primary Navy** (`#0F172A`): Core brand color, used for headers, primary buttons, and deep backgrounds.
- **Accent Cyan** (`#0891B2`): Primary action color and focus state.
- **Surface White** (`#FFFFFF`): Primary background color for cards and content areas.
- **Surface Slate** (`#F8FAFC`): Background color for sidebars and secondary sections.

### Status & Data
- **Confirmed Fact** (`#10B981` / Emerald): Represents verified data and positive trends.
- **Market View** (`#3B82F6` / Blue): Represents analyst observations and neutral data.
- **Rumor** (`#F59E0B` / Amber): Represents unverified information or high-volatility signals.
- **Critical Alert** (`#EF4444` / Red): Represents negative trends or urgent warnings.

### Neutral Scale
- **Text Primary** (`#0F172A`): Used for headlines and main body text.
- **Text Secondary** (`#64748B`): Used for descriptions and metadata.
- **Border Light** (`#E2E8F0`): Used for subtle component separation.
- **Border Dark** (`#334155`): Used for high-contrast separation.

## 3. Typography Rules

### Font Families
- **Primary**: `Manrope` (Geometric Sans-Serif)
- **Secondary**: `Inter` or `System Sans`

### Hierarchy
- **Display Headlines**: Manrope, Bold (700), Tracking -2%
- **Section Headers**: Manrope, Semi-Bold (600)
- **Body Text**: Manrope, Regular (400), Line-height 1.6
- **Metadata/Labels**: Manrope, Medium (500), Uppercase with wide tracking (0.05em)

## 4. Component Stylings

### Buttons
- **Primary**: Solid Navy (`#0F172A`) or Cyan (`#0891B2`), 4px border radius.
- **Secondary**: Outlined with Slate-200 border, 4px border radius.
- **Ghost**: Transparent background with Navy text.

### Cards & Containers
- **Content Cards**: White background, 1px Slate-200 border, subtle shadow on hover.
- **Data Cards**: Terminal-inspired with status badges and clean metric layouts.
- **Radius**: 4px for buttons, 8px for cards and containers.

### Status Badges
- Small, uppercase text with light background tints and solid text colors.
- Emerald-100/Emerald-700 (Confirmed)
- Blue-100/Blue-700 (Market View)
- Amber-100/Amber-700 (Rumor)

## 5. Layout Principles
- **Grid**: 12-column system for desktop.
- **Spacing**: 8px base unit (8, 16, 24, 32, 48, 64).
- **Article Width**: Optimized for reading (max-width 800px for text columns).
- **Sidebars**: 320px fixed width for secondary navigation and CTAs.
