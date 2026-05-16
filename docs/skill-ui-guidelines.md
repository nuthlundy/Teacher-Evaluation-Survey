# UI/UX Skill Guidelines for Teacher Evaluation Survey System

> **Purpose**: Provide a single source of truth for designers and developers working on the Teacher Evaluation Survey platform. These guidelines capture the visual language, component usage, and interaction patterns while **preserving all existing system functionality and behavior**.

---

## 1. Design Philosophy
- **Human‑Centred** – Focus on clarity, readability, and low‑friction interactions for both students (public) and admins (internal).  
- **Consistency** – Re‑use visual patterns across the public survey, admin dashboard, and analytics pages.
- **Scalability** – The UI must gracefully handle a growing number of campuses, classes, teachers, and evaluation records.
- **Accessibility First** – Meet WCAG 2.1 AA at a minimum; color contrast, keyboard navigation, and screen‑reader friendliness are non‑optional.
- **Mobile‑First** – Design for the smallest viewport first, then progressively enhance for larger screens.

---

## 2. Color Hierarchy
| Role | Hex | Usage |
|------|-----|-------|
| **Primary** | `#1E3A8A` (Indigo‑900) | Main actions, primary buttons, brand accents |
| **Secondary** | `#6366F1` (Indigo‑500) | Secondary buttons, links, hover states |
| **Success** | `#10B981` (Green‑500) | Success alerts, positive feedback |
| **Warning** | `#F59E0B` (Amber‑500) | Warning alerts, validation errors |
| **Error** | `#EF4444` (Red‑500) | Error alerts, destructive actions |
| **Background** | `#F9FAFB` (Gray‑50) | Page background, cards (light mode) |
| **Surface** | `#FFFFFF` (White) | Card surfaces, modal backgrounds |
| **Text Primary** | `#111827` (Gray‑900) | Main body copy |
| **Text Secondary** | `#6B7280` (Gray‑500) | Helper text, placeholders |
| **Border** | `#E5E7EB` (Gray‑200) | Input borders, divider lines |

> **Dark mode** – Flip the background/surface palette to `gray‑900`/`gray‑800` while preserving contrast ratios.

---

## 3. Typography
- **Font Family**: `Inter`, fallback `system-ui` – loaded via Google Fonts.
- **Scale** (mobile first, using Tailwind `text-*` utilities):
  - `text-sm` – Helper/placeholder text.
  - `text-base` – Body copy (16 px).
  - `text-lg` – Section headings.
  - `text-xl` – Page titles.
  - `text-2xl` – Main dashboard headings.
- **Weight**:
  - Regular `400` for body.
  - Medium `500` for sub‑headings.
  - Bold `700` for primary headings and button labels.
- **Line Height**: `leading-relaxed` for paragraph text, `leading-tight` for UI labels.

---

## 4. Spacing System
Use an **8‑px grid** (Tailwind `space-x-2`, `p-2`, `m-2`). Typical values:
- **Margin / Padding**: 4 (`1rem`), 8 (`2rem`), 12 (`3rem`).
- **Component gutters**: `gap-4` for grid layouts.
- **Form fields**: `my-2` between inputs, `px-4 py-2` inside fields.

---

## 5. Responsive Behavior
| Breakpoint | Width | Typical Layout |
|------------|------|----------------|
| **Mobile** | `<640px` | Single‑column, collapsible sidebar, full‑width cards |
| **Tablet** | `640‑1024px` | Two‑column grid for admin lists, sidebar stays visible but collapsible |
| **Desktop** | `>1024px` | Three‑column dashboard, persistent sidebar, larger card previews |

Utilize Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) and **shadcn/ui**'s `Drawer` component for off‑canvas navigation on mobile.

---

## 6. Admin Dashboard Design Rules
- **Consistent Header** – Logo left, global search center, user avatar/right.
- **Primary Navigation** – Vertical sidebar with clear icons, active state highlighted with `bg-primary/10`.
- **Card‑Based Layout** – Use `shadcn/ui Card` for statistics, tables, and forms.
- **Action Placement** – Primary CTA on the top‑right of a section; secondary actions grouped in a kebab menu.
- **Feedback** – Show toast notifications (`shadcn/ui Toast`) for success/error.

---

## 7. Table Styling Rules
- Use `shadcn/ui Table` component.
- **Header**: `text-sm font-medium text-gray-600 bg-gray-100`.
- **Rows**: Alternating `bg-white` / `bg-gray-50` for readability.
- **Hover**: `hover:bg-primary/5`.
- **Pagination** – Bottom‑right, compact with icons.
- **Responsive** – Collapse columns into a stacked card view on `<sm` using `@media` utilities or `react-table`'s hidden columns.

