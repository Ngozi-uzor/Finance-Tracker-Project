
import React, { useState } from 'react';
import { Category, Transaction } from '../types';

interface TransactionModalProps {
  type: 'income' | 'expense';
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ type, onClose, onSave }) => {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: type === 'income' ? Category.INCOME : Category.FOOD,
    date: new Date().toISOString().split('T')[0]
  });

  const categories = Object.values(Category).filter(cat => 
    type === 'income' ? cat === Category.INCOME : cat !== Category.INCOME
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    
    onSave({
      description: form.description,
      amount: parseFloat(form.amount),
      category: form.category,
      date: form.date,
      type
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black uppercase tracking-tight dark:text-white">
            Add {type === 'income' ? 'Income' : 'Expense'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Description</label>
            <input required type="text" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold dark:text-white" placeholder="e.g. Monthly Salary" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Amount</label>
              <input required type="number" step="0.01" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold dark:text-white" placeholder="0.00" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Category</label>
              <select className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold dark:text-white" value={form.category} onChange={e => setForm({...form, category: e.target.value as Category})}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Date</label>
            <input required type="date" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold dark:text-white" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
          </div>

          <button type="submit" className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 mt-4 ${type === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}>
            Save {type}
          </button>
        </form>
      </div>
    </div>
  );
};
