# Personal Finance Visualizer

A full-stack web application for tracking personal finances, built with **React (Vite)**, **Node.js (Express)**, and **MongoDB**, styled with **Tailwind CSS**. This application allows users to manage transactions, categorize spending, set budgets, and visualize their financial health through interactive charts and summary dashboards.

---

## Table of Contents

- [Features by Stage](#features-by-stage)
- [Technologies Used](#technologies-used)
- [Setup & Installation](#setup--installation)
    - [Prerequisites](#prerequisites)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
    - [Running the Application](#running-the-application)
- [API Endpoints (Overview)](#api-endpoints-overview)

---

## Features by Stage

This project is developed in stages, progressively adding functionality.

### Stage 1: Basic Transaction Tracking

- **Add/Edit/Delete Transactions:** Users can input, modify, and remove financial transactions.
- **Transaction List View:** A clear, tabular display of all recorded transactions.
- **Monthly Expenses Bar Chart:** Visual representation of spending trends over recent months.
- **Basic Form Validation:** Client-side validation ensures data integrity (e.g., positive amount, valid date).

### Stage 2: Categories & Dashboard Enhancements

- **Predefined Categories:** Assign transactions to categories (e.g., Food, Transport, Utilities, Salary).
- **Category-wise Pie Chart:** Visualizes the breakdown of expenses by category.
- **Dashboard Summary Cards:** Key financial metrics at a glance:
    - Total Expenses (current month)
    - Total Income (current month)
    - Net Savings/Loss (current month)
- **Recent Transactions:** Quick list of the most recent transactions.

### Stage 3: Budgeting & Insights

- **Set Monthly Category Budgets:** Define monthly spending limits for categories.
- **Budget vs. Actual Comparison:** Compare budgeted amounts against actual spending, highlighting remaining budget or overspending.
- **Simple Spending Insights:** Immediate feedback on budget adherence.

---

## Technologies Used

### Frontend (`client/`)

- **React:** UI library
- **Vite:** Fast build tool
- **Tailwind CSS:** Utility-first CSS framework
- **Recharts:** Charting library for React
- **Axios:** HTTP client
- **React Router DOM:** Routing
- **date-fns:** Date utilities
- **lucide-react:** Icon set

### Backend (`server/`)

- **Node.js:** JavaScript runtime
- **Express.js:** Web framework
- **Mongoose:** MongoDB ODM
- **MongoDB:** NoSQL database
- **CORS:** Cross-Origin Resource Sharing middleware
- **dotenv:** Environment variable loader

---

## Setup & Installation

### Prerequisites

- **Node.js** (v18 or higher): [Download & Install](https://nodejs.org/)
- **MongoDB:**
    - Local: [Install MongoDB Community Edition](https://www.mongodb.com/try/download/community)
    - Cloud: [MongoDB Atlas (Recommended)](https://www.mongodb.com/cloud/atlas/register)

---

### Backend Setup

1. **Navigate to the server directory:**
     ```sh
     cd personal-finance-app/server
     ```
2. **Install dependencies:**
     ```sh
     npm install
     ```
3. **Create a `.env` file** in the server directory:
     ```
     MONGO_URI="mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority"
     PORT=5000
     ```
     Replace the placeholder with your actual MongoDB URI.

---

### Frontend Setup

1. **Navigate to the client directory:**
     ```sh
     cd personal-finance-app/client
     ```
2. **Clean and reinstall dependencies** (important for Tailwind CSS issues):

     - **On Windows (Command Prompt, as Administrator):**
         ```sh
         rmdir /s /q node_modules
         del package-lock.json
         ```
     - **On Windows (PowerShell, as Administrator):**
         ```sh
         Remove-Item -Recurse -Force node_modules
         Remove-Item package-lock.json
         ```
     - **On macOS/Linux:**
         ```sh
         rm -rf node_modules package-lock.json
         ```

3. **Reinstall dependencies:**
     ```sh
     npm install
     ```

4. **Verify configuration files** for ES Modules:

     - `client/vite.config.js`
     - `client/tailwind.config.js`
     - `client/postcss.config.js`

     Example for `vite.config.js`:
     ```js
     import { defineConfig } from 'vite';
     import react from '@vitejs/plugin-react';
     import path from 'path';
     import { fileURLToPath } from 'url';
     import { dirname } from 'path';

     const __filename = fileURLToPath(import.meta.url);
     const __dirname = dirname(__filename);

     export default defineConfig({
         plugins: [react()],
         resolve: {
             alias: {
                 "@": path.resolve(__dirname, "./src"),
             },
         },
     });
     ```

     Example for `tailwind.config.js`:
     ```js
     /** @type {import('tailwindcss').Config} */
     import tailwindcssAnimate from "tailwindcss-animate";

     export default {
         darkMode: ["class"],
         content: [
             './pages/**/*.{js,jsx}',
             './components/**/*.{js,jsx}',
             './app/**/*.{js,jsx}',
             './src/**/*.{js,jsx}',
         ],
         // ...rest of config
         plugins: [tailwindcssAnimate],
     };
     ```

     Example for `postcss.config.js`:
     ```js
     export default {
         plugins: {
             tailwindcss: {},
             autoprefixer: {},
         },
     };
     ```

5. **Verify `client/src/index.css`** (no `@apply border-border;` or `@import "tailwindcss";`):

     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;

     @layer base {
         :root {
             --background: 0 0% 100%;
             --foreground: 222.2 84% 4.9%;
             /* ...rest of variables... */
             --radius: 0.5rem;
         }
         .dark {
             --background: 222.2 84% 4.9%;
             --foreground: 210 40% 98%;
             /* ...rest of dark variables... */
         }
     }

     @layer base {
         * {
             /* No global border-border application here */
         }
         body {
             @apply bg-background text-foreground;
         }
     }
     ```

---

### Running the Application

1. **Start MongoDB:** Ensure your MongoDB instance (local or Atlas) is running and accessible via the `MONGO_URI` in your `server/.env` file.
2. **Start Backend Server:**
     ```sh
     cd personal-finance-app/server
     npm start # Or node index.js
     ```
     You should see "MongoDB connected successfully" and "Server running on port 5000".
3. **Start Frontend Development Server:**
     ```sh
     cd personal-finance-app/client
     npm run dev
     ```
     This will usually open your application in your browser at [http://localhost:5173](http://localhost:5173).

---

## API Endpoints (Overview)

The backend provides the following RESTful API endpoints:

### Transactions

- `POST /api/transactions` — Add a new transaction
- `GET /api/transactions` — Retrieve all transactions
- `PUT /api/transactions/:id` — Update an existing transaction
- `DELETE /api/transactions/:id` — Delete a transaction

### Budgets

- `POST /api/budgets` — Set a new budget
- `GET /api/budgets` — Retrieve all budgets
- `PUT /api/budgets/:id` — Update an existing budget
- `DELETE /api/budgets/:id` — Delete a budget

---