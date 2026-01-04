
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
  const [isLangOpen, setIsLangOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'French' },
    { code: 'yo', label: 'Yoruba' },
    { code: 'ig', label: 'Igbo' },
    { code: 'ar', label: 'Arabic' },
  ];

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

  const handleLangChange = (code: string) => {
    setLang(code);
    localStorage.setItem('finatrack_lang', code);
    window.dispatchEvent(new Event('storage'));
    setIsLangOpen(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' }
  ];

  const currentLangLabel = languages.find(l => l.code === lang)?.label || 'Language';

  const LogoIcon = () => (
    <div className="bg-indigo-600 p-1.5 rounded-xl text-white shadow-lg relative w-10 h-10 flex items-center justify-center">
      {/* Chart Axes */}
      <div className="absolute bottom-2 left-2 right-2 top-2 border-l-2 border-b-2 border-white/40"></div>
      {/* Growth Line Pattern */}
      <svg className="w-6 h-6 relative z-10 -mt-1 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-500 ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Mobile Drawer */}
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
            <div className="flex-1 space-y-2 overflow-y-auto">
              {navItems.map(item => (
                <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMenuOpen(false); }} className={`w-full text-left px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                  {item.label}
                </button>
              ))}
              
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700">
                <p className="px-5 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Language</p>
                {languages.map(l => (
                  <button key={l.code} onClick={() => { handleLangChange(l.code); setIsMenuOpen(false); }} className={`w-full text-left px-5 py-3 rounded-xl text-xs font-bold ${lang === l.code ? 'text-indigo-600' : 'text-slate-500'}`}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={onLogout} className="mt-4 w-full py-4 text-red-500 font-black text-[10px] uppercase tracking-widest border border-red-50 dark:border-red-900/20 rounded-2xl bg-red-50/30">Sign Out</button>
          </div>
        </div>
      )}

      {/* Main Nav */}
      <nav className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
            
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <LogoIcon />
              <h1 className="hidden sm:flex font-black tracking-tighter uppercase dark:text-white items-baseline">
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
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-xl">
               <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Currency: ₦</span>
            </div>

            <div className="hidden lg:relative lg:block">
              <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest min-w-[120px] justify-between">
                <span>{currentLangLabel}</span>
                <svg className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {isLangOpen && (
                <div className="absolute top-full mt-2 right-0 w-40 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-gray-100 dark:border-slate-700 py-2 z-50 overflow-hidden">
                  {languages.map(l => (
                    <button key={l.code} onClick={() => handleLangChange(l.code)} className={`w-full text-left px-5 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${lang === l.code ? 'text-indigo-600' : 'text-slate-500'}`}>
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-indigo-50/50 dark:border-slate-700 shadow-sm">
              <img src={avatar} className="w-full h-full object-cover" alt="Avatar" />
            </div>
          </div>
        </div>
      </nav>
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};
