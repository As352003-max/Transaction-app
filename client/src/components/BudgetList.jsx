import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

export default function BudgetList({ budgets, onEdit, onDelete }) {
    const [hoveredRow, setHoveredRow] = useState(null);

    return (
        <div className="overflow-x-auto bg-gradient-to-br from-indigo-100 via-white to-pink-100 rounded-2xl shadow-2xl p-4 transition-all duration-500">
            <table className="min-w-full divide-y divide-indigo-200">
                <thead className="bg-gradient-to-r from-indigo-500 to-pink-400">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow-lg">
                            Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow-lg">
                            Month
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider drop-shadow-lg">
                            Limit
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-white uppercase tracking-wider drop-shadow-lg">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-indigo-100">
                    {budgets.map((budget, idx) => (
                        <tr
                            key={budget._id}
                            className={`transition-all duration-300 ${
                                hoveredRow === idx
                                    ? "bg-gradient-to-r from-indigo-50 to-pink-50 scale-[1.01] shadow-lg"
                                    : "bg-white"
                            }`}
                            onMouseEnter={() => setHoveredRow(idx)}
                            onMouseLeave={() => setHoveredRow(null)}
                        >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-700">
                                <span className="inline-block animate-fade-in">{budget.category}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-pink-700 font-medium">
                                <span className="inline-block animate-fade-in">{budget.month}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-bold">
                                <span className="inline-block animate-fade-in">₹ {budget.limit.toFixed(2)}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onEdit(budget)}
                                    className="text-indigo-600 hover:text-white hover:bg-indigo-500 mr-3 p-2 rounded-full shadow transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    title="Edit"
                                >
                                    <PencilIcon className="h-5 w-5 inline-block" />
                                    <span className="sr-only">Edit</span>
                                </button>
                                <button
                                    onClick={() => onDelete(budget._id)}
                                    className="text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-full shadow transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-300"
                                    title="Delete"
                                >
                                    <Trash2Icon className="h-5 w-5 inline-block" />
                                    <span className="sr-only">Delete</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                    {budgets.length === 0 && (
                        <tr>
                            <td colSpan={4} className="text-center py-8 text-gray-400 animate-pulse">
                                No budgets found. Add a new budget to get started!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* Animations */}
            <style>
                {`
                    @keyframes fade-in {
                        from { opacity: 0; transform: translateY(10px);}
                        to { opacity: 1; transform: translateY(0);}
                    }
                    .animate-fade-in {
                        animation: fade-in 0.6s cubic-bezier(.4,0,.2,1) both;
                    }
                `}
            </style>
        </div>
    );
}