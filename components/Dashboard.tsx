
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, Category } from '../types';
import { TransactionModal } from './TransactionModal';
import { supabaseRequest } from '../lib/supabase';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip 
} from 'recharts';

interface DashboardProps {
  userName: string;
  userEmail: string;
  isNewUser: boolean;
  theme: 'light' | 'dark';
}

const translations: any = {
  en: { 
    back: 'Welcome Back', 
    board: 'Welcome on Board',
    tagline: 'No loss track of where your money dey enter!',
    addIncome: '+ Add Income',
    addExpense: '- Add Expense',
    balance: 'TOTAL BALANCE',
    income: 'TOTAL INCOME',
    expenses: 'TOTAL EXPENSES',
    pieTitle: 'Spending by Category',
    recentTitle: 'Recent Transactions',
    overviewTitle: 'Monthly Overview',
    noData: 'No data to show',
    emptyRecent: 'Your recent activities will appear here.'
  },
  fr: { 
    back: 'Bon retour', 
    board: 'Bienvenue à bord',
    tagline: 'Ne perdez plus jamais le fil de vos finances !',
    addIncome: '+ Ajouter Revenu',
    addExpense: '- Ajouter Dépense',
    balance: 'SOLDE TOTAL',
    income: 'REVENU TOTAL',
    expenses: 'DÉPENSES TOTALES',
    pieTitle: 'Dépenses par catégorie',
    recentTitle: 'Transactions récentes',
    overviewTitle: 'Aperçu mensuel',
    noData: 'Aucune donnée à afficher',
    emptyRecent: 'Vos activités récentes apparaîtront ici.'
  }
};

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#94a3b8'];

export const Dashboard: React.FC<DashboardProps> = ({ userName, userEmail, isNewUser, theme }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('finatrack_lang') || 'en');
  const currency = '₦';
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [modalType, setModalType] = useState<'income' | 'expense' | null>(null);

  const storageKey = `finatrack_tx_${userEmail}`;

  useEffect(() => {
    const handleStorage = () => {
      setLang(localStorage.getItem('finatrack_lang') || 'en');
      const saved = localStorage.getItem(storageKey);
      if (saved) setTransactions(JSON.parse(saved));
    };
    handleStorage();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [userEmail, storageKey]);

  const t = translations[lang] || translations['en'];

  const handleSaveTransaction = async (data: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...data,
      id: Math.random().toString(36).substr(2, 9)
    };

    supabaseRequest('transactions', 'POST', {
      user_email: userEmail,
      description: data.description,
      amount: data.amount,
      category: data.category,
      date: data.date,
      type: data.type
    });

    const updated = [newTx, ...transactions];
    setTransactions(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setModalType(null);
    window.dispatchEvent(new Event('storage'));
  };

  const stats = useMemo(() => {
    const income = transactions
      .filter(tx => tx.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const expenses = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  const pieData = useMemo(() => {
    const expenseMap: Record<string, number> = {};
    transactions
      .filter(tx => tx.type === 'expense')
      .forEach(tx => {
        expenseMap[tx.category] = (expenseMap[tx.category] || 0) + tx.amount;
      });
    return Object.entries(expenseMap).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const barData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth();
    const last6Months = [];
    
    for (let i = 5; i >= 0; i--) {
      const idx = (currentMonthIdx - i + 12) % 12;
      last6Months.push({ 
        name: months[idx], 
        monthNum: idx,
        income: 0, 
        expenses: 0 
      });
    }

    transactions.forEach(tx => {
      const txDate = new Date(tx.date);
      const txMonth = txDate.getMonth();
      const bar = last6Months.find(m => m.monthNum === txMonth);
      if (bar) {
        if (tx.type === 'income') bar.income += tx.amount;
        else bar.expenses += tx.amount;
      }
    });

    return last6Months;
  }, [transactions]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {(isNewUser ? t.board : t.back)}, {userName.split(' ')[0]}!
          </h1>
          <p className="text-slate-400 font-medium text-sm mt-1">
            {t.tagline}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setModalType('income')}
            className="px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-900/20"
          >
            {t.addIncome}
          </button>
          <button 
            onClick={() => setModalType('expense')}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all"
          >
            {t.addExpense}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title={t.balance} value={`${currency}${stats.balance.toLocaleString()}`} color="indigo" />
        <StatCard title={t.income} value={`${currency}${stats.income.toLocaleString()}`} color="indigo" />
        <StatCard title={t.expenses} value={`${currency}${stats.expenses.toLocaleString()}`} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm h-full">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-8">{t.pieTitle}</h3>
            <div className="h-64">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      formatter={(val: number) => `${currency}${val.toLocaleString()}`}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-300 text-xs font-bold uppercase tracking-widest">
                  {t.noData}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-6">{t.recentTitle}</h3>
            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.slice(0, 3).map(tx => (
                  <div key={tx.id} className="flex items-center justify-between py-3 border-b border-slate-50 dark:border-slate-700/50 last:border-0">
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{tx.description}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">#{tx.id.toUpperCase()} • {tx.category}</p>
                    </div>
                    <p className={`text-sm font-black ${tx.type === 'income' ? 'text-indigo-600' : 'text-slate-900 dark:text-slate-300'}`}>
                      {tx.type === 'income' ? '+' : '-'}{currency}{tx.amount.toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-slate-400 text-xs font-medium italic">{t.emptyRecent}</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-6">{t.overviewTitle}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#f1f5f9'} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWait: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWait: 700 }} />
                  <RechartsTooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="income" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={12} />
                  <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {modalType && (
        <TransactionModal 
          type={modalType} 
          onClose={() => setModalType(null)} 
          onSave={handleSaveTransaction} 
        />
      )}
    </div>
  );
};

const StatCard = ({ title, value, color }: any) => (
  <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden transition-all hover:border-indigo-200 dark:hover:border-indigo-800">
    <div className="relative z-10">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</p>
      <h2 className={`text-3xl font-black tracking-tight ${color === 'rose' ? 'text-rose-600 dark:text-rose-400' : 'text-indigo-600 dark:text-indigo-400'}`}>{value}</h2>
    </div>
  </div>
);
