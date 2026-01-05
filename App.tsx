import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { Transactions } from './components/Transactions.tsx';
import { Reports } from './components/Reports.tsx';
import { Settings } from './components/Settings.tsx';
import { Auth } from './components/Auth.tsx';

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
        name: name || 'User',
        password,
        phone,
        isNewUser: true,
        createdAt: new Date().toISOString()
      };

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
        userName={user.name || 'User'}
        theme={theme}
        toggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        onLogout={handleLogout}
      >
        <div className="max-w-7xl mx-auto px-4 py-8 w-full">
          {activeTab === 'dashboard' && (
            <Dashboard 
              userName={user.name || 'User'} 
              userEmail={user.email} 
              isNewUser={user.isNewUser} 
              theme={theme} 
            />
          )}
          {activeTab === 'transactions' && <Transactions userEmail={user.email} />}
          {activeTab === 'reports' && <Reports userEmail={user.email} />}
          {activeTab === 'settings' && (
            <Settings 
              userName={user.name || 'User'} 
              userEmail={user.email} 
              theme={theme} 
              toggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')} 
              onLogout={handleLogout} 
            />
          )}
        </div>
      </Layout>
    </div>
  );
};

export default App;