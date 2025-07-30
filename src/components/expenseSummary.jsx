import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import dayjs from 'dayjs';

const ExpenseSummary = () => {
  const { expenses } = useExpense();
  const grouped = {};

  expenses.forEach((exp) => {
    if (!exp.deadline || !exp.amount) return;

    const date = dayjs(exp.deadline);
    const year = date.year();
    const month = date.format('MMMM');

    const key = `${year}-${month}`;

    if (!grouped[year]) grouped[year] = {};
    if (!grouped[year][month]) grouped[year][month] = { paid: 0, received: 0 };

    const amt = parseFloat(exp.amount);

    if (exp.payType === 'Paid' || exp.payType === 'Due Done') {
      grouped[year][month].paid += amt;
    } else if (exp.payType === 'To Receive' || exp.payType === 'Received') {
      grouped[year][month].received += amt;
    }
  });

  return (
    <div className="mt-8 px-4">
      <h2 className="text-xl font-bold underline mb-2 text-white">Summary</h2>
      {Object.entries(grouped).map(([year, months]) => {
        let yearlyTotal = 0;

        return (
          <div key={year} className="mb-6">
            <h3 className="text-lg font-semibold mb-1 text-white">{year}</h3>
            <ul className="ml-4 space-y-1">
              {Object.entries(months).map(([month, { paid, received }]) => {
                const total = paid - received;
                yearlyTotal += total;
                return (
                  <li key={month} className="text-sm">
                    <span className="text-white">{month}:</span>{' '}
                    <span className="text-red-400 font-semibold">
                      ₹{total.toFixed(2)}
                    </span>{' '}
                    <span className="text-xs text-white/50">
                      (Spent: ₹{paid.toFixed(2)} - Received: ₹{received.toFixed(2)})
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 font-bold text-red-500">
              Yearly Total: ₹{yearlyTotal.toFixed(2)}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ExpenseSummary;
