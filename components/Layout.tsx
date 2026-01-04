
import React, { useState, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userName: string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userName, theme, toggleTheme, onLogout }) => {
  const [avatar, setAvatar] = useState('');
  const [lang, setLang] = useState(() => localStorage.getItem('finatrack_lang') || 'en');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const updateAvatar = () => {
    const email = localStorage.getItem('finatrack_session_email');
    const usersData = JSON.parse(localStorage.getItem('finatrack_users') || '{}');
    const user = email ? usersData[email] : null;
    
    if (user && user.avatar) {
      setAvatar(user.avatar);
    } else {
      setAvatar(`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&bold=true`);
    }
  };

  useEffect(() => {
    updateAvatar();
    const handleStorageChange = () => {
      updateAvatar();
      setLang(localStorage.getItem('finatrack_lang') || 'en');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [userName]);

  const navItems = lang === 'en' ? [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' }
  ] : [
    { id: 'dashboard', label: 'Tableau de bord' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'reports', label: 'Rapports' },
    { id: 'settings', label: 'Paramètres' }
  ];

  const LogoIcon = () => (
    <div className="bg-indigo-600 p-1.5 rounded-xl text-white shadow-lg relative w-10 h-10 flex items-center justify-center">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-500">
      {/* Mobile Menu Sidebar */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm lg:hidden" onClick={() => setIsMenuOpen(false)}>
          <div className="w-72 h-full bg-white dark:bg-slate-800 shadow-2xl p-6 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <LogoIcon />
                <h1 className="text-xl font-black tracking-tighter dark:text-white uppercase flex items-baseline">
                  FINA<span className="text-indigo-600 text-[0.8em]">Track</span>
                </h1>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="flex-1 space-y-2">
              {navItems.map(item => (
                <button 
                  key={item.id} 
                  onClick={() => { setActiveTab(item.id); setIsMenuOpen(false); }} 
                  className={`w-full text-left px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button onClick={onLogout} className="mt-auto w-full py-4 text-red-500 font-black text-[10px] uppercase tracking-widest border border-red-50 dark:border-red-900/20 rounded-2xl bg-red-50/30">
              {lang === 'en' ? 'Sign Out' : 'Se déconnecter'}
            </button>
          </div>
        </div>
      )}

      <nav className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Hamburger for Mobile */}
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>

            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <LogoIcon />
              <h1 className="flex font-black tracking-tighter uppercase dark:text-white items-baseline">
                <span className="text-xl">FINA</span>
                <span className="text-indigo-600 text-base ml-0.5">Track</span>
              </h1>
            </div>

            <div className="hidden lg:flex items-center gap-1 ml-6">
              {navItems.map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === item.id ? 'text-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button onClick={toggleTheme} className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-500">
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"/></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              )}
            </button>
            <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-indigo-50/50 dark:border-slate-700 shadow-sm">
              <img src={avatar} className="w-full h-full object-cover" alt="Avatar" />
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
};
