import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';

const TodoForm = () => {
    const { addExpense } = useExpense();
    const [text, setText] = useState('');
    const [amount, setAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const payTypes = ['Due', 'Paid', 'To Receive'];
    const [payType, setPayType] = useState('Due');
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!text.trim() || !amount || !deadline) {
            alert('All fields are required: description, amount, and deadline.');
            return;
        }

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            alert('Enter a valid amount greater than 0.');
            return;
        }

        addExpense({
            text: text.trim(),
            amount: numericAmount,
            deadline,
            payType,
            completed: false,
        });

        setText('');
        setAmount('');
        setDeadline('');
        setPayType('Due'); // reset to default
    };


    return (
        <form
            onSubmit={handleSubmit}
            className="w-full bg-gray-900 shadow-md rounded-lg p-4 space-y-4"
        >

            <div className="flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Expense Description"
                    className="flex-1 p-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Amount (₹)"
                    className="sm:w-48 p-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <select
                    className="sm:w-48 p-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={payType}
                    onChange={(e) => setPayType(e.target.value)}
                >
                    {payTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">

                <label htmlFor="date" className='my-auto'>Date:</label>
                <input
                    id='date'
                    type="datetime-local"
                    className="flex-1 p-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={deadline}
                    placeholder='DATE'
                    onChange={(e) => setDeadline(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all sm:w-auto w-full"
                >
                    ➕ Add
                </button>
            </div>
        </form>
    );
};

export default TodoForm;
