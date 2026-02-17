# Budzo Design System & Style Guide
**Version:** 1.0.0
**Application:** Budzo - Orçamentos Fáceis e Profissionais
**Tech Stack:** Tailwind CSS, Shadcn/UI, Lucide React

---

## 1. Brand Identity & Visual Language

### Core Concept
* **Vibe:** Professional, Trustworthy, Modern, Efficient.
* **Logo Shapes:** Rounded squares (squircles) and arrows representing growth/upward movement.
* **UI Characteristics:** Clean interfaces, high contrast, generous spacing, rounded corners to match the logo icon.

### Color Palette Extraction
Based on the provided logos (Light & Dark variants).

| Color Name | Hex Code | Usage |
| :--- | :--- | :--- |
| **Budzo Blue** | `#3CA9E2` | **Primary Brand Color.** Used for main buttons, active states, links, and the growth arrow. |
| **Budzo Navy** | `#183B56` | **Secondary Brand Color.** Used for headings, heavy structural elements, and the logo text in light mode. |
| **Slate Dark** | `#0F172A` | **Dark Background.** Used for the dark mode background (matches logo black). |
| **Slate Light** | `#F8FAFC` | **Light Background.** A very subtle cool grey/white for light mode. |
| **Success Green**| `#10B981` | (Suggested) For "Budget Approved" states. |
| **Warning Orange**| `#F59E0B` | (Suggested) For "Pending" states. |

---

## 2. Typography System

**Font Family:** `Inter` or `Plus Jakarta Sans` (Google Fonts).
* *Rationale:* Geometric sans-serif matches the modern structure of the "Budzo" logo text.

**Styles:**
* **H1/H2 (Page Titles):** Bold (`font-bold`), Tight tracking (`tracking-tight`), Color: Budzo Navy (Light Mode) / White (Dark Mode).
* **Body Text:** Regular (`font-normal`), Slate-600 (Light) / Slate-400 (Dark).
* **Buttons:** Semibold (`font-semibold`).

---

## 3. Implementation Guide (Copy-Paste)

### A. Tailwind Configuration (`tailwind.config.js`)
Add these extensions to your config file to map the brand colors and border radius.

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))", // Budzo Blue
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", // Budzo Navy
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Direct Brand Access
        budzo: {
          blue: "#3CA9E2",
          navy: "#183B56",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
}