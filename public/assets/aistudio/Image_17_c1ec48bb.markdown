---
name: Nordic Kitchen Community
colors:
  surface: '#fff8f3'
  surface-dim: '#dfd9d4'
  surface-bright: '#fff8f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f2ed'
  surface-container: '#f3ede7'
  surface-container-high: '#ede7e2'
  surface-container-highest: '#e7e1dc'
  on-surface: '#1d1b18'
  on-surface-variant: '#59413c'
  inverse-surface: '#32302d'
  inverse-on-surface: '#f6f0ea'
  outline: '#8c716a'
  outline-variant: '#e0bfb7'
  surface-tint: '#ab3516'
  primary: '#a83213'
  on-primary: '#ffffff'
  primary-container: '#ca4a2a'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4a2'
  secondary: '#566248'
  on-secondary: '#ffffff'
  secondary-container: '#d6e5c4'
  on-secondary-container: '#5a674c'
  tertiary: '#5e5c56'
  on-tertiary: '#ffffff'
  tertiary-container: '#77746f'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad2'
  primary-fixed-dim: '#ffb4a2'
  on-primary-fixed: '#3c0700'
  on-primary-fixed-variant: '#891d00'
  secondary-fixed: '#d9e7c6'
  secondary-fixed-dim: '#bdcbac'
  on-secondary-fixed: '#141f0a'
  on-secondary-fixed-variant: '#3e4b32'
  tertiary-fixed: '#e7e2db'
  tertiary-fixed-dim: '#cac6bf'
  on-tertiary-fixed: '#1d1b17'
  on-tertiary-fixed-variant: '#494742'
  background: '#fff8f3'
  on-background: '#1d1b18'
  surface-variant: '#e7e1dc'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  gutter-lg: 1.5rem
  margin: 1.25rem
  margin-sm: 1rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system expresses a refined Scandinavian culinary sensibility: calm, intentional, and grounded in natural warmth. The visual world sits at the intersection of quiet editorial print magazines (such as *Kinfolk* or *Cereal*) and modern, tactile product design. 

The aesthetic is functional minimalism paired with organic hospitality. It avoids the clinical sterility of pure tech interfaces through textured linen tones, hand-crafted culinary hues, and literary serif display type. The interface must evoke slow mornings, tactile kitchen rituals, focused cooking modes, and unhurried community discovery. 

Key attributes:
- **Quiet Clarity:** Content and imagery take precedence; UI furniture recedes into gentle stone boundaries and warm linen canvases.
- **Warm Editorial Polish:** High typographic contrast between literary serif headlines and precise, functional geometric sans body copy.
- **Tactile Comfort:** Soft, organic curvatures (16px–24px corners) and understated ambient drop shadows emulate matte cardstock resting on stone countertops.

## Colors

The palette balances warm earthen light foundations with rich charcoal contrast and targeted culinary accents.

- **Primary (`#E05A38` - Persimmon / Terracotta):** Reserved for primary interactive triggers, active state indicators, key CTAs, and live step milestones. Used sparingly to preserve visual impact.
- **Secondary (`#657257` - Sage Olive):** Serves dietary tags, recipe difficulty meters, fresh ingredient highlights, and secondary confirmation states. Evokes botanical freshness and pantry staples.
- **Neutral Core (`#1C1A17` - Deep Culinary Charcoal):** Ensures AAA accessibility for editorial headings and primary readable body text over light backgrounds. A lighter tint (`#2D2A26`) is used for secondary descriptive metadata.
- **Tertiary & Structural (`#EBE6DF` - Warm Stone):** Defines delicate 1px structural dividing lines, unselected state pills, and quiet card outlines.
- **Surfaces & Canvases:**
  - Canvas Base: `#FAF8F5` (Soft Bleached Linen)
  - Surface Container / Elevated Cards: `#FFFFFF`
  - Subtle Recessed Inset / Input Well: `#F5F2EB` (Warm Stone Tint)

## Typography

Typography establishes an intentional dichotomy between narrative culinary storytelling and rapid functional utility:

- **Editorial Headings (Playfair Display):** Imparts warmth, craft, and authorial voice to recipe names, creator profiles, and thematic collections. It draws the eye into the sensory experience of cooking.
- **Interface & Operational Details (Plus Jakarta Sans):** Delivers clean legibility for dense ingredient checklists, nutritional tables, cook timers, and metric indicators. Its rounded geometry complements the organic design shapes without distracting during active cooking.
- **Numbers & Timers:** When rendering numeric quantities, times, and step counters, use tabular lining figures in `Plus Jakarta Sans` with `fontWeight: 600` or `700` to prevent visual jitter.

## Layout & Spacing

The layout is built on a mobile-first fluid column structure that prioritizes generous margins and breathing room:

