# MedEase Frontend — UI/UX Style Guide

Use this guide when building new pages or components so the app stays visually and behaviorally consistent.

---

## 1. Color Palette

### Primary (Brand & text)
| Token | Hex | Usage |
|-------|-----|--------|
| **Primary / text main** | `#2C2420` | Headings, primary text, dark CTAs, focus borders |
| **Text secondary** | `#594D46` | Body copy, captions |
| **Text muted** | `#8B7B72` | Labels, placeholders |
| **Accent** | `#A65D37` | Links, highlighted words, validation/warning accents |

### Functional (app / product UI)
| Token | Hex | Usage |
|-------|-----|--------|
| **Primary green** | `#00684A` | Nav active, primary buttons, links, borders in app |
| **Green dark** | `#004D40`, `#005C3A`, `#027555`, `#00897B` | Hover states, teal accents, chat/headers |
| **Green hover bg** | `#E6F4F1`, `#e0f2f1` | Button/list hover backgrounds |

### Surfaces & backgrounds
| Token | Value | Usage |
|-------|--------|--------|
| **Bone / warm bg** | `rgb(247, 242, 237)` | Page background (e.g. InteractiveBackground) |
| **Nav/card glass** | `rgba(247, 242, 237, 0.7)` + `backdropFilter: blur(12px)` | AppBar, overlays |
| **Card bg** | `rgba(247, 242, 237, 0.88)` | Auth/form cards with blur |
| **Panel gradient** | `linear-gradient(to right, #f9f9f9, #eef2f3)` | Content panels, Paper cards |
| **Info panel** | `#E0F2F1` | Accordions, info sections |
| **Banner gradient** | `linear-gradient(to right, #f0fdf4, #e8f5e9)` | Dashboard banners |

### Borders & dividers
| Token | Value |
|-------|--------|
| **Default border** | `#E6DCCA`, `#ccc`, `1px solid` |
| **Focus border** | `#2C2420`, `1.5px` |
| **Subtle** | `rgba(44, 36, 32, 0.05)` – `0.1` |

### Semantic
| Purpose | Value |
|---------|--------|
| **Disclaimer / warning** | BG `#FFF3CD`, text `#D39E00` |
| **Success / valid** | `#2C2420` or green tones |
| **Error / invalid** | `#A65D37` or MUI `color="error"` |
| **Disabled** | `rgba(44, 36, 32, 0.12)` bg, `rgba(44, 36, 32, 0.3)` text |

**Rule of thumb:** Landing/auth use the warm brown/tape palette (`#2C2420`, `#A65D37`). App pages (Report Simplifier, Medication, Caregiver) use green (`#00684A` family) for actions and active states.

---

## 2. Typography

### Font families
- **App / body:** `"ECA", sans-serif` (Euclid Circular A — loaded in `src/styles/fonts.css`).
- **Landing / auth:** `'Plus Jakarta Sans', sans-serif` for headings, buttons, and labels (ensure it’s loaded, e.g. via Google Fonts).

Use one family per “zone”: ECA for product UI, Plus Jakarta for marketing/auth if you want to keep current split; or standardize on ECA everywhere.

### Weights
- **Regular:** default body.
- **500:** medium (e.g. pills, labels).
- **600–700:** buttons, section titles.
- **700–800:** page titles, wordmark.

### Sizes (guideline)
| Use | Size | Notes |
|-----|------|--------|
| Wordmark / logo text | `1.4rem` – `1.5rem` | 800 weight |
| Page title | `1.75rem` – `2.8rem` | Responsive: smaller on xs, larger on lg |
| Section title | `1rem` – `1.25rem` (e.g. 20px) | Bold, often green in app |
| Body | `0.95rem` – `1rem` | 16px equivalent |
| Small / caption | `0.78rem` – `0.85rem` | Labels, hints |
| Nav items | `1rem` – `1.2rem` (e.g. 20px) | ECA, Bold when active |

### Letter-spacing
- **Headlines / wordmark:** `-0.03em` to `-0.04em`.
- **Footer / small caps:** `-0.01em` (optional).

### Line-height
- **Headlines:** ~`1.15`.
- **Body:** ~`1.4` – `1.65`.

**Pattern in code:** Prefer explicit `fontFamily`, `fontWeight`, and `fontSize` in `sx` for key text so the style guide is honored (e.g. `fontFamily: "ECA", sans-serif`, `fontWeight: "bold"`).

---

## 3. Spacing

MUI theme spacing is default **8px per unit**. Use theme units in `sx` (e.g. `p: 2` = 16px).

