import { useState, useEffect } from 'react';

const categories = [
    'Food', 'Transport', 'Utilities', 'Shopping', 'Entertainment', 'Healthcare',
    'Education', 'Misc Expense'
];

export default function BudgetForm({ onSave, budgetToEdit, onCancel }) {
    const [form, setForm] = useState({
        category: '',
        limit: '',
        month: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (budgetToEdit) {
            setForm({
                category: budgetToEdit.category || '',
                limit: budgetToEdit.limit || '',
                month: budgetToEdit.month || '',
            });
        } else {
            const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
            setForm({
                category: '',
                limit: '',
                month: currentMonth,
            });
        }
    }, [budgetToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const validate = () => {
        const newErrors = {};
        if (!form.category) {
            newErrors.category = 'Category is required';
        }
        if (!form.limit || isNaN(form.limit) || parseFloat(form.limit) <= 0) {
            newErrors.limit = 'Budget limit must be a positive number';
        }
        if (!form.month) {
            newErrors.month = 'Month is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSave({
                ...form,
                limit: parseFloat(form.limit),
            });
        }
    };

    const inputClasses = (hasError) =>
        `block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 sm:text-base bg-white transition-all duration-200 ${
            hasError ? 'border-red-500' : 'border-gray-300'
        }`;

    const labelClasses = "block text-base font-semibold text-gray-800 mb-2";
    const errorTextClasses = "text-red-500 text-sm mt-1";

    return (
        <div className="max-w-md mx-auto bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-2xl border border-indigo-100">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center flex items-center justify-center gap-2">
                <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3zm0 0V4m0 12v4m8-8h-4m-8 0H4" />
                </svg>
                {budgetToEdit ? 'Edit Budget' : 'Set New Budget'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="category" className={labelClasses}>Category</label>
                    <select
                        id="category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className={inputClasses(errors.category)}
                    >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    {errors.category && <p className={errorTextClasses}>{errors.category}</p>}
                </div>

                <div>
                    <label htmlFor="limit" className={labelClasses}>Budget Limit <span className="text-indigo-500 font-bold">(₹)</span></label>
                    <input
                        id="limit"
                        name="limit"
                        type="number"
                        step="0.01"
                        value={form.limit}
                        onChange={handleChange}
                        className={inputClasses(errors.limit)}
                        placeholder="Enter amount"
                        min="0"
                    />
                    {errors.limit && <p className={errorTextClasses}>{errors.limit}</p>}
                </div>

                <div>
                    <label htmlFor="month" className={labelClasses}>Month <span className="text-indigo-500 font-bold">(YYYY-MM)</span></label>
                    <input
                        id="month"
                        name="month"
                        type="month"
                        value={form.month}
                        onChange={handleChange}
                        className={inputClasses(errors.month)}
                    />
                    {errors.month && <p className={errorTextClasses}>{errors.month}</p>}
                </div>

                <div className="flex justify-end space-x-3 mt-8">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-200 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold rounded-lg shadow hover:from-indigo-600 hover:to-indigo-800 transition-all duration-200 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {budgetToEdit ? 'Update Budget' : 'Set Budget'}
                    </button>
                </div>
            </form>
        </div>
    );
}