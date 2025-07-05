import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const categories = [
    'Food', 'Transport', 'Utilities', 'Shopping', 'Entertainment', 'Healthcare',
    'Education', 'Salary', 'Investment', 'Other Income', 'Misc Expense', 'Misc Income'
];

const transactionTypes = ['expense', 'income'];

export default function TransactionForm({ onSave, transactionToEdit, onCancel }) {
    const [form, setForm] = useState({
        amount: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
        category: '',
        type: 'expense'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (transactionToEdit) {
            setForm({
                amount: transactionToEdit.amount || '',
                date: transactionToEdit.date ? format(new Date(transactionToEdit.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
                description: transactionToEdit.description || '',
                category: transactionToEdit.category || '',
                type: transactionToEdit.type || 'expense'
            });
        } else {
            setForm({
                amount: '',
                date: format(new Date(), 'yyyy-MM-dd'),
                description: '',
                category: '',
                type: 'expense'
            });
        }
    }, [transactionToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const validate = () => {
        const newErrors = {};
        if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) {
            newErrors.amount = 'Amount must be a positive number';
        }
        if (!form.date) {
            newErrors.date = 'Date is required';
        }
        if (!form.category) {
            newErrors.category = 'Category is required';
        }
        if (!form.type) {
            newErrors.type = 'Type is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSave({
                ...form,
                amount: parseFloat(form.amount),
                date: new Date(form.date).toISOString(),
            });
        }
    };

    const inputClasses = (hasError) =>
        `block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 text-base transition
        ${hasError ? 'border-red-400 ring-red-200' : 'border-gray-300'}`;

    const labelClasses = "block text-base font-semibold text-indigo-700 mb-2";
    const errorTextClasses = "text-red-500 text-sm mt-1";
    const cardClasses = "max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-indigo-100";
    const gradientHeader = "text-2xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent";

    return (
        <div className={cardClasses}>
            <div className={gradientHeader}>
                {transactionToEdit ? 'Edit Transaction' : 'Add New Transaction'}
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="amount" className={labelClasses}>Amount</label>
                    <input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        value={form.amount}
                        onChange={handleChange}
                        className={inputClasses(errors.amount)}
                        placeholder="Enter amount"
                    />
                    {errors.amount && <p className={errorTextClasses}>{errors.amount}</p>}
                </div>

                <div>
                    <label htmlFor="type" className={labelClasses}>Type</label>
                    <select
                        id="type"
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className={inputClasses(errors.type)}
                    >
                        {transactionTypes.map(type => (
                            <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                        ))}
                    </select>
                    {errors.type && <p className={errorTextClasses}>{errors.type}</p>}
                </div>

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
                    <label htmlFor="date" className={labelClasses}>Date</label>
                    <input
                        id="date"
                        name="date"
                        type="date"
                        value={form.date}
                        onChange={handleChange}
                        className={inputClasses(errors.date)}
                    />
                    {errors.date && <p className={errorTextClasses}>{errors.date}</p>}
                </div>

                <div>
                    <label htmlFor="description" className={labelClasses}>Description <span className="text-gray-400">(Optional)</span></label>
                    <input
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className={inputClasses(false)}
                        placeholder="Add a note (optional)"
                    />
                </div>

                <div className="flex justify-end space-x-3 mt-8">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold rounded-lg shadow hover:from-indigo-600 hover:to-pink-600 transition-colors duration-200"
                    >
                        {transactionToEdit ? 'Update' : 'Add'}
                    </button>
                </div>
            </form>
        </div>
    );
}