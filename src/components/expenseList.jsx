import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import ExpenseItem from './expenseItem.jsx';

const getYearMonth = (dateStr) => {
  const date = new Date(dateStr);
  return {
    year: date.getFullYear(),
    month: date.toLocaleString('default', { month: 'long' }),
  };
};

const payTypes = ['Paid', 'Due', 'Due Done', 'To Receive', 'Received'];

const ExpenseList = () => {
  const { expenses } = useExpense();
  const [collapsedYear, setCollapsedYear] = React.useState({});
  const [collapsedMonth, setCollapsedMonth] = React.useState({});
  const [collapsedPayType, setCollapsedPayType] = React.useState({});

  const toggleYear = (year) => setCollapsedYear(y => ({ ...y, [year]: !y[year] }));
  const toggleMonth = (yr, mo) => setCollapsedMonth(m => ({ ...m, [`${yr}-${mo}`]: !m[`${yr}-${mo}`] }));
  const toggleType = (yr, mo, tp) => setCollapsedPayType(p => ({ ...p, [`${yr}-${mo}-${tp}`]: !p[`${yr}-${mo}-${tp}`] }));
  const toggleSpec = (label, tp) => setCollapsedPayType(p => ({ ...p, [`${label}-${tp}`]: !p[`${label}-${tp}`] }));

  const yearSections = {};
  const specialSections = { '📝 No Deadline': {} };
  const monthlyTotals = {};
  const yearlyTotals = {};

  expenses.forEach(exp => {
    const baseType = exp.payType || 'Paid';
    let slotType = baseType;

    if (exp.completed) {
      if (baseType === 'Due') slotType = 'Due Done';
      else if (baseType === 'To Receive') slotType = 'Received';
    }

    if (!exp.deadline) {
      if (!specialSections['📝 No Deadline'][slotType])
        specialSections['📝 No Deadline'][slotType] = [];
      specialSections['📝 No Deadline'][slotType].push(exp);
    } else {
      const { year, month } = getYearMonth(exp.deadline);
      yearSections[year] = yearSections[year] || {};
      yearSections[year][month] = yearSections[year][month] || {};
      yearSections[year][month][slotType] = yearSections[year][month][slotType] || [];
      yearSections[year][month][slotType].push(exp);

      monthlyTotals[year] = monthlyTotals[year] || {};
      monthlyTotals[year][month] = monthlyTotals[year][month] || 0;
      if (slotType === 'Paid') monthlyTotals[year][month] += Number(exp.amount);
      if (slotType === 'Received') monthlyTotals[year][month] -= Number(exp.amount);
      if (slotType === 'Due Done') monthlyTotals[year][month] += Number(exp.amount);

      yearlyTotals[year] = yearlyTotals[year] || 0;
      if (slotType === 'Paid') yearlyTotals[year] += Number(exp.amount);
      if (slotType === 'Received') yearlyTotals[year] -= Number(exp.amount);
      if (slotType === 'Due Done') yearlyTotals[year] += Number(exp.amount);
    }
  });

  const sortedYears = Object.keys(yearSections).sort((a, b) => a - b);

  const iconFor = {
    Paid: '💸',
    Due: '⏳',
    'Due Done': '✅',
    'To Receive': '💰',
    Received: '📥',
  };

  const colorFor = {
    Paid: 'bg-red-100',
    Due: 'bg-yellow-100',
    'Due Done': 'bg-green-100',
    'To Receive': 'bg-purple-100',
    Received: 'bg-green-50',
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-10 max-w-5xl mx-auto">
      {sortedYears.map(year => (
        <div key={year} className="bg-white/5 rounded-lg p-3">
          <div
            className="flex justify-between items-center cursor-pointer mb-2 select-none"
            onClick={() => toggleYear(year)}
          >
            <h2 className="text-lg sm:text-xl font-bold text-white">📆 {year}</h2>
            <span className="text-red-400 font-semibold text-sm sm:text-base">
              TOTAL: ₹ {yearlyTotals[year]?.toFixed(2) || 0}
            </span>
          </div>

          {!collapsedYear[year] && (
            <div className="space-y-4 ml-2 sm:ml-4">
              {Object.keys(yearSections[year])
                .sort((a, b) => new Date(`${a} 1, ${year}`) - new Date(`${b} 1, ${year}`))
                .map(month => {
                  const mKey = `${year}-${month}`;
                  return (
                    <div key={mKey} className="bg-white/10 rounded px-3 py-2">
                      <div
                        className="flex justify-between items-center cursor-pointer mb-1"
                        onClick={() => toggleMonth(year, month)}
                      >
                        <h3 className="text-base sm:text-lg font-semibold text-white">📁 {month}</h3>
                        <span className="text-red-400 font-medium text-sm sm:text-base">
                          TOTAL: ₹ {monthlyTotals[year][month]?.toFixed(2) || 0}
                        </span>
                      </div>

                      {!collapsedMonth[mKey] && (
                        <div className="space-y-3 ml-2 sm:ml-3">
                          {payTypes.map(type =>
                            yearSections[year][month][type]?.length ? (
                              <div
                                key={`${mKey}-${type}`}
                                className={`rounded px-3 py-2 ${colorFor[type] || ''}`}
                              >
                                <div
                                  className="flex justify-between items-center cursor-pointer mb-1"
                                  onClick={() => toggleType(year, month, type)}
                                >
                                  <h4 className="text-sm sm:text-base font-semibold text-black">
                                    {iconFor[type]} {type}
                                  </h4>
                                  <span className="text-black text-xs sm:text-sm">
                                    {collapsedPayType[`${mKey}-${type}`] ? '▼' : '▲'}
                                  </span>
                                </div>
                                {!collapsedPayType[`${mKey}-${type}`] && (
                                  <div className="space-y-2">
                                    {yearSections[year][month][type].map(exp => (
                                      <ExpenseItem key={exp.id} expense={exp} />
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : null
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      ))}

      {Object.entries(specialSections).map(([label, typeMap]) =>
        Object.entries(typeMap).map(([type, items]) =>
          items.length ? (
            <div
              key={`${label}-${type}`}
              className={`rounded-lg px-4 py-3 ${colorFor[type] || 'bg-white/10'}`}
            >
              <div
                className="flex justify-between items-center cursor-pointer mb-2"
                onClick={() => toggleSpec(label, type)}
              >
                <h2 className="text-base sm:text-lg font-semibold text-black">
                  {label} – {iconFor[type]} {type}
                </h2>
                <span className="text-black text-sm">
                  {collapsedPayType[`${label}-${type}`] ? '▼' : '▲'}
                </span>
              </div>
              {!collapsedPayType[`${label}-${type}`] && (
                <div className="space-y-3">
                  {items.map(exp => (
                    <ExpenseItem key={exp.id} expense={exp} />
                  ))}
                </div>
              )}
            </div>
          ) : null
        )
      )}
    </div>
  );
};

export default ExpenseList;
