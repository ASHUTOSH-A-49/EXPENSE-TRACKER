import { useEffect, useState } from 'react'
import { ExpenseProvider } from './context/ExpenseContext.js'
import './App.css'
import { ExpenseForm, ExpenseItem, ExpenseList } from './components/index.js';

function App() {
  const [expenses, setExpenses] = useState([]);

  const addExpense = (expense) => {
    setExpenses((prev) => [{ id: Date.now(), ...expense }, ...prev]);
  };

  const updateExpense = (id, updatedFields) => {
    setExpenses((prev) =>
      prev.map((prevExpense) =>
        prevExpense.id === id ? { ...prevExpense, ...updatedFields } : prevExpense
      )
    );
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const toggleComplete = (id) => {
    setExpenses((prev) =>
      prev.map((prevExpense) =>
        prevExpense.id === id ? { ...prevExpense, completed: !prevExpense.completed } : prevExpense
      )
    );
  };

  useEffect(() => {
    const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    if (storedExpenses.length > 0) {
      setExpenses(storedExpenses);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  return (
    <ExpenseProvider value={{ expenses, addExpense, updateExpense, deleteExpense, toggleComplete }}>
      <div className="min-h-screen bg-[#0D1B2A] px-4 sm:px-6 py-6">
        <div className="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 text-white">
          <h1 className="text-2xl font-bold text-center mb-8 mt-2">Manage Your Expenses</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <ExpenseForm />
          </div>
          <div className="flex flex-wrap gap-y-3">
            <ExpenseList />
          </div>

        </div>
      </div>
    </ExpenseProvider>
  )
}

export default App
