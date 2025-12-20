# InstantInvoice 📄

A modern, mobile-first invoice management application built with Next.js. Create, manage, and track invoices with a beautiful, responsive interface optimized for mobile and tablet devices.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 📱 Onboarding & Authentication
- **Welcome Screen** - Engaging onboarding with hero imagery
- **Business Registration** - Capture business details and logo
- **Responsive Design** - Optimized for mobile, tablet, and desktop

### 📊 Dashboard
- **Financial Overview** - Horizontally scrollable cards showing:
  - Paid invoices
  - Pending invoices
  - Cancelled invoices
  - Total revenue with trend indicators
- **Invoice Management** - Search, filter (All/Pending/Paid/Canceled), and view recent invoices
- **Quick Actions** - Floating action button for creating new invoices

### 🧾 Invoice Creation
- **Business Details** - Company information with logo upload
- **Client Management** - Searchable client selector
- **Invoice Metadata** - Invoice number, dates, and currency selection
- **Dynamic Line Items** - Add/remove items with automatic calculations
- **Notes & Terms** - Customizable invoice notes
- **Real-time Totals** - Automatic subtotal, tax, and total calculations

### 👁️ Invoice Preview
- **Professional Layout** - Clean, printable invoice design
- **Status Badges** - Visual indicators for invoice status
- **Client Details** - Complete billing information
- **Itemized Breakdown** - Detailed line items with quantities and amounts
- **Action Buttons** - Download, share, print, and mark as paid

### 🧾 Payment Receipt
- **Success Confirmation** - Large checkmark with payment status
- **Transaction Details** - Date, receipt number, and payment method
- **Scalloped Design** - Ticket-style perforated edge
- **Share & Print** - Easy distribution options

### ⚙️ Settings
- **Business Profile** - Manage company information and contact details
- **Logo Management** - Upload and manage business logo
- **Bank Details** - Store payment information for invoices
- **Currency Selection** - Choose from 10+ currencies with search
- **Default Notes** - Set default invoice notes with templates
- **Dark Mode** - Toggle between light and dark themes (UI ready)

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **UI Library:** [React 18](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Fonts:** Geist Sans & Geist Mono
- **Language:** JavaScript (ES6+)

## 📁 Project Structure

```
instantInvoice/
├── app/
│   ├── dashboard/
│   │   ├── new/                    # Create new invoice
│   │   ├── preview/
│   │   │   └── [invoice_id]/
│   │   │       ├── page.jsx        # Invoice preview
│   │   │       └── receipt/
│   │   │           └── page.jsx    # Payment receipt
│   │   ├── settings/
│   │   │   ├── profile/            # Business profile
│   │   │   ├── logo/               # Logo management
│   │   │   ├── bank/               # Bank details
│   │   │   ├── currency/           # Currency selection
│   │   │   ├── notes/              # Default notes
│   │   │   └── page.jsx            # Settings home
│   │   └── page.jsx                # Dashboard home
│   ├── onboarding/
│   │   └── page.jsx                # Business registration
│   ├── globals.css                 # Global styles & theme
│   ├── layout.jsx                  # Root layout
│   └── page.jsx                    # Landing/onboarding screen
├── public/
│   └── onboarding.png              # Hero image
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd instantInvoice
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🎨 Design System

### Colors
- **Primary:** `#f9f506` (Yellow) - Main brand color for CTAs and highlights
- **Accent:** `#11dcdc` (Teal) - Secondary accent for icons and states
- **Background:** `#f8f8f5` (Light Gray) - App background
- **Text:** `#171717` (Dark Gray) - Primary text color

### Typography
- **Headings:** Geist Sans (Bold)
- **Body:** Geist Sans (Regular/Medium)
- **Code:** Geist Mono

### Components
- **Rounded Corners:** Generous border radius (xl, 2xl, 3xl)
- **Shadows:** Subtle shadows for depth
- **Icons:** Lucide React icons throughout
- **Spacing:** Consistent padding and margins

## 📱 Responsive Design

The application is built with a mobile-first approach:
- **Mobile:** Full-screen experience with optimized touch targets
- **Tablet:** Centered layout (max-width: 768px)
- **Desktop:** Centered tablet view for consistency

## 🔄 Navigation Flow

```
Landing Page (/)
    ↓
Onboarding (/onboarding)
    ↓
Dashboard (/dashboard)
    ├→ New Invoice (/dashboard/new)
    ├→ Invoice Preview (/dashboard/preview/[id])
    │   └→ Receipt (/dashboard/preview/[id]/receipt)
    └→ Settings (/dashboard/settings)
        ├→ Business Profile (/dashboard/settings/profile)
        ├→ Logo Management (/dashboard/settings/logo)
        ├→ Bank Details (/dashboard/settings/bank)
        ├→ Currency (/dashboard/settings/currency)
        └→ Default Notes (/dashboard/settings/notes)
```

## 🎯 Key Features Implementation

### Horizontal Scrolling Cards
Financial summary cards use `overflow-x-auto` with `snap-x snap-mandatory` for smooth scrolling.

### Dynamic Line Items
Invoice line items can be added/removed with automatic total calculations using React state.

### Scalloped Receipt Edge
Payment receipt uses an array of rounded divs to create a ticket-style perforated edge.

### Responsive Forms
All forms use consistent styling with focus states and proper input validation.

## 📝 Future Enhancements

- [ ] Database integration (Supabase/PostgreSQL)
- [ ] User authentication
- [ ] PDF generation and download
- [ ] Email invoice sending
- [ ] Client management system
- [ ] Invoice templates
- [ ] Multi-currency support with exchange rates
- [ ] Payment gateway integration
- [ ] Analytics and reporting
- [ ] Dark mode implementation

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ using Next.js and Tailwind CSS

---

**InstantInvoice v1.0.2** © 2024 OpenInvoice Inc.
