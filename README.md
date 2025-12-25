# InstantInvoice 📄

A professional, local-first invoice management application built with Next.js. Create, manage, and track invoices with a beautiful, responsive interface optimized for mobile and tablet devices.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![IndexedDB](https://img.shields.io/badge/Storage-IndexedDB-orange)

## 💡 How it Works

InstantInvoice is designed to be a lightweight but powerful tool for small businesses and freelancers. It operates as a **Progressive Web App (PWA)**, meaning all your data stays strictly on your device.

1.  **Quick Onboarding**: When you first open the app, you'll set up your business profile (name, email, and location). This information is used to automatically populate your invoices.
2.  **Effortless Dashboard**: The dashboard provides a high-level view of your financial health. You can switch between years to see past performance and monitor your total revenue, pending payments, and canceled orders.
3.  **Invoice Lifecycle**:
    *   **Create**: Add clients and line items with automatic tax and total calculations.
    *   **Preview**: View professional, print-ready invoices.
    *   **Management**: Mark invoices as paid to instantly generate a payment receipt.
4.  **Data Privacy & Safety**: Because the app uses local storage (IndexedDB), you never have to worry about your data being stored on a random server. In the **Data Management** settings, you can monitor your storage usage and even delete entire years of data to keep your app running fast.

## 🛠️ Technical Side

InstantInvoice is built using a modern, high-performance stack that prioritizes speed and offline capability.

### 🏗️ Architecture
*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router) for a robust routing system and optimized performance.
*   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) for a sleek, responsive design system that feels premium on any screen size.
*   **Icons**: [Lucide React](https://lucide.dev/) for consistent, lightweight iconography.

### 💾 Data Persistence (The Local Database)
The system uses **IndexedDB**, a low-level API for client-side storage of significant amounts of structured data.
*   **Persistent Storage**: Unlike `localStorage`, IndexedDB can store large amounts of data (like logos and thousands of invoices) persistently.
*   **Custom DB Utility**: A centralized helper (`lib/db.js`) manages all CRUD operations, ensuring data integrity and simplified access.
*   **Manual Size Calculation**: Since browser storage estimates can be unreliable on mobile, we implemented a manual scanning algorithm that stringifies and measures data size for 100% accurate reporting in the settings menu.

### ⚡ Performance Optimizations
*   **Infinite Scrolling**: The dashboard implements a custom `IntersectionObserver` logic to load invoices in batches of 10. This ensures the app remains snappy even with thousands of records.
*   **Dynamic Filtering**: Statistics and lists are filtered on-the-fly using optimized React `useMemo` and `useCallback` patterns, providing instant feedback when switching years or tabs.
*   **Asset Management**: Images (like business logos) are stored as Base64 strings directly in the database, eliminating the need for external hosting.

## ✨ Key Features

### 📊 Dashboard & Analytics
- **Annual Comparison** - Filter statistics by year to track growth.
- **Financial Cards** - Horizontally scrollable summary of Paid, Pending, and Canceled totals.
- **Infinite Scroll** - Seamlessly browse through large invoice histories.

### 🧾 Smart Invoicing
- **Dynamic Line Items** - Real-time calculation of subtotals and taxes.
- **Bank Details Integration** - Automatically attach payment info to every invoice.
- **Status Tracking** - Clear visual badges for Paid, Overdue, and Draft statuses.

### ⚙️ Data Management
- **Manual Cleanup** - Ability to delete all invoices for a specific year.
- **Storage Diagnostics** - Real-time monitoring of device storage utilization.

## 📁 Project Structure

```
instantInvoice/
├── app/
│   ├── dashboard/
│   │   ├── new/                    # Create new invoice
│   │   ├── preview/[id]/           # Invoice preview & receipt
│   │   ├── settings/               # Profile, Logo, Bank, Notes, Storage
│   │   └── page.jsx                # Analytics Dashboard
│   ├── onboarding/                 # Initial setup flow
│   ├── globals.css                 # Design system & tokens
│   └── layout.jsx                  # Root layout
├── lib/
│   └── db.js                       # IndexedDB implementation
└── public/                         # Static assets
```

## 🚀 Getting Started

1.  **Clone & Install**
    ```bash
    npm install
    ```
2.  **Dev Mode**
    ```bash
    npm run dev
    ```
3.  **Build**
    ```bash
    npm run build
    ```

---

**Built by Antigravity** • Dedicated to Advanced Agentic Coding.
