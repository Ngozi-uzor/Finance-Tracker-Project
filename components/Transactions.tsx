
import React, { useState, useEffect } from 'react';
import { Transaction, Category } from '../types';

interface TransactionsProps {
  userEmail: string;
}

export const Transactions: React.FC<TransactionsProps> = ({ userEmail }) => {
  const [lang, setLang] = useState<'en' | 'fr'>(() => (localStorage.getItem('finatrack_lang') as 'en' | 'fr') || 'en');
  const currency = '₦';
  const storageKey = `finatrack_tx_${userEmail}`;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const t = lang === 'en' ? {
    title: 'Transactions',
    search: 'Search...',
    all: 'All',
    income: 'Income',
    expenses: 'Expenses',
    date: 'Date',
    desc: 'Description',
    amount: 'Amount',
    action: 'Action',
    empty: 'No transactions found for this account.'
  } : {
    title: 'Transactions',
    search: 'Rechercher...',
    all: 'Tout',
    income: 'Revenu',
    expenses: 'Dépenses',
    date: 'Date',
    desc: 'Description',
    amount: 'Montant',
    action: 'Action',
    empty: 'Aucune transaction trouvée pour ce compte.'
  };

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setTransactions(JSON.parse(saved));
    else setTransactions([]);

    const handleStorage = () => {
      setLang((localStorage.getItem('finatrack_lang') as 'en' | 'fr') || 'en');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [storageKey]);

  const handleDelete = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === 'All' || (filter === 'Income' && tx.type === 'income') || (filter === 'Expenses' && tx.type === 'expense');
    const matchesSearch = tx.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <input type="text" placeholder={t.search} value={search} onChange={e => setSearch(e.target.value)} className="flex-1 sm:flex-none px-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
          <select value={filter} onChange={e => setFilter(e.target.value)} className="px-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="All">{t.all}</option>
            <option value="Income">{t.income}</option>
            <option value="Expenses">{t.expenses}</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden overflow-x-auto">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-slate-400 font-medium">
            {t.empty}
          </div>
        ) : (
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-gray-50 dark:bg-slate-900 font-bold text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4">{t.date}</th>
                <th className="px-6 py-4">{t.desc}</th>
                <th className="px-6 py-4">{t.amount}</th>
                <th className="px-6 py-4 text-center">{t.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {filteredTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 text-sm text-gray-500">{tx.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{tx.description}</td>
                  <td className={`px-6 py-4 font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-gray-900 dark:text-slate-300'}`}>
                    {tx.type === 'income' ? '+' : '-'}{currency}{tx.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleDelete(tx.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
