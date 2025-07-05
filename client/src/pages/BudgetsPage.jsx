import { useState, useEffect } from "react";
import { getBudgets, addBudget, updateBudget, deleteBudget } from "../api/api";
import BudgetList from "../components/BudgetList";
import BudgetForm from "../components/BudgetForm";
import { AlertTriangle } from "lucide-react";

const Confetti = ({ show }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex justify-center items-start">
      <div className="text-5xl font-extrabold animate-confetti drop-shadow-lg text-yellow-400">
        🎉 <span className="text-pink-500">🎊</span> <span className="text-green-500">🥳</span> 🎉 <span className="text-blue-500">🎊</span> <span className="text-red-500">🥳</span>
      </div>
    </div>
  );
};

const SimpleModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-fadeIn border-4 border-yellow-400">
        <h2 className="text-2xl font-extrabold mb-4 text-yellow-300 drop-shadow-lg">{title}</h2>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-yellow-300 hover:text-white text-3xl font-extrabold transition-transform hover:scale-125 focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await getBudgets();
      setBudgets(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to load budgets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleSaveBudget = async (budgetData) => {
    try {
      if (budgetToEdit) {
        await updateBudget(budgetToEdit._id, budgetData);
      } else {
        await addBudget(budgetData);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1500);
      }
      setIsFormOpen(false);
      setBudgetToEdit(null);
      fetchBudgets();
    } catch (err) {
      setError("Failed to save budget. Please check your input and try again.");
    }
  };

  const handleEditBudget = (budget) => {
    setBudgetToEdit(budget);
    setIsFormOpen(true);
  };

  const handleDeleteBudget = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await deleteBudget(id);
        fetchBudgets();
      } catch (err) {
        setError("Failed to delete budget. Please try again.");
      }
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setBudgetToEdit(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-yellow-300 bg-slate-900 animate-fadeIn rounded-xl shadow-lg">
        <p className="text-xl font-bold animate-pulse">Loading budgets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-8 p-4 bg-gradient-to-r from-red-700 via-red-500 to-yellow-400 border-4 border-yellow-300 text-white rounded-xl flex items-center space-x-3 animate-shake shadow-2xl">
        <AlertTriangle className="h-7 w-7 text-yellow-300" />
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="budgets-page min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 animate-fadeIn px-4 py-8">
      <Confetti show={showConfetti} />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-yellow-300 animate-bounce drop-shadow-lg">
          Your Budgets
        </h1>
        <button
          onClick={() => { setBudgetToEdit(null); setIsFormOpen(true); }}
          className="px-6 py-3 bg-yellow-400 text-slate-900 font-extrabold rounded-xl shadow-lg hover:bg-yellow-300 hover:text-slate-800 transition-transform duration-200 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-yellow-200"
        >
          + Set New Budget
        </button>
      </div>

      <SimpleModal
        isOpen={isFormOpen}
        onClose={handleFormCancel}
        title={budgetToEdit ? "Edit Budget" : "Set New Budget"}
      >
        <BudgetForm
          onSave={handleSaveBudget}
          budgetToEdit={budgetToEdit}
          onCancel={handleFormCancel}
        />
      </SimpleModal>

      {budgets.length === 0 ? (
        <div className="max-w-md mx-auto my-12 p-8 bg-slate-800 rounded-2xl shadow-xl text-center animate-fadeIn border-4 border-yellow-400">
          <p className="text-yellow-200 text-lg font-semibold">
            No budgets set yet.<br />
            <span className="text-yellow-400">Click "Set New Budget" to get started!</span>
          </p>
        </div>
      ) : (
        <div className="animate-fadeIn">
          <BudgetList
            budgets={budgets}
            onEdit={handleEditBudget}
            onDelete={handleDeleteBudget}
          />
        </div>
      )}
    </div>
  );
}

