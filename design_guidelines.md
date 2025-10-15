# EvoFit Design Guidelines

## Design Approach: Modern Fitness Evolution

**Selected Approach:** Reference-Based (Drawing from Strava, MyFitnessPal, Apple Fitness+)
**Design Philosophy:** Energetic, data-driven, and motivational - combining athletic dynamism with clean information architecture

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary: 142 76% 36% (Vibrant emerald green - energy & growth)
- Secondary: 217 91% 60% (Electric blue - trust & technology)
- Accent: 31 100% 50% (Energetic orange - achievement highlights)
- Background: 0 0% 98% (Clean white base)
- Surface: 0 0% 100% (Pure white cards)
- Text Primary: 220 13% 18%
- Text Secondary: 220 9% 46%

**Dark Mode:**
- Primary: 142 70% 45%
- Secondary: 217 91% 65%
- Accent: 31 100% 55%
- Background: 222 47% 11% (Deep navy-charcoal)
- Surface: 217 33% 17% (Elevated dark cards)
- Text Primary: 0 0% 98%
- Text Secondary: 220 9% 70%

### B. Typography

**Font Families:**
- Primary: 'Inter' (Google Fonts) - Clean, modern sans-serif for UI and body text
- Display: 'Archivo' (Google Fonts) - Bold, athletic headers and numbers
- Data: 'JetBrains Mono' (Google Fonts) - Monospace for nutrition values and metrics

**Scale:**
- Hero/Display: 48px-64px, font-weight: 800
- Headings H1: 36px, font-weight: 700
- Headings H2: 28px, font-weight: 600
- Body Large: 18px, font-weight: 500
- Body: 16px, font-weight: 400
- Small/Caption: 14px, font-weight: 400
- Data/Metrics: 20-32px, font-weight: 600 (monospace)

### C. Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Micro spacing: p-2, m-2 (component internal)
- Standard spacing: p-4, gap-4 (cards, buttons)
- Section spacing: py-12, py-16 (between major sections)
- Large spacing: py-20, mt-20 (hero, feature sections)

**Grid System:**
- Container: max-w-7xl with px-4 md:px-6 lg:px-8
- Dashboard: 3-column grid on desktop (lg:grid-cols-3), 1 column mobile
- Analytics Cards: 2-column responsive (md:grid-cols-2)

### D. Component Library

**Navigation:**
- Sticky top navigation with gradient backdrop blur
- Logo left, main nav center, user profile/CTA right
- Mobile: Hamburger menu with slide-in drawer
- Active states: Underline with primary color

**Cards:**
- Rounded corners: rounded-xl (12px)
- Shadow: Subtle elevation (shadow-lg in light, glow effect in dark)
- Hover: Slight scale transform (scale-105) and enhanced shadow
- Workout cards: Image thumbnail left, stats right
- Meal cards: Food image top, nutrition grid below

**Buttons:**
- Primary: Gradient bg (emerald to blue), white text, rounded-lg, px-6 py-3
- Secondary: Outline with hover fill, primary color border
- Icon Buttons: Rounded-full, subtle background, hover scale
- CTA Buttons: Large (px-8 py-4), bold text, shadow-xl

**Forms:**
- Input fields: Rounded-lg, border-2, focus ring in primary color
- Labels: Text-sm, font-medium, mb-2
- Nutrition input: Grid layout with dedicated fields (calories, protein, carbs, fats)
- Workout logger: Exercise dropdown, sets/reps inputs in compact row

**Data Visualization:**
- Chart library: Recharts or Chart.js (line charts for progress, bar charts for nutrition)
- Color coding: Protein (blue), Carbs (orange), Fats (emerald)
- Interactive tooltips on hover
- Time range selectors (7d, 30d, 90d, 1y) as pill buttons

**Dashboard Widgets:**
- Quick Stats: 4-grid showing daily calories, workouts completed, streak, weight
- Progress Charts: Line chart for weight/body metrics over time
- Nutrition Summary: Circular progress rings for macro tracking
- Recent Activity Feed: Timeline-style list with icons

**Community Features:**
- User cards: Avatar, name, stats preview, follow button
- Progress posts: Image carousel with before/after, caption, like/comment
- Leaderboard: Numbered list with user avatars and achievement badges

### E. Micro-Interactions

**Purposeful Animations (Minimal Use):**
- Success states: Checkmark scale-in when meal/workout logged
- Loading: Skeleton screens with shimmer effect
- Progress bars: Smooth width transitions
- Hover states: Subtle scale (1.02-1.05) on cards and buttons
- No unnecessary scroll animations

### F. Images

**Hero Section:**
- Large hero image: Athletic person mid-workout or preparing healthy meal
- Overlay: Dark gradient (bottom-to-top) for text readability
- Position: Full-width, 60vh on desktop, 50vh mobile
- Content: Centered white text with CTA buttons (blurred background on outline variant)

**Feature Images:**
- Dashboard mockup: Screenshot of analytics interface
- Nutrition tracking: Food photography or app interface showing meal logging
- Community: User-generated content grid or testimonial photos
- Workout logger: Interface screenshot showing exercise tracking

**Image Placement:**
- Hero: Full-width at top
- Features section: Alternating left/right image-text layout
- Testimonials: Circular user avatars (56px)
- Food items: Square thumbnails (80px) in meal log

## Page-Specific Layouts

**Landing Page:**
1. Hero with large image, headline "Evolve Your Fitness Journey", dual CTA
2. Features grid (3-column): Nutrition Tracking, Workout Logger, Analytics Dashboard
3. Screenshot showcase: Dashboard interface with floating UI elements
4. Community proof: User stats (90k+ foods tracked, X workouts logged)
5. Final CTA section with gradient background

**Dashboard:**
- Top: Welcome message + quick action buttons (Log Meal, Log Workout)
- 3-column grid: Today's nutrition (left), Workout summary (center), Progress chart (right)
- Bottom: Recent activity feed (full-width)

**Nutrition Tracker:**
- Search bar (Nutritionix integration) prominent at top
- Meal sections: Breakfast, Lunch, Dinner, Snacks (collapsible accordions)
- Daily macro summary: Circular progress rings (sticky sidebar on desktop)

**Workout Logger:**
- Exercise selector dropdown with search
- Sets/Reps table with add/remove rows
- Previous workout comparison sidebar
- Save button (prominent, gradient primary)

**Analytics Page:**
- Date range selector at top
- Large chart area (weight/body metrics over time)
- Macro breakdown charts (2-column grid)
- Achievement badges and milestones section

---

**Design Principle:** Create an energizing, data-rich experience that motivates users through clear progress visualization and seamless tracking workflows. Balance athletic energy (vibrant colors, bold typography) with professional data presentation (clean charts, organized layouts).