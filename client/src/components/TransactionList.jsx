import { format, parseISO } from "date-fns";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

export default function TransactionList({ transactions, onEdit, onDelete }) {
    const [hoveredRow, setHoveredRow] = useState(null);

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-2xl">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Description</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction, idx) => (
                        <tr
                            key={transaction._id}
                            className={`transition-all duration-300 ${
                                hoveredRow === idx
                                    ? "bg-indigo-50 scale-[1.01] shadow-md"
                                    : "bg-white"
                            }`}
                            onMouseEnter={() => setHoveredRow(idx)}
                            onMouseLeave={() => setHoveredRow(null)}
                            style={{
                                transition: "background 0.3s, box-shadow 0.3s, transform 0.2s",
                            }}
                        >
                            <td
                                className={`px-6 py-4 whitespace-nowrap text-sm font-semibold transition-colors duration-300 ${
                                    transaction.type === "income"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                ₹ {transaction.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span
                                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                        transaction.type === "income"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    } transition-colors duration-300`}
                                >
                                    {transaction.type.charAt(0).toUpperCase() +
                                        transaction.type.slice(1)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span className="inline-block px-2 py-1 rounded bg-blue-50 text-blue-700 font-medium">
                                    {transaction.category}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {format(parseISO(transaction.date), "PPP")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {transaction.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onEdit(transaction)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-3 p-1 rounded-md hover:bg-indigo-100 transition-all duration-200 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                                    title="Edit"
                                    style={{ transform: hoveredRow === idx ? "scale(1.1)" : "scale(1)" }}
                                >
                                    <PencilIcon className="h-4 w-4 inline-block transition-transform duration-200" />
                                    <span className="sr-only">Edit</span>
                                </button>
                                <button
                                    onClick={() => onDelete(transaction._id)}
                                    className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-100 transition-all duration-200 focus:ring-2 focus:ring-red-300 focus:outline-none"
                                    title="Delete"
                                    style={{ transform: hoveredRow === idx ? "scale(1.1)" : "scale(1)" }}
                                >
                                    <Trash2Icon className="h-4 w-4 inline-block transition-transform duration-200" />
                                    <span className="sr-only">Delete</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                    {transactions.length === 0 && (
                        <tr>
                            <td colSpan={6} className="py-8 text-center text-gray-400 text-lg animate-pulse">
                                No transactions found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}