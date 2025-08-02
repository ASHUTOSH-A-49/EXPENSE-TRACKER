import React from 'react';
import { useExpense } from '../context/ExpenseContext';



const ExpenseItem = ({ expense }) => {
  const { updateExpense, deleteExpense } = useExpense();
  const [isEditing, setIsEditing] = React.useState(false);
  const [text, setText] = React.useState(expense.text);
  const [deadline, setDeadline] = React.useState(formatForInput(expense.deadline));
  const [amount, setAmount] = React.useState(expense.amount || '');



  const bgColor = expense.payType === 'Paid'
    ? 'bg-red-300'
    : expense.payType === 'To Receive'
    ? 'bg-purple-400'
    : expense.payType === 'Due'
    ? 'bg-blue-500'
    
    : 'bg-green-500';
  React.useEffect(() => {
    setDeadline(formatForInput(expense.deadline));
  }, [expense.deadline]);

  const saveEdit = () => {
    updateExpense(expense.id, { text, deadline, amount });
    setIsEditing(false);
  };

  const handleToggle = () => {
    let updated = { ...expense };

    switch (expense.payType) {
      case 'Due':
        updated.payType   = 'Due Done';
        updated.completed = true;
        break;
      case 'To Receive':
        updated.payType   = 'Received';
        updated.completed = true;
        break;
      case 'Due Done':
        updated.payType   = 'Due';
        updated.completed = false;
        break;
      case 'Received':
        updated.payType   = 'To Receive';
        updated.completed = false;
        break;
      default:
        return; 
    }

    updateExpense(expense.id, updated);
  };

  
  const isCheckable = ['Due','To Receive','Due Done','Received'].includes(expense.payType);




 return (
  <div
    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 px-4 py-3 rounded ${bgColor} cursor-pointer w-full`}
    onClick={() => {
      if (!isEditing && isCheckable) handleToggle();
    }}
  >
    {/* Left Side: Text, Checkbox, Amount */}
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap w-full sm:w-auto">
      <div className="flex items-center gap-2 flex-wrap">
        {isCheckable && (
          <input
  type="checkbox"
  checked={expense.completed}
  onChange={() => {}} // 👈 necessary!
  // onClick={(e) => e.stopPropagation()} // 👈 stops parent from toggling twice
  className="accent-green-500 w-4 h-4"
  disabled={isEditing}
/>


        )}

        {!isEditing ? (
          <span className="font-medium break-words text-white">
            {expense.text}
            {expense.amount && (
              <span className="text-yellow-300 font-semibold ml-2">
                ₹{parseFloat(expense.amount).toFixed(2)}
              </span>
            )}
          </span>
        ) : (
          <div className="flex flex-col sm:flex-row gap-1">
            <input
              className="bg-transparent border-b border-white outline-none text-white"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <input
              type="number"
              step="0.01"
              className="bg-transparent border-b border-white outline-none text-white sm:ml-2"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>

    {/* Right Side: Date, Buttons */}
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-2 text-white text-sm sm:text-base"
      onClick={(e) => e.stopPropagation()}
    >
      {expense.deadline && !isEditing && (
        <span className="whitespace-nowrap text-white">
          📅 {new Date(expense.deadline).toLocaleString()}
        </span>
      )}

      {isEditing ? (
        <>
          <input
            type="datetime-local"
            className="border border-white rounded px-2 py-1 bg-transparent text-white"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <button
            onClick={saveEdit}
            className="text-green-300 font-semibold"
          >
            ✅ Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="text-yellow-300 font-semibold"
          >
            ❌ Cancel
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              if (!expense.completed) setIsEditing(true);
            }}
            className="text-white"
          >
            ✏️
          </button>
          <button
            onClick={() => deleteExpense(expense.id)}
            className="text-red-300"
          >
            ❌
          </button>
        </>
      )}
    </div>
  </div>
);


};

export default ExpenseItem;

// helper for datetime-local input
function formatForInput(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d - tz).toISOString().slice(0,16);
}