---

## 8. Form Styling Rules
- **Input**: `border border-border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary`.
- **Label**: `block text-sm font-medium text-gray-700 mb-1`.
- **Error Message**: `text-xs text-error mt-1`.
- **Select / Radio**: Use `shadcn/ui Select` and `RadioGroup` with consistent spacing.
- **Submit Button**: `bg-primary text-white hover:bg-primary/90 disabled:opacity-50`.
- **Form Layout**: `grid grid-cols-1 md:grid-cols-2 gap-4`.

---

## 9. Loading / Skeleton States
- Use **shadcn/ui Skeleton** component.
- For cards: `h-40 w-full` grey block.
- For tables: animate rows with `animate-pulse`.
- Show a **global spinner** (`react-spinners` or custom) only for full‑page loads; avoid blocking UI for small async fetches.

---

## 10. Empty States
- Centered illustration (use a simple SVG stored in `public/empty.svg`).
- Message: “No data to display” + optional CTA button.
- Apply `text-center text-gray-500` and `mt-8`.

---

## 11. Animation Guidelines
- **Micro‑animations**: `transition` on color, background, transform (`duration-150 ease-in-out`).
- **Page transitions**: Fade‑in using `framer‑motion` (`initial={{ opacity: 0 }} animate={{ opacity: 1 }}`).
- **Modal / Drawer**: Slide from the side/top with `motion.div` and `transform`.
- **Respect reduced motion** – honor `prefers-reduced-motion` media query; disable non‑essential animations.

---

## 12. Accessibility Guidelines
- **Keyboard**: All interactive elements reachable via `Tab`. Focus ring: `outline-none ring-2 ring-primary`.
- **ARIA**: Add appropriate `aria-label`, `role`, and `aria‑describedby` to form fields and tables.
- **Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text.
- **Skip Navigation**: Provide a hidden “Skip to content” link at the top.
- **Semantic HTML**: Use `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`.
- **Form Validation**: Announce errors via `aria-live="assertive"`.

---

## 13. Mobile‑First Behavior
- **Touch Targets**: Minimum 44 × 44 dp.
- **Overflow**: Prevent horizontal scrolling; use `overflow-x-auto` on tables.
- **Input Types**: Use native keyboards (`type="email"`, `type="number"`).
- **Bottom Navigation**: For public survey, provide a fixed bottom bar with **Next**/**Submit** buttons on mobile.

---

## 14. Sidebar / Navigation Design
- **Desktop**: Fixed width `w-64`, collapsible with a toggle button.
- **Mobile**: Off‑canvas drawer (`shadcn/ui Drawer`) that slides in from the left.
- **Active Item**: `bg-primary/10 text-primary` plus a left border indicator.
- **Iconography**: Use **Heroicons** (outline style) for consistency.

---

## 15. Card Component Consistency
- **Container**: `bg-surface shadow-sm rounded-lg p-4`.
- **Header**: `flex items-center justify-between mb-2`.
- **Content**: Use `grid` for stats or `flex` for simple rows.
- **Actions**: Align to the top‑right; use `IconButton` from `shadcn/ui`.
- **Hover**: Elevate shadow (`shadow-md`) and optionally `bg-primary/5`.

---

## 16. Tailwind Best Practices
- **Never** use `!important`. Prefer Tailwind utilities.
- **Extract** repeated utility groups into `@apply` in `src/styles/tailwind.css`.
- **Avoid** arbitrary values unless absolutely necessary. Use the configured scale.
- **Prefix** custom colors in `tailwind.config.js` (e.g., `primary`, `secondary`).
- **Purging**: Ensure `content` includes all `tsx`/`ts`/`jsx`/`js` files.

---

## 17. shadcn/ui Usage Rules
- **Component Overriding** – Extend shadcn components via the `className` prop instead of editing source files.
- **Variants** – Use `variant` prop when available (`default`, `outline`, `ghost`).
- **Composition** – Combine `Card` + `Button` + `Dialog` to build complex UI; keep each component responsible for a single concern.
- **Theming** – Keep theming consistent by feeding Tailwind `primary` colors into shadcn components via `className="bg-primary text-primary-foreground"`.
- **Accessibility** – shadcn components already provide ARIA attributes; do not remove them.

---

### 📌 Preservation of Existing Functionality
All guidelines are **non‑breaking** – they describe visual and interaction standards without altering any current API contracts, data models, or business logic. Existing components will continue to work; applying these styles simply refines the presentation layer.

---

*Document last updated: 2026‑05‑16*