### Common values
| Use | Token | Approx. |
|-----|--------|---------|
| Inline gap (icon + text) | `gap: 1` – `1.5` | 8–12px |
| Between form fields | `mt: 2` – `2.5` | 16–20px |
| Section padding | `p: 3` – `4` | 24–32px |
| Page padding | `px: 3`, `py: 2` – `4` | 24px horizontal |
| Card padding | `p: 2` – `3` (or `p: { xs: 4, sm: 5 }` on auth) | 16–24px, 32–40px on auth |
| Stack of items | `gap: 1.5` – `2` | 12–16px |
| Top bar offset | `mt: 12` (when TopBar is shown) | 96px for fixed AppBar |
| Margins between sections | `mb: 2` – `5`, `mt: 2` – `3` | 16–40px |

### Layout spacing
- **Max content width:** e.g. `maxWidth: "1400px"` (Landing), `maxWidth: 440` (auth form).
- **Grid:** `spacing={3}` (24px) between grid items is standard.
- **Consistency:** Prefer `p`, `m`, `gap` in multiples of 1 (e.g. 1, 2, 3, 4) for alignment with the 8px grid.

---

## 4. Layout

### Page structure
- **Full viewport:** Use `Box` with `minHeight: "100vh"` or `minHeight: "calc(100vh - 110px)"` when a fixed TopBar is present.
- **With TopBar:** Wrap main content in `Box` with `mt: 12` so content is not hidden under the fixed AppBar.
- **Centered content:** `display: "flex"`, `alignItems: "center"`, `justifyContent: "center"`, plus `maxWidth` for readability.

### Grid
- Use MUI `Grid` with `container` and `item`.
- Common: `xs={12} md={6}` for two columns on desktop, full width on mobile; use `md={7.4}` / `md={4}` etc. when you need asymmetric splits.
- **Spacing:** `spacing={3}`.

### Sections
- Group content in `Box` or `Paper` with consistent padding (`p: 3` or `p: 4`) and clear section headings (Bold, green or dark text).

---

## 5. Reusable Components & Patterns

### From the codebase
- **Logo:** `<Logo imgSize={40} fontSize={30} />` — green SVG + “MedEase” text (ECA, bold, `#00684A`).
- **TopBar:** Renders on all routes except `/`, `/login`, `/signup`. Don’t duplicate nav; add new links to TopBar/LeftMenu if needed.
- **LeftMenu:** Drawer with nav, Terms/Privacy/Docs, and “Generate Key”. Use for secondary/legal links.
- **Disclaimer:** `<Disclaimer />` — yellow warning strip; use above or below content that needs a medical disclaimer.
- **InteractiveBackground:** Optional full-page canvas (bone + blobs); use for landing/auth only; ensure content has `zIndex: 1` and background has `zIndex: 0`.

### Shared patterns
- **Auth split layout:** Left dark panel (`#2C2420`) with headline + feature pills; right side with glass card (blur, rounded corners, `fieldSx` for inputs).
- **Form fields:** Use the shared `fieldSx` pattern: rounded `12px`, light bg, border `#E6DCCA`, focus `#2C2420` 1.5px.
- **Section cards:** `Paper` with `elevation={0}` or `elevation={6}`, gradient bg `#f9f9f9` → `#eef2f3`, `borderRadius: 3`, `boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)"`, optional `border: "1px solid #ccc"`.

---

## 6. Buttons

### Primary (filled)
- **Landing/auth:** `bgcolor: "#2C2420"`, `color: "#FFF"`, `borderRadius: "12px"`, `textTransform: "none"`, `fontWeight: 600`. Hover: darker (`#1a1614`), slight `translateY(-2px)`, stronger shadow.
- **App (green):** `backgroundColor: "#00684A"` or `#00897B`, `color: "white"`, `borderRadius: "20px"` or `2` (16px). Hover: `#005C3A` or `#00684A`.

### Secondary / outline
- **Border:** `borderColor: "#00684A"`, `color: "#00684A"`. Hover: `backgroundColor: "#e0f2f1"` or `#E6F4F1`.

### Nav (text)
- Transparent bg, text `#333` or `#222`; active/hover `#00684A`, optional `fontWeight: "Bold"` when active.

### Sizing
- **Height:** `py: 1.6` for primary CTAs; use `fullWidth` on mobile where appropriate.
- **Pills:** Use `borderRadius: "25px"` or `"20px"` for pill-shaped buttons.

---

## 7. Cards & Surfaces

### Standard content card
```jsx
<Paper
  elevation={0}
  sx={{
    p: 3,
    borderRadius: 3,
    background: "linear-gradient(to right, #f9f9f9, #eef2f3)",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
    border: "1px solid #ccc",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  }}
>
  {/* content */}
</Paper>
```

