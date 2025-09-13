// components/RecentTransactions.js
import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

const RecentTransactions = () => {
  const transactions = [
    { id: 1, customer: 'Rajesh Traders', amount: 12500, type: 'sale', date: '10 Nov 2023' },
    { id: 2, customer: 'Supplier Co.', amount: 8500, type: 'purchase', date: '9 Nov 2023' },
    { id: 3, customer: 'Mohan Stores', amount: 9200, type: 'sale', date: '8 Nov 2023' },
    { id: 4, customer: 'Electronic Parts Ltd.', amount: 11200, type: 'purchase', date: '7 Nov 2023' },
    { id: 5, customer: 'Sanjay Enterprises', amount: 7500, type: 'sale', date: '6 Nov 2023' }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h2>
      <div className="flow-root">
        <ul className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <li key={transaction.id} className="py-3">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${transaction.type === 'sale' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {transaction.type === 'sale' ? (
                    <FiArrowUp className={`h-5 w-5 ${transaction.type === 'sale' ? 'text-green-500' : 'text-red-500'}`} />
                  ) : (
                    <FiArrowDown className={`h-5 w-5 ${transaction.type === 'sale' ? 'text-green-500' : 'text-red-500'}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {transaction.customer}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {transaction.date}
                  </p>
                </div>
                <div className={`inline-flex items-center text-base font-semibold ${transaction.type === 'sale' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'sale' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <a href="/invoices" className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          View all transactions
        </a>
      </div>
    </div>
  );
};

export default RecentTransactions;