import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { format, parseISO, eachMonthOfInterval, startOfYear, endOfYear } from "date-fns";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = [
    "#6366f1", "#22d3ee", "#f59e42", "#ef4444", "#10b981", "#f472b6", "#facc15", "#a3e635"
];

const CARD_ANIMATION = {
    initial: { opacity: 0, y: 30, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: 30, scale: 0.98, transition: { duration: 0.3 } }
};

export default function Dashboard({ transactions, budgets }) {
    const totalBalance = transactions.reduce((sum, t) => {
        return t.type === "income" ? sum + t.amount : sum - t.amount;
    }, 0);

    const monthlyExpenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, transaction) => {
            const month = format(parseISO(transaction.date), "yyyy-MM");
            acc[month] = (acc[month] || 0) + transaction.amount;
            return acc;
        }, {});

    const currentYear = new Date().getFullYear();
    const startOfCurrentYear = startOfYear(new Date(currentYear, 0, 1));
    const endOfCurrentYear = endOfYear(new Date(currentYear, 11, 31));

    const monthlyData = eachMonthOfInterval({
        start: startOfCurrentYear,
        end: endOfCurrentYear,
    }).map((date) => {
        const monthKey = format(date, "yyyy-MM");
        const monthLabel = format(date, "MMM yy");
        return {
            month: monthLabel,
            expenses: monthlyExpenses[monthKey] || 0,
        };
    });

    const categorySpending = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, transaction) => {
            acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
            return acc;
        }, {});

    const pieChartData = Object.entries(categorySpending).map(([category, amount]) => ({
        name: category,
        value: amount,
    }));

    const currentMonthKey = format(new Date(), "yyyy-MM");
    const currentMonthExpensesByCategory = transactions
        .filter(
            (t) =>
                t.type === "expense" &&
                format(parseISO(t.date), "yyyy-MM") === currentMonthKey
        )
        .reduce((acc, transaction) => {
            acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
            return acc;
        }, {});

    const budgetComparisonData = budgets
        .filter((b) => b.month === currentMonthKey)
        .map((budget) => {
            const actualSpent = currentMonthExpensesByCategory[budget.category] || 0;
            return {
                category: budget.category,
                budgeted: budget.limit,
                actual: actualSpent,
                remaining: budget.limit - actualSpent,
                overBudget: actualSpent > budget.limit,
            };
        });

    const [activeIndex, setActiveIndex] = useState(null);
    const [barActiveIndex, setBarActiveIndex] = useState(null);

    const cardBg =
        "bg-gradient-to-br from-white/80 via-blue-50/80 to-indigo-100/80 backdrop-blur-md shadow-xl border border-indigo-100";

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4 animate-fade-in">
                <motion.div
                    className={`col-span-full lg:col-span-1 rounded-2xl ${cardBg} relative overflow-hidden`}
                    {...CARD_ANIMATION}
                >
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-indigo-400/30 to-blue-300/10 rounded-full blur-2xl z-0" />
                    <h3 className="text-lg font-bold text-indigo-700 mb-2 relative z-10 ">Total Balance</h3>
                    <motion.p
                        className={`text-3xl font-extrabold drop-shadow-lg ${
                            totalBalance >= 0 ? "text-emerald-500" : "text-rose-500"
                        } relative z-10`}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    >
                        ₹ {totalBalance.toFixed(2)}
                    </motion.p>
                </motion.div>

                <motion.div
                    className={`col-span-full md:col-span-2 rounded-2xl ${cardBg} relative overflow-hidden`}
                    {...CARD_ANIMATION}
                    transition={{ delay: 0.1 }}
                >
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-blue-400/20 to-indigo-200/10 rounded-full blur-2xl z-0" />
                    <h3 className="text-lg font-bold text-indigo-700 mb-2 relative z-10">
                        Monthly Expenses (Current Year)
                    </h3>
                    <div className="h-64 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={monthlyData}
                                onMouseMove={(state) => setBarActiveIndex(state?.activeTooltipIndex)}
                                onMouseLeave={() => setBarActiveIndex(null)}
                            >
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{ background: "#fff", borderRadius: 8, border: "none", boxShadow: "0 2px 8px #0001" }}
                                    cursor={{ fill: "#6366f122" }}
                                />
                                <Legend />
                                <Bar
                                    dataKey="expenses"
                                    fill="#6366f1"
                                    radius={[8, 8, 0, 0]}
                                    isAnimationActive={true}
                                    animationDuration={900}
                                >
                                    {monthlyData.map((_, idx) => (
                                        <Cell
                                            key={`bar-${idx}`}
                                            fill={barActiveIndex === idx ? "#22d3ee" : "#6366f1"}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    className={`col-span-full lg:col-span-1 rounded-2xl ${cardBg} relative overflow-hidden`}
                    {...CARD_ANIMATION}
                    transition={{ delay: 0.2 }}
                >
                    <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-indigo-200/10 rounded-full blur-2xl z-0" />
                    <h3 className="text-lg font-bold text-indigo-700 mb-2 relative z-10">
                        Spending by Category
                    </h3>
                    <div className="h-64 flex items-center justify-center relative z-10">
                        {pieChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={90}
                                        innerRadius={40}
                                        fill="#6366f1"
                                        dataKey="value"
                                        label={({ name, percent }) =>
                                            `${name} (${(percent * 100).toFixed(0)}%)`
                                        }
                                        isAnimationActive={true}
                                        animationDuration={900}
                                        activeIndex={activeIndex}
                                        activeShape={(props) => (
                                            <g>
                                                <circle
                                                    cx={props.cx}
                                                    cy={props.cy}
                                                    r={props.outerRadius + 8}
                                                    fill="#fff"
                                                    fillOpacity={0.18}
                                                />
                                                <Pie {...props} />
                                            </g>
                                        )}
                                        onMouseEnter={(_, idx) => setActiveIndex(idx)}
                                        onMouseLeave={() => setActiveIndex(null)}
                                    >
                                        {pieChartData.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                                stroke={activeIndex === index ? "#222" : "#fff"}
                                                strokeWidth={activeIndex === index ? 3 : 1}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background: "#fff",
                                            borderRadius: 8,
                                            border: "none",
                                            boxShadow: "0 2px 8px #0001",
                                        }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-500 text-center">No expense data for categories yet.</p>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    className={`col-span-full rounded-2xl ${cardBg} relative overflow-hidden`}
                    {...CARD_ANIMATION}
                    transition={{ delay: 0.3 }}
                >
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-tr from-emerald-400/20 to-indigo-200/10 rounded-full blur-2xl z-0" />
                    <h3 className="text-lg font-bold text-indigo-700 mb-2 relative z-10">
                        Budget vs. Actual Spending (Current Month)
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 relative z-10">
                        For {format(new Date(), "MMMM yyyy")}
                    </p>
                    <AnimatePresence>
                        {budgetComparisonData.length > 0 ? (
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                {budgetComparisonData.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className={`p-4 rounded-xl shadow-lg border-2 transition-all duration-300 relative z-10 ${
                                            item.overBudget
                                                ? "border-rose-400 bg-rose-50/80 animate-pulse"
                                                : "border-emerald-200 bg-emerald-50/80"
                                        }`}
                                        whileHover={{ scale: 1.04, boxShadow: "0 4px 24px #0002" }}
                                    >
                                        <h4 className="font-semibold text-gray-800 mb-1">{item.category}</h4>
                                        <p className="text-gray-600">Budgeted: <span className="font-bold">₹ {item.budgeted.toFixed(2)}</span></p>
                                        <p className="text-gray-600">Actual: <span className="font-bold">₹ {item.actual.toFixed(2)}</span></p>
                                        <p
                                            className={
                                                item.overBudget
                                                    ? "text-rose-600 font-semibold mt-1"
                                                    : "text-emerald-600 font-semibold mt-1"
                                            }
                                        >
                                            {item.overBudget
                                                ? `Over: ₹ ${(item.actual - item.budgeted).toFixed(2)}`
                                                : `Remaining: ₹ ${item.remaining.toFixed(2)}`}
                                        </p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.p
                                className="text-gray-500 text-center relative z-10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                No budgets set for the current month. Go to the Budgets page to add some!
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}