### Glass card (auth / overlay)
- `bgcolor: "rgba(247, 242, 237, 0.88)"`, `backdropFilter: "blur(24px)"`, `borderRadius: "24px"`, `border: "1px solid #E6DCCA"`, `boxShadow: "0 20px 60px rgba(44, 36, 32, 0.1)"`.

### Info / accordion
- `backgroundColor: "#E0F2F1"` for the accordion panel; title Bold, `#00684A`.

---

## 8. Interactive Elements

### Links
- **In-app:** Green `#00684A` or accent `#A65D37`; `fontWeight: 600`; hover `textDecoration: "underline"`.
- **Footer/secondary:** `color: colors.textSec`, hover `color: colors.textMain`, `transition: "color 0.2s"`.

### Inputs (TextField)
- **Outlined** variant; rounded (`borderRadius: "12px"`); border `#E6DCCA`, hover `#C8B9AF`, focused `#2C2420` 1.5px; label color `#8B7B72`, focused `#2C2420`.

### Lists / menu items
- Hover: `bgcolor: "#E6F4F1"`, `color: "#00684A"`. Icon color `#00684A` where applicable.

### Hover feedback
- Buttons: slight scale (`scale: 1.05` – `1.1`) or `translateY(-2px)` with stronger shadow.
- Use Framer Motion: `whileHover={{ scale: 1.1 }}` for nav buttons; `transition: "all 0.2s ease"` or `0.25s` in `sx`.

---

## 9. Animation & Motion

- **Framer Motion** is used for: scroll progress bar, entrance (opacity + y), hover scale, and optional scramble text.
- **Scroll progress:** `useScroll` + `useSpring` driving a thin bar (e.g. `scaleX`) under the nav.
- **Entrance:** `initial={{ opacity: 0, y: 24 }}`, `animate={{ opacity: 1, y: 0 }}`, `transition={{ duration: 0.6, ease: "easeOut" }}`.
- **Stagger:** Delay children by index (e.g. `delay: 0.15 + i * 0.08`, `duration: 0.45`).
- **Hover:** `whileHover={{ scale: 1.1 }}` or `scale: 1.05`; keep subtle to avoid distraction.
- **Transitions in sx:** `transition: "all 0.2s ease"` or `"0.25s ease"` for color/background/transform.

---

## 10. Responsive Behavior

- **Breakpoints:** MUI default (xs, sm, md, lg, xl). Common: hide/show at `md`, or at custom `width` (e.g. `1140`, `800`) via `useWindowSize`.
- **Landing nav:** Nav links hidden below `md`; wordmark and CTA always visible.
- **Auth:** Dark panel `display: { xs: "none", md: "flex" }`; form card full width on small screens.
- **TopBar:** Logo and nav layout change at ~800px and ~1140px (LeftMenu + center nav + profile).
- **Grid:** Prefer `xs={12} md={6}` (or similar) so sections stack on mobile.

---

## 11. Accessibility & Consistency

- Use semantic HTML and MUI components (Typography, Button, etc.) so structure and roles are clear.
- Keep focus rings (MUI default or custom with `#2C2420` / green).
- Reuse the same **color tokens** and **fontFamily** in `sx`; avoid one-off hex codes for primary/secondary/accent.
- Use the same **borderRadius** scale (e.g. 8, 12, 24) and **shadow** pattern for cards so surfaces feel consistent.

---

## 12. Quick reference checklist for new pages

- [ ] Use **ECA** for in-app UI text (or Plus Jakarta only on landing/auth if you keep the split).
- [ ] Use **green** (`#00684A`) for primary actions and active nav on app pages; **dark brown** (`#2C2420`) on landing/auth CTAs.
- [ ] Apply **8px-based spacing** (theme units: 1, 2, 3, 4) and standard **section padding** (`p: 3` or `p: 4`).
- [ ] Wrap main content in **Paper** or **Box** with the standard **gradient + borderRadius + shadow** when it’s a card/section.
- [ ] Use **TopBar** (and optional **LeftMenu**) for app pages; hide TopBar only for `/`, `/login`, `/signup`.
- [ ] Add **Disclaimer** where medical or AI-generated content is shown.
- [ ] Use **Framer Motion** sparingly for entrance and hover; keep durations short (0.2–0.45s).
- [ ] Test **responsive** at xs and md; use **Grid** and **display: { xs, md }** for layout changes.

This style guide is derived from the current MedEase frontend. Update it as the design system evolves.
