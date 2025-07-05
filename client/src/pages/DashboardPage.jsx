import { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard";
import { getTransactions, getBudgets } from "../api/api";
import { AlertTriangle, Sparkles, ArrowRightCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
    const [transactions, setTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const transactionsRes = await getTransactions();
                const budgetsRes = await getBudgets();
                setTransactions(transactionsRes.data);
                setBudgets(budgetsRes.data);
                setError(null);
            } catch (err) {
                setError("Failed to load dashboard data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const animatedBg =
        "bg-gradient-to-br from-indigo-700 via-fuchsia-500 to-yellow-400 animate-gradient-move";

    if (loading) {
        return (
            <div className={`flex flex-col justify-center items-center h-64 rounded-2xl shadow-2xl ${animatedBg} relative overflow-hidden`}>
                <Sparkles className="absolute top-6 right-8 text-yellow-200 animate-twinkle" size={48} />
                <p className="text-2xl font-bold tracking-wide text-white animate-fade-in-up">Loading your dashboard...</p>
                <div className="mt-6 flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-white animate-bounce" />
                    <div className="w-3 h-3 rounded-full bg-fuchsia-200 animate-bounce delay-150" />
                    <div className="w-3 h-3 rounded-full bg-yellow-200 animate-bounce delay-300" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto my-8 p-6 bg-gradient-to-r from-red-400 via-white to-yellow-200 border-2 border-red-500 text-red-800 rounded-2xl flex items-center space-x-4 shadow-2xl animate-fade-in-up relative overflow-hidden">
                <AlertTriangle className="h-8 w-8 text-red-600 animate-shake" />
                <p className="font-semibold">{error}</p>
                <Sparkles className="absolute bottom-2 right-2 text-yellow-300 animate-twinkle" size={28} />
            </div>
        );
    }

    if (transactions.length === 0 && budgets.length === 0) {
        return (
            <div className={`max-w-2xl mx-auto my-16 p-10 rounded-3xl shadow-2xl text-center relative overflow-hidden ${animatedBg} animate-fade-in-up`}>
                <Sparkles className="absolute top-8 left-8 text-yellow-200 animate-twinkle" size={56} />
                <h2 className="text-4xl font-extrabold mb-4 text-white drop-shadow-lg animate-fade-in-down flex items-center justify-center gap-2">
                    Welcome to your <span className="bg-white/20 px-2 py-1 rounded-xl text-fuchsia-100">Finance Visualizer</span>!
                </h2>
                <p className="text-white/90 mb-10 text-lg animate-fade-in">
                    <span className="font-semibold">No transactions or budgets yet.</span><br />
                    <span className="text-yellow-100">Start by adding some financial data to see your dashboard come to life!</span>
                </p>
                <div className="flex justify-center gap-8">
                    <Link
                        to="/transactions"
                        className="group px-10 py-4 bg-white text-fuchsia-700 font-bold rounded-xl shadow-xl hover:bg-fuchsia-100 hover:scale-105 transition-all duration-300 animate-pop flex items-center gap-2 border-2 border-fuchsia-200"
                    >
                        Add First Transaction
                        <ArrowRightCircle className="group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                    <Link
                        to="/budgets"
                        className="group px-10 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-fuchsia-700 hover:scale-105 transition-all duration-300 animate-pop-delay flex items-center gap-2"
                    >
                        Set First Budget
                        <ArrowRightCircle className="group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                </div>
                <Sparkles className="absolute bottom-8 right-8 text-yellow-100 animate-twinkle" size={56} />
            </div>
        );
    }

    return (
        <div className={`dashboard-page min-h-screen py-12 px-4 ${animatedBg} animate-fade-in-up relative overflow-hidden`}>
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* Decorative blurred circles */}
                <div className="absolute top-10 left-10 w-56 h-56 bg-fuchsia-400 opacity-30 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-10 right-10 w-72 h-72 bg-yellow-300 opacity-20 rounded-full blur-3xl animate-float-reverse" />
            </div>
            <div className="relative z-10">
                <h1 className="text-5xl font-extrabold mb-10 text-white drop-shadow-2xl tracking-tight animate-fade-in-down flex items-center gap-3">
                    <Sparkles className="text-yellow-200 animate-twinkle" size={40} />
                    Your Financial Overview
                </h1>
                <div className="transition-transform duration-500 hover:scale-102 bg-white/80 rounded-2xl shadow-2xl p-6 animate-fade-in-up">
                    <Dashboard transactions={transactions} budgets={budgets} />
                </div>
            </div>
        </div>
    );
}
