# MedEase Landing Page — Structure Lesson

This document explains **how the landing page is built** so you can confidently change **design**, **text**, and **theme** to make it a mature, advertisement-ready business page. **No code is changed here** — this is a lesson and map only.

---

## 1. Folder and file structure

All landing-page code lives under:

```
frontend/src/pages/LandingPage/
├── LandingPage.jsx          ← Main page: layout, navbar, scroll, section order
├── LP_Hero.jsx              ← Top hero (headline, subtext, CTA)
├── LP_Mission.jsx           ← "Our Mission" + bento cards
├── LP_Product.jsx            ← "Intelligent Health Management" + tabbed product console
├── LP_About.jsx             ← "Built from Experience" + two narrative cards
├── LP_Footer.jsx             ← Footer (brand, links, social, copyright) — used as "Contact" section
├── LP_Contact.jsx            ← Exists but is NOT used; main page uses LP_Footer for id="contact"
└── utils/
    ├── InteractiveBackground.jsx   ← Animated blob background (p5.js)
    └── ScrambleText.jsx            ← Standalone scramble utility (Hero uses its own inline ScrambleText)
```

**Important:** The **route /** in the app renders `LandingPage.jsx`. That file imports and places the sections in order. The navbar scrolls to section **ids**: `mission`, `product`, `about`, `contact`. The **contact** target is the **footer** (`LP_Footer`), not `LP_Contact`.

---

## 2. How the main page is wired (LandingPage.jsx)

- **Background:** One global `<InteractiveBackground />` (blobs) behind everything.
- **Navbar:** Fixed AppBar with:
  - Logo text: **"MedEase"** (click scrolls to top).
  - Nav links: **Mission**, **Product**, **About**, **Docs** — each scrolls to the section with that **id** (e.g. `mission`, `product`, `about`). The last one scrolls to **contact** (the footer).
  - CTA button: **"Join Waitlist"** — scrolls to `contact`.
- **Scroll bar:** A thin progress bar under the nav (Framer Motion `scrollYProgress`).
- **Content order (top to bottom):**
  1. `LP_Hero`
  2. `<Box id="mission">` → `LP_Mission`
  3. `<Box id="product">` → `LP_Product`
  4. `<Box id="about">` → `LP_About`
  5. `<Box id="contact">` → `LP_Footer`

So: **section order and nav targets** are controlled in **LandingPage.jsx**. To reorder sections or add a new one, you edit that file and give the new section an `id` if you want a nav link to it.

---

## 3. Where theme and design live

There is **no single design-token file** for the landing page. Each section file defines its **own** `colors` and `fontMain` at the top. That’s why you’ll see similar hex codes repeated.

### Shared conventions (you can unify these later)

| What              | Typical value        | Where it’s used                          |
|-------------------|----------------------|------------------------------------------|
| **Main text**     | `#2C2420`            | Headlines, primary text                  |
| **Secondary text**| `#594D46`            | Body, captions                           |
| **Accent**        | `#A65D37`            | Pills, highlights, some buttons         |
| **Background**    | `#EBE5DE` (bone/sand)| Section backgrounds, cards               |
| **Light cards**   | `#F5F0EB`, `#F3EFE7` | Card lower areas, light panels            |
| **Dark panels**   | `#2C2420`, `#352B25` | Nav bar, dark cards, console             |
| **Font**          | `'Plus Jakarta Sans', sans-serif` | Every section              |
| **Border**        | `#E6DCCA` or rgba    | Card borders, dividers                   |

To change **theme** globally for the landing page, you would:

1. Change the **same** color/font in **each** of: `LandingPage.jsx`, `LP_Hero.jsx`, `LP_Mission.jsx`, `LP_Product.jsx`, `LP_About.jsx`, `LP_Footer.jsx` (and optionally `utils/InteractiveBackground.jsx` for blob colors).
2. Or refactor later: create one shared object (e.g. `landingTokens.js`) and replace local `colors` / `fontMain` with imports from that file.

**Background blobs:** In `utils/InteractiveBackground.jsx`, the **PALETTE** object at the top controls blob colors (e.g. bone, warm clay, muted beige, soft sage). Change those if you want a different “vibe” behind the page.

---

## 4. Section-by-section: what to edit for text and design

### 4.1 LP_Hero.jsx

- **Headline:** The big “Agentic AI for your …” line. The scrambled part is **“post-injury”**; the static part is **“ journey”**. Edit the `<Typography>` and the `<ScrambleText text="post-injury" />` / surrounding span to change hero copy.
- **Subtext:** The paragraph under the headline (“MedEase replaces post-injury panic…”). Edit that string to change the value proposition.
- **CTA:** Button label **“Join Waitlist”** and `onClick` (currently navigates to `/signup`). Change label and/or route here.
- **Theme:** Top-of-file `colors` and `fontMain`. Responsive font sizes are in the `sx` props (e.g. `fontSize: { xs: "3rem", md: "5rem" }`).

### 4.2 LP_Mission.jsx

- **Section title:** **“Our Mission”**.
- **Section subtitle:** “Infrastructure that transforms complex medical condition into a navigable path.”
- **Cards:** Four bento cards with **title** and **text** passed into `<BentoCard>`. In the **text**, `**word**` is rendered bold (split by `**`). Edit the `title` and `text` props for each `<BentoCard>` to change copy.
- **Theme:** `colors` at top (card upper/lower, borders, text). Icons are from **lucide-react** (AlertTriangle, Compass, ShieldCheck, Zap); they are currently commented out in the cards.

### 4.3 LP_Product.jsx

- **Section title:** **“Intelligent Health Management”**.
- **Tabs and content:** A `sections` array (e.g. “Agentic Triage Engine”, “Adaptive Chat Protocol”). Each item has `id`, `title`, `subtitle`, `features` (list of strings), and `type` (“dashboard” or “chat”). Edit this array to change product copy and feature bullets.
- **Theme:** `colors` at top (dark console, accent, pills, switcher). Tab pill and dark card styling is in `sx` props.

### 4.4 LP_About.jsx

- **Section title:** **“Built from Experience”**.
- **Section subtitle:** “We didn’t just find a market gap. We lived it.”
- **Two narrative cards:** Each `<NarrativeCard>` gets `label`, `title`, `body`, and `highlight` (pull quote). Edit those props to change the story (e.g. “01 — The Spark”, “02 — The Vision”, and all body/highlight text).
- **Theme:** `colors` at top (dark vs light card, accent). **lucide-react** `Quote` is used for the quote icon.

### 4.5 LP_Footer.jsx (the “Contact” section)

- **Brand:** “MedEase” and the short tagline (“The missing infrastructure for student health…”). Edit those Typography contents.
- **Columns:** “Product”, “Company”, “Legal”, “Get the App” with link labels (e.g. “Features”, “About Us”, “Privacy Policy”). Edit `<FooterHeader>` and `<FooterLink>` children to change labels; add `href` to `<FooterLink>` when you have real URLs.
- **Social:** Icons from **lucide-react** (Twitter, Instagram, Linkedin). Swap or add icons and link them in `IconButton` components.
- **Bottom line:** Copyright “© … MedEase Inc.” and “Designed at Emory”. Edit those strings.
- **Theme:** `colors` at top; link hover and icon styles in `sx`.

---

## 5. Navbar (in LandingPage.jsx)

- **Logo text:** “MedEase” — single Typography component.
- **Nav labels:** Generated from the list `["mission", "product", "about", "docs"]` (capitalized and “-” → space). So you see “Mission”, “Product”, “About”, “Docs”. Change that array to change or reorder links; the **id** you pass to `handleScrollTo(id)` must match the `id` on a `<Box>` wrapping a section (e.g. `id="contact"` for the footer).
- **CTA:** “Join Waitlist” — same as Hero; update in both places if you want consistency.
- **Theme:** `colors` and `fontMain` at top of LandingPage.jsx; `NavButton` styled component; AppBar `sx` (background, blur, border).

---

## 6. Making it “advertisement-ready” — what to touch

- **Copy:** Replace placeholder and internal language with clear, benefit-led, audience-specific copy in: Hero (headline + subtext), Mission (titles + card text), Product (titles + subtitles + features), About (story + quotes), Footer (tagline + link labels).
- **Trust:** Add real links in the footer (Privacy, Terms, Contact, social), and optionally a dedicated contact/waitlist block (you could use or adapt `LP_Contact.jsx` and insert it above the footer, with `id="contact"`).
- **Theme consistency:** Either define one `landingTokens.js` and use it in every LP_* file, or do a pass and set the same hex/font in each file so the whole page feels like one brand.
- **Assets:** Replace any placeholder imagery; ensure logo/brand mark is consistent (navbar and footer).
- **Legal:** Footer “Privacy Policy” and “Terms of Service” should point to your real routes (e.g. `/privacy`, `/terms`) if you already have those pages.
- **Analytics/CTAs:** Ensure “Join Waitlist” (and any other primary CTA) goes to the right route or external form; track in analytics if needed.

---

## 7. Quick reference: “I want to change…”

| Goal                         | File(s) to open                         |
|-----------------------------|------------------------------------------|
| Hero headline or subtext    | `LP_Hero.jsx`                            |
| Mission title or card copy | `LP_Mission.jsx`                         |
| Product title or tab content | `LP_Product.jsx` (and `sections` array) |
| About story / quotes       | `LP_About.jsx`                           |
| Footer tagline, links, copyright | `LP_Footer.jsx`                    |
| Nav links and CTA labels    | `LandingPage.jsx`                        |
| Section order or add section | `LandingPage.jsx` (order + ids)        |
| Global colors/fonts (concept) | All `LP_*.jsx` + `LandingPage.jsx` (top-of-file `colors`, `fontMain`) |
| Blob background colors     | `utils/InteractiveBackground.jsx` → `PALETTE` |

---

You can use this as a checklist: open the listed file, find the string or `colors`/`fontMain` block, and edit. No need to change anything else if you only touch copy and theme in the right places.
