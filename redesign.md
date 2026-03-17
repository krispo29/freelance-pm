You are a senior UI/UX designer and Next.js developer specializing in modern
web design trends of 2025–2026. Redesign a Freelance Project Manager web app
using Next.js 14+ (App Router) and Tailwind CSS v4.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 BRAND & AUDIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Target users: Freelance project managers, solo consultants, indie agencies
- Brand tone: Sophisticated, confident, calm-but-powerful
- Personality: Like a premium productivity tool (think Linear meets Notion meets
  Framer — but uniquely its own)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🖌️ DESIGN DIRECTION (2025–2026 Trends)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Apply ALL of the following modern design principles:

1. **Glassmorphism 2.0** — Frosted glass cards with backdrop-blur, subtle borders
   (border-white/10), layered depth using multiple translucency levels

2. **Dark-first with selective light accents** — Deep neutral base
   (#0A0A0F or zinc-950) with vibrant accent pops (electric indigo #6366F1
   or aurora teal #2DD4BF). NOT all-dark — use strategic light surfaces.

3. **Bento Grid Layout** — Dashboard uses asymmetric bento-box grid
   (CSS Grid, mixed col/row spans). Different card sizes create visual rhythm.

4. **Fluid Typography** — Use clamp() for responsive type scaling.
   Display font: "Instrument Serif" or "Fraunces" (editorial weight).
   UI font: "Geist" or "DM Sans". Never Inter or Roboto.

5. **Ambient Glow / Mesh Gradients** — Radial gradient blobs as background
   atmosphere (purple + teal + indigo mesh). Use CSS @property animated gradients
   or conic-gradient overlays.

6. **Micro-interactions with purpose** — Framer Motion for:
   card hover lifts (y: -4, shadow expansion), staggered list reveals,
   number counter animations on stats, smooth page transitions.

7. **Data Density done right** — Show lots of info without feeling cluttered.
   Use mini sparklines, inline progress rings (SVG), status dots, and
   compact tag chips.

8. **Noise texture overlay** — Subtle grain on cards/surfaces
   (SVG filter turbulence or CSS noise) for tactile depth.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 PAGES & COMPONENTS TO REDESIGN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Redesign these key screens:

**1. Dashboard (Main Hub)**

- Bento grid: Active projects (large card), Revenue this month (stat card with
  sparkline), Upcoming deadlines (timeline list), Client health score (donut ring),
  Quick-add task (floating action), Recent activity feed
- Top: Minimal nav with avatar, search (cmd+k style), notification bell

**2. Project Detail Page**

- Hero area: Project title in large serif, client logo, status badge
- Kanban board OR timeline view toggle
- Team/collaborator avatars with presence indicators
- Budget tracker with animated progress bar
- Integrated file/deliverable section

**3. Client Portal (Public-facing)**

- Clean, professional — lighter theme than dashboard
- Project status overview the client can view
- Approval buttons for deliverables
- Invoice section

**4. Sidebar Navigation**

- Collapsible, icon + label
- Section grouping: Workspace / Projects / Clients / Finance / Settings
- Active state: Glowing left border + subtle background fill
- Bottom: Usage/plan indicator + user avatar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 COLOR PALETTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Base: #08080E (background), #111118 (surface), #1C1C27 (card)
Border: rgba(255,255,255,0.07)
Primary: #6366F1 (indigo) — CTAs, active states
Accent: #2DD4BF (teal) — success, revenue, growth
Warning: #F59E0B (amber) — deadlines, overdue
Text: #F4F4F5 (primary), #71717A (muted)
Glass: bg-white/5 backdrop-blur-xl border border-white/10

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ TECHNICAL REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Next.js 14+ App Router with TypeScript
- Tailwind CSS v4 (use @theme, CSS variables)
- Framer Motion for all animations
- shadcn/ui as base component layer (then extend heavily)
- next/font for Google Fonts (Fraunces + Geist)
- Lucide React for icons
- Recharts or Tremor for data visualization
- CSS custom properties for theming (not hardcoded values)
- Fully responsive: mobile sidebar drawer, stacked bento on sm screens
- Accessible: ARIA labels, keyboard navigation, focus-visible rings

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ UNFORGETTABLE DETAIL (make it yours)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Add ONE signature detail that makes this design memorable:
→ Animated ambient orb that subtly follows cursor (CSS only, no JS overhead)
→ OR: Project cards that reveal a color-coded gradient top border on hover
(each project gets a unique hue based on its ID)
→ OR: "Focus Mode" toggle that collapses everything except current active task

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 DELIVERABLE FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Output as:

1. /app/dashboard/page.tsx — full dashboard layout
2. /components/ui/ — reusable glass card, stat card, bento grid components
3. /app/globals.css — CSS variables + theme setup
4. Inline comments explaining each design decision
