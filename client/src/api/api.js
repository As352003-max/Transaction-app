// client/src/api/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/api';

// Transactions
export const getTransactions = () => axios.get(`${API_URL}/transactions`);
export const getTransactionById = (id) => axios.get(`${API_URL}/transactions/${id}`);
export const addTransaction = (transaction) => axios.post(`${API_URL}/transactions`, transaction);
export const updateTransaction = (id, transaction) => axios.put(`${API_URL}/transactions/${id}`, transaction);
export const deleteTransaction = (id) => axios.delete(`${API_URL}/transactions/${id}`);

// Budgets
export const getBudgets = () => axios.get(`${API_URL}/budgets`);
export const getBudgetById = (id) => axios.get(`${API_URL}/budgets/${id}`);
export const addBudget = (budget) => axios.post(`${API_URL}/budgets`, budget);
export const updateBudget = (id, budget) => axios.put(`${API_URL}/budgets/${id}`, budget);
export const deleteBudget = (id) => axios.delete(`${API_URL}/budgets/${id}`);
