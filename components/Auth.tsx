
import React, { useState } from 'react';

interface AuthProps {
  onAuth: (email: string, name?: string, password?: string, isSignUp?: boolean, phone?: string) => Promise<string | null>;
}

const translations: any = {
  en: { 
    login: "Sign In", 
    signup: "Create Account", 
    email: "Email Address", 
    pass: "Password", 
    name: "Full Name", 
    phone: "Phone Number", 
    google: "Google",
    apple: "Apple",
    or: "OR",
    toggleInPrefix: "Already have an account? ",
    toggleInAction: "Sign in", 
    toggleUpPrefix: "Don't have an account? ",
    toggleUpAction: "Sign up here",
    forgot: "Forgot Password?", 
    reset: "Reset Password", 
    resetSent: "Reset link sent to your email!",
    backToLogin: "Back to Login"
  },
  fr: { 
    login: "Se connecter", 
    signup: "Créer un compte", 
    email: "Adresse e-mail", 
    pass: "Mot de passe", 
    name: "Nom complet", 
    phone: "Numéro de téléphone", 
    google: "Google",
    apple: "Apple",
    or: "OU",
    toggleInPrefix: "Déjà un compte? ", 
    toggleInAction: "Se connecter", 
    toggleUpPrefix: "Pas de compte? ", 
    toggleUpAction: "Inscrivez-vous ici", 
    forgot: "Mot de passe oublié?", 
    reset: "Réinitialiser", 
    resetSent: "Lien de réinitialisation envoyé!",
    backToLogin: "Retour à la connexion"
  }
};

export const Auth: React.FC<AuthProps> = ({ onAuth }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [lang] = useState(() => localStorage.getItem('finatrack_lang') || 'en');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phoneCode: '+234',
    phone: ''
  });

  const t = translations[lang] || translations.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (isForgot) {
      setSuccess(t.resetSent);
      setTimeout(() => setIsForgot(false), 3000);
      return;
    }

    const fullPhone = isSignUp ? `${form.phoneCode}${form.phone}` : undefined;
    const err = await onAuth(form.email, form.name, form.password, isSignUp, fullPhone);
    if (err) {
      setError(err);
    }
  };

  const LogoIcon = () => (
    <div className="bg-indigo-600 w-12 h-12 rounded-[1rem] mx-auto flex items-center justify-center mb-4 shadow-xl shadow-indigo-500/20">
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 transition-all">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 dark:border-slate-800 transition-all">
        <div className="text-center mb-8">
          <LogoIcon />
          <h1 className="flex items-baseline justify-center font-black tracking-tighter uppercase mb-1">
            <span className="text-xl text-slate-900 dark:text-white">FINA</span>
            <span className="text-sm text-indigo-600 ml-0.5">Track</span>
          </h1>
          <p className="text-[9px] font-black text-slate-800 dark:text-slate-400 uppercase tracking-[0.2em]">Plan better for tomorrow.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl text-xs font-bold border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-2xl text-xs font-bold border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 animate-in slide-in-from-top-2">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isForgot ? (
             <div className="animate-in slide-in-from-top-2">
              <label className="block text-[10px] font-black text-slate-800 dark:text-slate-300 uppercase tracking-widest mb-1.5 ml-1">{t.email}</label>
              <input required type="email" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold dark:text-white" placeholder="email@fina.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
          ) : (
            <>
              {isSignUp && (
                <div className="animate-in slide-in-from-top-2">
                  <label className="block text-[10px] font-black text-slate-800 dark:text-slate-300 uppercase tracking-widest mb-1.5 ml-1">{t.name}</label>
                  <input required type="text" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold dark:text-white" placeholder="Blessing Ngozi Uzor" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
              )}
              
              <div>
                <label className="block text-[10px] font-black text-slate-800 dark:text-slate-300 uppercase tracking-widest mb-1.5 ml-1">{t.email}</label>
                <input required type="email" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold dark:text-white" placeholder="email@fina.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>

              {isSignUp && (
                <div className="animate-in slide-in-from-top-2">
                  <label className="block text-[10px] font-black text-slate-800 dark:text-slate-300 uppercase tracking-widest mb-1.5 ml-1">{t.phone}</label>
                  <div className="flex gap-2">
                    <select className="px-3 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-[10px] font-black outline-none dark:text-white border-none" value={form.phoneCode} onChange={e => setForm({...form, phoneCode: e.target.value})}>
                      <option value="+234">🇳🇬 +234</option>
                      <option value="+233">🇬🇭 +233</option>
                      <option value="+254">🇰🇪 +254</option>
                      <option value="+255">🇹🇿 +255</option>
                      <option value="+27">🇿🇦 +27</option>
                    </select>
                    <input required type="tel" className="flex-1 px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold dark:text-white" placeholder="801 234 5678" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                </div>
              )}

              {!isForgot && (
                <div className="relative">
                  <label className="block text-[10px] font-black text-slate-800 dark:text-slate-300 uppercase tracking-widest mb-1.5 ml-1">{t.pass}</label>
                  <input required type={showPass ? "text" : "password"} minLength={6} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold dark:text-white" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 bottom-3.5 text-slate-400 hover:text-indigo-600 transition-colors">
                    {showPass ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
                    )}
                  </button>
                </div>
              )}
            </>
          )}

          <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-700 transition-all active:scale-95 mt-4">
            {isForgot ? t.reset : (isSignUp ? t.signup : t.login)}
          </button>

          {!isSignUp && (
            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={() => { setIsForgot(!isForgot); setError(null); }} 
                className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-600 transition-colors"
              >
                {isForgot ? t.backToLogin : t.forgot}
              </button>
            </div>
          )}
        </form>

        {!isForgot && (
          <>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-slate-400"><span className="bg-white dark:bg-slate-900 px-4">{t.or}</span></div>
            </div>

            <div className="flex gap-3 mb-8">
              <button className="flex-1 border border-slate-100 dark:border-slate-800 rounded-2xl py-3 flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
                <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">{t.google}</span>
              </button>
              <button className="flex-1 border border-slate-100 dark:border-slate-800 rounded-2xl py-3 flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                <svg className="w-4 h-4 dark:text-white" fill="currentColor" viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">{t.apple}</span>
              </button>
            </div>

            <div className="text-center">
              <button onClick={() => { setIsSignUp(!isSignUp); setError(null); }} className="text-[10px] font-black tracking-widest transition-colors">
                <span className="text-slate-500 dark:text-slate-400">
                  {isSignUp ? t.toggleInPrefix : t.toggleUpPrefix}
                </span>
                <span className="text-indigo-600 hover:underline">
                  {isSignUp ? t.toggleInAction : t.toggleUpAction}
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