- **Grid Model:** 4-column fluid layout on mobile viewports (breakpoint `< 640px`) with `1.25rem` screen margins and `1rem` gutters. On tablet and desktop displays, expand to 8 and 12 columns with a maximum content container of `1120px` to maintain focused reading length.
- **Rhythm & Whitespace:** Generous vertical rhythm separates visual modules. Recipe steps, community tips, and ingredient blocks require ample vertical clearance (`space-xl`) to remain scannable when a phone rests on a countertop.
- **Aspect Ratios:** Recipe photography utilizes a soft `4:5` portrait or `16:10` landscape ratio with rounded bounds to reinforce the cookbook feeling.

## Elevation & Depth

Visual hierarchy relies on quiet tonal layering and soft, diffused ambient lighting rather than stark elevation planes:

- **Base Layer:** `#FAF8F5` serves as the canvas.
- **Card Surfaces:** `#FFFFFF` rests above the canvas, bounded by a delicate 1px solid stroke in `#EBE6DF`.
- **Ambient Shadow (Resting Cards & Sheets):** Cards feature an ultra-soft, warm-tinted shadow: `0 4px 20px -2px rgba(28, 26, 23, 0.04)`.
- **Floating / Sticky Elements (Floating Cook Bar, Action Buttons):** Elevated components use a wider ambient diffusion: `0 12px 32px -4px rgba(28, 26, 23, 0.08)` paired with the `#EBE6DF` border.
- **Glass Accents:** Sticky headers and step counters employ subtle background blur (`backdrop-filter: blur(12px)`) with `rgba(250, 248, 245, 0.85)` fill, anchoring context while scrolling without blocking imagery.

## Shapes

The shape system embraces natural, organic curves reminiscent of Scandinavian pottery and kitchen tools:

- **Cards & Visual Containers:** Standard border radius is `1.25rem` (20px), softening imagery and separating cards cleanly from background linen tones.
- **Buttons & Interactive Badges:** Primary and secondary buttons use full pill rounding (`9999px`) or `0.75rem` (12px) for structured controls.
- **Pills & Status Tags:** Fully rounded pill shapes (`9999px`) create distinct, touchable tactile chips.
- **Input Fields:** Styled with `0.75rem` (12px) radius to maintain structured containment while staying consistent with interactive badges.

## Components

### Buttons
- **Primary:** Terracotta background (`#E05A38`), crisp white text (`#FFFFFF`), `Plus Jakarta Sans` semi-bold (`label-lg`), pill shape (`rounded-full`), padded `0.875rem 1.75rem`. Hover/press states darken slightly to `#C84E2E`.
- **Secondary:** Stone fill (`#F5F2EB`), charcoal text (`#1C1A17`), subtle 1px border (`#EBE6DF`).
- **Ghost:** Transparent background with `#1C1A17` text and subtle underline or arrow icon for inline actions.

### Chips & Badges
- **Dietary & Category Badges:** Pill-shaped (`rounded-full`), padded `0.375rem 0.875rem`. Background `#F5F2EB`, text `#2D2A26` at `label-md`.
- **Active / Filtered Chips:** Background `#657257` with white text (`#FFFFFF`) or `#E05A38` for primary filtering.
- **Cook Time & Metadata Chips:** Transparent background with 1px `#EBE6DF` outline, pairing mini line-icons with charcoal typography.

### Recipe Cards
- **Structure:** Surface white (`#FFFFFF`), 20px corner radius, 1px `#EBE6DF` border, resting ambient shadow.
- **Header Image:** Flush with card top, clipped to match the top 20px radii. Aspect ratio `16:10`.
- **Content:** Title in `headline-sm` (`Playfair Display`), metadata row (prep time, difficulty, rating) in `body-sm` (`Plus Jakarta Sans`), author avatar and name anchored at bottom.

### Lists & Ingredient Checklists
- **Ingredients:** Clear horizontal rows with 1px `#EBE6DF` bottom border divider. Left-aligned ingredient name in charcoal body text, right-aligned metric quantities in semi-bold sans-serif.
- **Checkboxes:** Circular (20px diameter) with 1.5px `#EBE6DF` border. Checked state transitions to `#657257` solid fill with a crisp white checkmark icon.

### Input Fields & Search
- **Container:** Height 48px, background `#F5F2EB`, border 1px solid `#EBE6DF`, 12px corner radius.
- **Typography:** Placeholder text in `#8C867E`, entered text in `#1C1A17` (`body-md`).
- **Focus State:** 1.5px solid border in `#E05A38` with no harsh outer glow ring.

### Dedicated Culinary Components
- **Floating Step-by-Step Cook Bar:** Affixed to bottom viewport on recipe views. Surface background `rgba(255, 255, 255, 0.95)` with backdrop blur, rounded-24px floating pill card with integrated elapsed timer, next-step trigger (`#E05A38`), and ingredient toggle.
- **Step Instruction Card:** Numbered index marker rendered in bold serif (`Playfair Display`, `#657257`), paired with generous line-height body text and thumbnail visual references.