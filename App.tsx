
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { Auth } from './components/Auth';
import { supabaseRequest } from './lib/supabase';

const App: React.FC = () => {
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('finatrack_session_email');
  });

  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => 
    (localStorage.getItem('fina_theme') as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    if (currentUserEmail) {
      const users = JSON.parse(localStorage.getItem('finatrack_users') || '{}');
      const userData = users[currentUserEmail];
      if (userData) {
        setUser(userData);
      } else {
        setUser({ email: currentUserEmail, name: currentUserEmail.split('@')[0] });
      }
    } else {
      setUser(null);
    }
  }, [currentUserEmail]);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('fina_theme', theme);
  }, [theme]);

  const handleAuth = async (email: string, name?: string, password?: string, isSignUp?: boolean, phone?: string) => {
    const users = JSON.parse(localStorage.getItem('finatrack_users') || '{}');
    const lowerEmail = email.toLowerCase().trim();

    if (isSignUp) {
      if (users[lowerEmail]) {
        return 'Email already exists. Please sign in instead.';
      }
      
      const newUser = {
        email: lowerEmail,
        name: name || 'Blessing Ngozi Uzor',
        password,
        phone,
        isNewUser: true,
        createdAt: new Date().toISOString()
      };

      await supabaseRequest('profiles', 'POST', {
        email: lowerEmail,
        full_name: name || 'Blessing Ngozi Uzor',
        phone_number: phone,
        password_hash: password 
      });

      users[lowerEmail] = newUser;
      localStorage.setItem('finatrack_users', JSON.stringify(users));
      setCurrentUserEmail(lowerEmail);
      localStorage.setItem('finatrack_session_email', lowerEmail);
      return null;
    }

    const existingUser = users[lowerEmail];
    if (!existingUser) {
      return 'No account found with this email. Please sign up.';
    }
    
    if (existingUser.password !== password) {
      return 'Wrong password. Please try again.';
    }

    existingUser.isNewUser = false;
    users[lowerEmail] = existingUser;
    localStorage.setItem('finatrack_users', JSON.stringify(users));
    
    setCurrentUserEmail(lowerEmail);
    localStorage.setItem('finatrack_session_email', lowerEmail);
    return null;
  };

  const handleLogout = () => {
    setCurrentUserEmail(null);
    localStorage.removeItem('finatrack_session_email');
    setActiveTab('dashboard');
  };

  if (!currentUserEmail || !user) {
    return <Auth onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors flex flex-col font-sans">
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userName={user.name || 'Blessing Ngozi Uzor'}
        theme={theme}
        toggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        onLogout={handleLogout}
      >
        <div className="max-w-7xl mx-auto px-4 py-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'dashboard' && (
            <Dashboard 
              userName={user.name || 'Blessing'} 
              userEmail={user.email} 
              isNewUser={user.isNewUser} 
              theme={theme} 
            />
          )}
          {activeTab === 'transactions' && <Transactions userEmail={user.email} />}
          {activeTab === 'reports' && <Reports userEmail={user.email} />}
          {activeTab === 'settings' && (
            <Settings 
              userName={user.name || 'Blessing Ngozi Uzor'} 
              userEmail={user.email} 
              theme={theme} 
              toggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')} 
              onLogout={handleLogout} 
            />
          )}
        </div>
      </Layout>
      <footer className="bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-800 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <div className="text-slate-900 dark:text-white text-[11px] font-black uppercase tracking-[0.2em]">
            © 2025 FINATrack - Take control of your cash
          </div>
          <div className="text-gray-400 text-xs font-medium">
            Created by Felicite, Idris, Ngozi & Adam
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
