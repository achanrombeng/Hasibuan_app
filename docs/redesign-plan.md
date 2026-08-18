# Ronica Redesign Implementation Plan

This document outlines the plan to redesign the Ronica website based on the guidelines in `docs/design.md` and engineering standards in `gemini.md`.

## 1. Design System & Tokens

**Goal:** Establish the visual foundation in `tailwind.config.js` and CSS variables.

### Colors

- **Primary (Teal)**: `#02545f`
- **Accent (Yellow)**: `#ffdb56`
- **Neutral Dark (Text)**: `#1a1a1a` (approximate for soft black)
- **Neutral Light (Background)**: `#f8f9fa` (off-white) or `#ffffff`

### Typography

- **Font Family**: Inter, Plus Jakarta Sans, or Manrope (Google Fonts).
- **Headings**: Bold, tight tracking for large text.
- **Body**: Regular weight, relaxed line height.

### Shadows & Radius

- **Radius**: Small/Sharp for premium feel (e.g., `rounded-sm` or `rounded-none`).
- **Shadows**: Soft, diffused shadows for depth (e.g., `shadow-lg` for dropdowns, `shadow-sm` for cards).

---

## 2. Component Refactoring

**Goal:** Update core UI components to match the new design language.

### Buttons (`components/ui/Button.tsx`)

- **Primary**: Teal background, white text, sharp/slight rounded corners.
- **Secondary**: Transparent/Outlined or Accent Yellow.
- **Ghost**: Minimal hover effect.

### Cards (`components/ProductCard.tsx` - to be created/updated)

- **Style**: Minimal border, large image area, clean typography.
- **Interactions**: Subtle zoom or shadow lift on hover.

### Navbar (`components/Navbar.tsx`)

- **Layout**: Sticky header, logo left, centered selection, minimal icons right.
- **Style**: White background, faint border bottom.

---

## 3. Page Redesign

### Home Page (`pages/Home.tsx`)

1.  **Hero Section**:
    - Full selection (100vh).
    - Background image: High-quality furniture lifestyle shot.
    - Content: Minimal text ("Crafted furniture for modern living"), 1 CTA button.
2.  **Featured Categories**:
    - Grid layout (3-4 columns).
    - Clean images with simple labels.
3.  **New Arrivals / Featured Products**:
    - Horizontal scroll or Grid.
    - Product Cards with price and name clearly visible.

### Product Listing / Marketplace

- **Grid**: 3-4 columns on desktop.
- **Filters**: clean sidebar or top bar filters.

### Product Detail Page (PDP)

- **Layout**: Split screen (Image Left, Details Right).
- **Typography**: Hierarchy emphasis on Product Name and Price.
- **CTA**: Clearly visible "Add to Cart".

---

## 4. Engineering Standards (Ref: `gemini.md`)

- **SOLID Principles**: Ensure components are focused (SRP).
- **Clean Code**: Descriptive variable names, small functions.
- **Reusability**: Use shared components for Buttons, Inputs, Cards.

---

## 5. Execution Steps

1.  **Setup**: Install fonts, update Tailwind config.
2.  **Components**: Update `Button`, create/update `ProductCard`.
3.  **Layout**: detailed update of `Layout`, `Navbar`, `Footer`.
4.  **Pages**: Rewrite `Home.tsx` first, then listings and PDP.
5.  **Review**: Verify against reference sites (Pottery Barn, OH Architecture).
