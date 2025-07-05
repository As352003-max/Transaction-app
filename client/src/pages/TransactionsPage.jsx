import { useState, useEffect } from "react";
import { getTransactions, addTransaction, updateTransaction, deleteTransaction } from "../api/api";
import TransactionList from "../components/TransactionList";
import TransactionForm from "../components/TransactionForm";
import { AlertTriangle } from "lucide-react";

const GlassModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/90 to-fuchsia-800/90 flex justify-center items-center z-50 p-4 animate-fadeIn">
      <div className="backdrop-blur-2xl bg-white/90 rounded-3xl shadow-2xl p-10 max-w-lg w-full relative border-4 border-fuchsia-600 animate-glassPop">
        <h2 className="text-4xl font-extrabold mb-4 text-fuchsia-700 drop-shadow-xl tracking-wide animate-titleGlow">{title}</h2>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-purple-700 hover:text-fuchsia-600 text-3xl font-extrabold transition-transform duration-200 hover:scale-125"
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await getTransactions();
      setTransactions(res.data);
      setError(null);
    } catch {
      setError("Failed to load transactions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSaveTransaction = async (transactionData) => {
    try {
      if (transactionToEdit) {
        await updateTransaction(transactionToEdit._id, transactionData);
      } else {
        await addTransaction(transactionData);
      }
      setIsFormOpen(false);
      setTransactionToEdit(null);
      fetchTransactions();
    } catch {
      setError("Failed to save transaction. Please check your input and try again.");
    }
  };

  const handleEditTransaction = (transaction) => {
    setTransactionToEdit(transaction);
    setIsFormOpen(true);
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction(id);
        fetchTransactions();
      } catch {
        setError("Failed to delete transaction. Please try again.");
      }
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setTransactionToEdit(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-fuchsia-600 animate-pulse">
        <svg className="animate-spin h-12 w-12 mb-4 text-purple-600 drop-shadow-glow" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <p className="text-xl font-bold tracking-wide animate-gradientText bg-gradient-to-r from-fuchsia-600 via-purple-600 to-fuchsia-400 bg-clip-text text-transparent">
          Loading transactions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-8 p-5 bg-gradient-to-r from-fuchsia-200/90 to-purple-200/90 border-2 border-fuchsia-500 text-fuchsia-800 rounded-2xl flex items-center space-x-3 shadow-2xl animate-shake">
        <AlertTriangle className="h-8 w-8 text-fuchsia-600 animate-bounce" />
        <p className="font-bold text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="transactions-page min-h-screen bg-gradient-to-br from-purple-100 via-white to-fuchsia-100 py-12 px-2 animate-fadeIn">
      <div className="flex justify-between items-center mb-10 max-w-3xl mx-auto">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-700 via-purple-700 to-fuchsia-400 drop-shadow-xl animate-slideInLeft tracking-tight">
          Your <span className="animate-glowText">Transactions</span>
        </h1>
        <button
          onClick={() => { setTransactionToEdit(null); setIsFormOpen(true); }}
          className="px-7 py-3 bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-400 text-white font-extrabold rounded-2xl shadow-xl hover:scale-110 hover:from-fuchsia-600 hover:to-purple-700 transition-all duration-200 animate-pop border-2 border-white/60 hover:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-200"
        >
          <span className="drop-shadow-glow">+ Add New</span>
        </button>
      </div>

      <GlassModal
        isOpen={isFormOpen}
        onClose={handleFormCancel}
        title={transactionToEdit ? "Edit Transaction" : "Add New Transaction"}
      >
        <TransactionForm
          onSave={handleSaveTransaction}
          transactionToEdit={transactionToEdit}
          onCancel={handleFormCancel}
        />
      </GlassModal>

      {transactions.length === 0 ? (
        <div className="max-w-md mx-auto my-16 p-10 bg-white/90 rounded-3xl shadow-2xl text-center border-2 border-dashed border-purple-400 animate-fadeIn backdrop-blur-lg">
          <p className="text-xl text-purple-700 font-bold mb-2 animate-gradientText bg-gradient-to-r from-fuchsia-600 via-purple-600 to-fuchsia-400 bg-clip-text text-transparent">No transactions recorded yet.</p>
          <p className="text-fuchsia-500 font-semibold">Click <span className="font-extrabold text-purple-700">"Add New"</span> to get started!</p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto animate-fadeInUp">
          <TransactionList
            transactions={transactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-40 pointer-events-none">
        <div className="w-24 h-24 bg-gradient-to-br from-fuchsia-400 via-purple-400 to-fuchsia-200 rounded-full blur-2xl opacity-60 animate-float"></div>
      </div>
    </div>
  );
}