
import React, { useState } from 'react';
import { supabaseRequest } from '../lib/supabase';

interface ReportsProps {
  userEmail: string;
}

export const Reports: React.FC<ReportsProps> = ({ userEmail }) => {
  const [lang] = useState<'en' | 'fr'>(() => (localStorage.getItem('finatrack_lang') as 'en' | 'fr') || 'en');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  
  const handleUpgrade = async (planType: string, price: string) => {
    setLoadingPlan(planType);
    
    // Sync to Supabase Orders
    const success = await supabaseRequest('orders', 'POST', {
      user_email: userEmail,
      plan_type: planType,
      amount: price,
      status: 'pending_manual_activation',
      created_at: new Date().toISOString()
    });

    setLoadingPlan(null);

    if (success) {
      alert(lang === 'en' 
        ? `Order for ${planType} plan received! Premium activation is handled manually. Please reach out to the developers at FINA Track team to finalize.` 
        : `Commande pour le forfait ${planType} reçue! L'activation Premium est gérée manuellement. Veuillez contacter les développeurs pour finaliser.`
      );
    } else {
      alert("Something went wrong with your request. Please try again.");
    }
  };

  const t = lang === 'en' ? {
    title: 'Unlock Premium Features',
    subtitle: 'Get more from your financial journey',
    features: [
      { name: 'Auto-Bill Tracking & Reminders', desc: 'Never miss a payment, alerts 3 days before due date.' },
      { name: 'Receipt Scanner with Expense Reports', desc: 'Scan receipts, auto-create expense reports for work/taxes.' },
      { name: 'Investment Portfolio Tracker', desc: 'Connect and monitor stocks/crypto alongside regular expenses.' },
      { name: 'Tax Optimization Assistant', desc: 'Identifies tax-deductible expenses, generates year-end reports.' },
      { name: 'Credit Score Monitoring', desc: 'Monthly updates and tips to improve your score.' },
      { name: 'Shared Budgets with Partner', desc: 'Sync and manage household finances together.' },
      { name: 'Subscription Manager', desc: 'Track all subscriptions, alerts for price increases.' },
      { name: 'Financial Coach Chat', desc: 'Live monthly Q&A with financial experts.' },
      { name: 'Advanced Security Features', desc: 'Biometric login, transaction alerts, device management.' },
      { name: 'Priority Customer Support', desc: '24/7 chat support, 1-hour response time.' }
    ],
    note: 'Transition from simply seeing your money to actively controlling its future.',
    monthly: 'MONTHLY',
    yearly: 'YEARLY (Save 40%)',
    cta: 'Start Free Trial',
    contact: 'Contact Developers to Activate'
  } : {
    title: 'Débloquez les fonctionnalités Premium',
    subtitle: 'Tirez le meilleur parti de votre parcours financier',
    features: [
      { name: 'Suivi et rappels de factures automatiques', desc: 'Ne manquez jamais un paiement, alertes 3 jours avant.' },
      { name: 'Scanner de reçus', desc: 'Scannez les reçus, créez des rapports pour le travail/impôts.' },
      { name: 'Suivi de portefeuille d\'investissement', desc: 'Surveillez vos actions/crypto avec vos dépenses.' },
      { name: 'Assistant d\'optimisation fiscale', desc: 'Identifie les dépenses déductibles, génère des rapports.' },
      { name: 'Surveillance du score de crédit', desc: 'Mises à jour mensuelles et conseils pour s\'améliorer.' },
      { name: 'Budgets partagés', desc: 'Gérez les finances du foyer ensemble.' },
      { name: 'Gestionnaire d\'abonnements', desc: 'Suivez tous les abonnements, alertes de hausse de prix.' },
      { name: 'Chat avec un coach financier', desc: 'Q&A mensuel en direct avec des experts.' },
      { name: 'Fonctions de sécurité avancées', desc: 'Connexion biométrique, alertes de transaction.' },
      { name: 'Support client prioritaire', desc: 'Chat 24/7, réponse en moins d\'une heure.' }
    ],
    note: 'Passez de la simple vision de votre argent au contrôle actif de son avenir.',
    monthly: 'MENSUEL',
    yearly: 'ANNUEL (Économisez 40%)',
    cta: 'Commencer l\'essai gratuit',
    contact: 'Contacter les développeurs pour activer'
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center p-4">
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-10 blur-md pointer-events-none p-8">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 h-48 shadow-sm"></div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl w-full bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in zoom-in duration-500 my-10">
        <div className="p-8 md:p-12">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="bg-amber-100 dark:bg-amber-900/20 text-amber-600 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-inner">👑</div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t.title}</h2>
            <p className="text-gray-500 dark:text-slate-400 font-medium text-sm mt-2">{t.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-12">
            {t.features.map((feature, idx) => (
              <div key={idx} className="flex gap-4 group">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800 dark:text-slate-200">{feature.name}</p>
                  <p className="text-[11px] text-gray-500 dark:text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-indigo-50/50 dark:bg-slate-900/50 rounded-3xl p-8 border border-indigo-100 dark:border-slate-700 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div 
                onClick={() => handleUpgrade('Monthly', '$4.99')}
                className={`p-6 rounded-2xl border-2 border-white dark:border-slate-800 bg-white dark:bg-slate-800 text-center shadow-sm cursor-pointer hover:-translate-y-1 transition-all ${loadingPlan === 'Monthly' ? 'opacity-50 animate-pulse' : ''}`}
              >
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.monthly}</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">$4.99<span className="text-xs text-gray-400 font-bold">/mo</span></p>
              </div>
              <div 
                onClick={() => handleUpgrade('Yearly', '$35.88')}
                className={`p-6 rounded-2xl border-2 border-indigo-200 dark:border-indigo-500/50 bg-indigo-600 text-center shadow-lg cursor-pointer hover:-translate-y-1 transition-all relative ${loadingPlan === 'Yearly' ? 'opacity-50 animate-pulse' : ''}`}
              >
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-md">Best Value</span>
                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">{t.yearly}</p>
                <p className="text-2xl font-black text-white">$2.99<span className="text-xs text-indigo-200 font-bold">/mo</span></p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <p className="mt-6 text-[11px] font-bold text-gray-400 dark:text-slate-500 italic max-w-xs text-center leading-relaxed">
              "{t.note}"
            </p>
            <button 
              onClick={() => handleUpgrade('Support', 'Contact')}
              className="mt-6 text-indigo-600 dark:text-indigo-400 font-black text-sm hover:underline tracking-tight"
            >
              {t.contact}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
