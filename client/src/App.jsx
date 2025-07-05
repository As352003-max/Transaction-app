import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import BudgetsPage from "./pages/BudgetsPage";
import { useEffect, useState } from "react";

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`relative px-4 py-2 rounded-md transition-all font-medium
        ${isActive ? "text-indigo-700 dark:text-indigo-300" : "text-gray-700 dark:text-gray-200"}
        hover:bg-indigo-100 dark:hover:bg-gray-700 hover:text-indigo-700 dark:hover:text-indigo-300`}
    >
      {children}
      {isActive && (
        <span className="absolute left-1/2 -bottom-1 w-2/3 h-1 bg-indigo-500 dark:bg-indigo-300 rounded-full transform -translate-x-1/2 animate-pulse"></span>
      )}
    </Link>
  );
}

function DarkModeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-indigo-200 dark:hover:bg-indigo-600 transition"
      title="Toggle dark mode"
    >
      {dark ? (
        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14A6 6 0 0110 4a6 6 0 000 12z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
}


function AnimatedBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background: "linear-gradient(120deg, #a5b4fc 0%, #fbc2eb 100%)",
        opacity: 0.1,
        backgroundSize: "200% 200%",
        animation: "gradientMove 10s ease-in-out infinite alternate"
      }}
    />
  );
}

function App() {
  return (
    <Router>
      <AnimatedBackground />

      <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white flex flex-col font-sans transition-colors duration-500 relative z-10">
       
        <header className="bg-white dark:bg-gray-800 shadow-md p-4 sticky top-0 z-20 transition-colors duration-500">
          <nav className="container mx-auto flex justify-between items-center">
            <Link
              to="/"
              className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-300 tracking-tight flex items-center gap-2"
            >
              <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M7 6h10M7 18h10" />
              </svg>
              Finance Visualizer
            </Link>

            <div className="flex items-center space-x-2">
              <NavLink to="/">Dashboard</NavLink>
              <NavLink to="/transactions">Transactions</NavLink>
              <NavLink to="/budgets">Budgets</NavLink>
              <DarkModeToggle />
            </div>
          </nav>
        </header>

       
        <main className="flex-grow container mx-auto p-4">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
          </Routes>
        </main>

       
        <footer className="bg-gray-200 dark:bg-gray-950 text-center p-4 text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} <span className="font-semibold text-indigo-600 dark:text-indigo-300">Finance Visualizer</span>. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}

export default App;
