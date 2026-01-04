
import React from 'react';

interface PremiumModalProps {
  onClose: () => void;
  onUpgrade: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ onClose, onUpgrade }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative neumorph-card max-w-lg w-full p-1 border-none overflow-hidden animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors z-10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="p-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/20 rounded-3xl flex items-center justify-center mb-8 text-4xl shadow-inner transform -rotate-6">👑</div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight rounded-text">Elevate Your Clarity</h2>
            <p className="text-slate-400 dark:text-slate-500 mt-3 text-sm max-w-xs font-medium">Get advanced AI forecasting and unlimited goal tracking.</p>
          </div>

          <div className="mt-10 space-y-6">
            <FeatureItem title="30-Day Projections" desc="AI-powered balance forecasting." />
            <FeatureItem title="Custom Categories" desc="Full control over your financial structure." />
            <FeatureItem title="Smart Alerts" desc="Never miss a bill or go over budget again." />
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6">
            <div className="p-5 neumorph-inset dark:bg-slate-900/50 border-none relative group cursor-pointer transition-transform hover:scale-95">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly</p>
              <p className="text-2xl font-black text-slate-800 dark:text-white">$4.99</p>
            </div>
            <div className="p-5 neumorph-inset bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 relative group cursor-pointer transition-transform hover:scale-95">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">Value</span>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Annual</p>
              <p className="text-2xl font-black text-slate-800 dark:text-white">$2.99<span className="text-xs text-slate-400">/mo</span></p>
            </div>
          </div>

          <button 
            onClick={onUpgrade}
            className="w-full mt-10 neumorph-btn bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 active:scale-95 shadow-none border-none"
          >
            Start Free Trial
          </button>
          
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6 font-bold italic">No commitments. Cancel anytime.</p>
        </div>
      </div>
    </div>
  );
};

const FeatureItem: React.FC<{ title: string, desc: string }> = ({ title, desc }) => (
  <div className="flex gap-5">
    <div className="flex-shrink-0 w-7 h-7 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mt-1 shadow-sm">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
    </div>
    <div>
      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight rounded-text">{title}</h4>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 leading-relaxed font-medium">{desc}</p>
    </div>
  </div>
);
