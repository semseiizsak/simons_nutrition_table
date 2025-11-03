# 🥬 **Simon’s Nutrition**
### “Transparency Never Tasted This Good”

Built with **Next.js**, **Supabase**, and **React-PDF** — because even our macros deserve good design.  
From crispy **fries** to creamy **milkshakes**, everything’s measured, styled, and printable in pure Simon’s fashion.

---

## 🍔 **Stack Overview**

#### 🧱 **Layer:** Frontend  
**⚙️ Tech:** Next.js (App Router), Tailwind CSS, Framer Motion  
**🗒️ Notes:** Lightning-fast admin and public UI with smooth animations.

#### 🧱 **Layer:** Backend  
**⚙️ Tech:** Supabase  
**🗒️ Notes:** Stores every gram and allergen with surgical precision.

#### 🧱 **Layer:** PDF Engine  
**⚙️ Tech:** @react-pdf/renderer  
**🗒️ Notes:** Generates branded, print-ready nutrition tables.

#### 🧱 **Layer:** Auth  
**⚙️ Tech:** Admin Token  
**🗒️ Notes:** Lightweight protection for edits — no random lettuce can sneak in.

---

## ⚡ **Features**

✨ **Instant Editing** — Live inline editing for every menu item.  
📄 **One-Click PDF** — Pixel-perfect export with vertical headers.  
🍟 **Smart Allergen Grid** — Dots mark allergens for clear visual feedback.  
🌈 **Playful Public Page** — Animated, branded, and beautifully responsive.  
💚 **On-Brand Colors** — Simon’s green and white dominate every detail.

---

## 🚀 **Getting Started**

```bash
git clone https://github.com/<your-username>/simons-nutrition.git
cd simons-nutrition
npm install
cp .env.example .env


Set up your environment:

```bash
SUPABASE_SERVICE_ROLE=your_secret_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
```

Run the dev server:

```bash
npm run dev
```

Open: **[http://localhost:3000](http://localhost:3000)**

---

🧠 **Dev Commands**

```bash
npm run dev      # start development
npm run build    # build for production
npm run start    # serve production build
npm run lint     # clean up your messy code
```

---

🧑‍🍳 **Admin Panel**

**Path:** `/admin`

Add, edit, and delete menu items.
Category dropdowns (Burgers, Fries, Milkshakes, Sauces, Refill Drinks).
Numeric inputs for kcal, fat, sugar, protein, etc.
Text field for allergen list.
Token-based access stored in localStorage.

A simple “Save token” button gives you editing superpowers. 🔐

---

🧾 **PDF Generator**

**Path:** `/api/generate-pdf`

A4 layout with green header bar and white typography.
Vertical nutrient and allergen labels.
Section bars by category.
Grey allergen zone for perfect contrast.
Open Sans font for crisp printing.

Each export = one perfectly balanced, branded table.

---

🌈 **Public Page**

**Path:** `/nutrition`

Motion-driven design with Framer Motion.
Interactive PDF preview embedded in the page.
Button to open or download the latest version.
Smooth green-white gradients for that Simon’s freshness.

Calories never looked this good.

---

🗂️ **Folder Structure**

```
simons-nutrition/
├─ src/
│  ├─ app/
│  │  ├─ api/generate-pdf/route.ts     # PDF generator
│  │  ├─ admin/page.tsx                # Admin dashboard
│  │  └─ nutrition/page.tsx            # Public page
│  ├─ lib/supabaseAdmin.ts             # Supabase admin client
│  └─ types/nutrition.ts               # Type definitions
│
├─ public/
│  └─ simonsburger_kaloria_tablazat_template.png
│
├─ .env.example
├─ package.json
├─ tailwind.config.ts
└─ README.md
```

---

🎨 **Brand Palette**

| Name             | Usage             | HEX       |
| :--------------- | :---------------- | :-------- |
| 🥬 Simon’s Green | Primary           | `#0FA650` |
| ⚪ White          | Background / Text | `#FFFFFF` |
| 🌑 Charcoal      | Body Text         | `#222222` |
| 💨 Light Grey    | Grid Lines        | `#C9C9C9` |

---

🧭 **Roadmap**

* [ ] Host on Vercel with Supabase env support
* [ ] Add mobile-optimized admin view
* [ ] Generate multipage PDF for long menus
* [ ] Add AI allergen auto-tagging
* [ ] Introduce versioned PDFs with change log

---

👨‍🍳 **Credits**

Built by [**@semseiizsak**](https://github.com/semseiizsak) 💚
For **Simon’s Burger** 

---

🥳 **Fun Fact**

A well-structured PDF is like a perfect burger: layers aligned, sauces balanced, zero overflow.

