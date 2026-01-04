
import React, { useState, useRef } from 'react';

interface SettingsProps {
  userName: string;
  userEmail: string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ userName, userEmail, theme, toggleTheme, onLogout }) => {
  const getUsersData = () => JSON.parse(localStorage.getItem('finatrack_users') || '{}');
  const currentUserData = getUsersData()[userEmail] || {};
  
  const [profile, setProfile] = useState({ 
    name: currentUserData.name || userName, 
    email: userEmail,
    avatar: currentUserData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&bold=true`
  });
  
  const [settings, setSettings] = useState({
    appLock: false,
    allowScreenshots: true,
    calendarLinked: false
  });

  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const allUsers = getUsersData();
    if (allUsers[userEmail]) {
      allUsers[userEmail] = { ...allUsers[userEmail], name: profile.name, avatar: profile.avatar };
      localStorage.setItem('finatrack_users', JSON.stringify(allUsers));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfile(prev => ({ ...prev, avatar: base64String }));
        const allUsers = getUsersData();
        if (allUsers[userEmail]) {
          allUsers[userEmail].avatar = base64String;
          localStorage.setItem('finatrack_users', JSON.stringify(allUsers));
          window.dispatchEvent(new Event('storage'));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 px-4 sm:px-0">
      <header>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Settings</h1>
        <p className="text-slate-500 font-medium">Manage your personal profile and preferences.</p>
      </header>

      {/* Profile Section */}
      <section className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
        <div className="p-8 flex flex-col items-center border-b border-gray-50 dark:border-slate-700/50 bg-gray-50/30 dark:bg-slate-900/10">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-24 h-24 rounded-4xl overflow-hidden border-4 border-white dark:border-slate-700 shadow-xl transition-transform group-hover:scale-105">
              <img src={profile.avatar} className="w-full h-full object-cover" alt="Profile" />
            </div>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-4xl flex items-center justify-center transition-opacity">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>
          <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-indigo-600">Change Avatar</p>
        </div>

        <form onSubmit={handleUpdate} className="p-8 space-y-6">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black text-slate-800 dark:text-slate-300 uppercase tracking-widest ml-1">Full Name</label>
            <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold" />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg">
            {success ? 'PROFILE SAVED!' : 'Save Profile'}
          </button>
        </form>
      </section>

      {/* Security & Privacy Section */}
      <section className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden p-8 space-y-6">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-700/50 pb-2">Security & Privacy</h2>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-widest">Add Password to App</p>
            <p className="text-[10px] text-slate-400 font-medium">Require PIN to open the app.</p>
          </div>
          <button onClick={() => setSettings({...settings, appLock: !settings.appLock})} className={`w-12 h-6 rounded-full transition-all relative ${settings.appLock ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${settings.appLock ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-widest">Allow Screenshots</p>
            <p className="text-[10px] text-slate-400 font-medium">Control device screen recording.</p>
          </div>
          <button onClick={() => setSettings({...settings, allowScreenshots: !settings.allowScreenshots})} className={`w-12 h-6 rounded-full transition-all relative ${settings.allowScreenshots ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${settings.allowScreenshots ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden p-8 space-y-6">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-700/50 pb-2">Preferences</h2>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-widest">Dark Mode</p>
            <p className="text-[10px] text-slate-400 font-medium">Night-time optimized interface.</p>
          </div>
          <button onClick={toggleTheme} className={`w-12 h-6 rounded-full transition-all relative ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${theme === 'dark' ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-widest">Link to Calendar</p>
            <p className="text-[10px] text-slate-400 font-medium">Sync payments with Google/iCal.</p>
          </div>
          <button 
            onClick={() => setSettings({...settings, calendarLinked: !settings.calendarLinked})}
            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${settings.calendarLinked ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100 dark:bg-slate-900 dark:border-slate-700'}`}
          >
            {settings.calendarLinked ? 'Linked ✓' : 'Connect'}
          </button>
        </div>
      </section>

      <button onClick={onLogout} className="w-full py-5 text-red-500 font-black text-xs uppercase tracking-widest bg-white dark:bg-slate-800 border border-red-50 dark:border-red-900/20 rounded-3xl transition-all shadow-sm hover:bg-red-50 dark:hover:bg-red-900/10">
        Sign Out / Switch User
      </button>
    </div>
  );
};
