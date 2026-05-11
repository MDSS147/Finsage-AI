import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, PieChart, Wallet, TrendingUp, TrendingDown, Briefcase, Landmark, Stars, Home, Bitcoin } from 'lucide-react';
import { FinancialProfile, Asset, AssetType, Currency, Language } from '../types';
import { translations, TranslationKeys } from '../translations';
import { cn } from '../lib/utils';

interface PortfolioTrackerProps {
  profile: FinancialProfile;
  setProfile: (profile: FinancialProfile) => void;
  currency: Currency;
  language?: Language;
}

export const PortfolioTracker: React.FC<PortfolioTrackerProps> = ({ profile, setProfile, currency, language }) => {
  const t = (key: TranslationKeys) => {
    if (!language) return key;
    const langCode = language.code as keyof typeof translations || 'en';
    return (translations[langCode] || translations.en)[key] || translations.en[key];
  };
  const [isAdding, setIsAdding] = useState(false);
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    type: 'equity',
    name: '',
    value: 0
  });

  const formatCurrency = (amount: number) => {
    const converted = amount * currency.rate;
    return `${currency.symbol}${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const addAsset = () => {
    if (newAsset.name && newAsset.value && newAsset.value > 0) {
      const asset: Asset = {
        id: Math.random().toString(36).substr(2, 9),
        name: newAsset.name,
        type: newAsset.type as AssetType,
        value: newAsset.value
      };
      
      setProfile({
        ...profile,
        portfolio: [...(profile.portfolio || []), asset]
      });
      
      setNewAsset({ type: 'equity', name: '', value: 0 });
      setIsAdding(false);
    }
  };

  const removeAsset = (id: string) => {
    setProfile({
      ...profile,
      portfolio: (profile.portfolio || []).filter(a => a.id !== id)
    });
  };

  const totalValue = (profile.portfolio || []).reduce((sum, a) => sum + a.value, 0);

  const assetTypes: { value: AssetType; label: string; icon: any; color: string }[] = [
    { value: 'equity', label: t('equity'), icon: TrendingUp, color: 'text-blue-400' },
    { value: 'debt', label: t('debt'), icon: Landmark, color: 'text-emerald-400' },
    { value: 'gold', label: t('gold'), icon: Stars, color: 'text-amber-400' },
    { value: 'cash', label: t('cash'), icon: Wallet, color: 'text-slate-400' },
    { value: 'realEstate', label: t('realEstate'), icon: Home, color: 'text-purple-400' },
    { value: 'crypto', label: t('crypto'), icon: Bitcoin, color: 'text-orange-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="p-8 glass-header rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 bg-brand-primary/10 blur-[100px] rounded-full group-hover:bg-brand-primary/20 transition-colors" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3 text-slate-400">
            <PieChart size={18} className="text-brand-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{t('netWorth')}</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight">{formatCurrency(totalValue + profile.savings)}</h2>
          <div className="flex gap-4 pt-4">
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{t('currentSavings')}</span>
              <span className="text-sm font-bold text-slate-300">{formatCurrency(profile.savings)}</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{t('portfolio')}</span>
              <span className="text-sm font-bold text-slate-300">{formatCurrency(totalValue)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-2">
        <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
          <Briefcase size={14} className="text-brand-primary" />
          {t('yourAssets')}
        </h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-all border border-brand-primary/20"
        >
          <Plus size={18} />
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 rounded-[2rem] border border-brand-primary/20 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('assetName')}</label>
                <input
                  type="text"
                  placeholder="e.g. HDFC Bank"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('assetValue')}</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newAsset.value || ''}
                  onChange={(e) => setNewAsset({ ...newAsset, value: parseInt(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('assetType')}</label>
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {assetTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setNewAsset({ ...newAsset, type: type.value })}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border",
                      newAsset.type === type.value
                        ? "bg-brand-primary/20 border-brand-primary/50 text-brand-primary shadow-lg"
                        : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300"
                    )}
                  >
                    <type.icon size={12} />
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={addAsset}
              className="w-full py-4 rounded-[1.5rem] bg-brand-primary text-slate-900 font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-primary/20"
            >
              {t('addAsset')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {(profile.portfolio || []).length === 0 && !isAdding && (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-600">
              <Briefcase size={32} />
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{t('addYourFirstAsset') || "Add your first asset to track your wealth"}</p>
          </div>
        )}
        {(profile.portfolio || []).map((asset) => {
          const typeInfo = assetTypes.find(t => t.value === asset.type);
          const Icon = typeInfo?.icon || Wallet;
          return (
            <motion.div
              layout
              key={asset.id}
              className="glass-card p-5 rounded-[1.5rem] border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-2xl bg-white/5", typeInfo?.color)}>
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-brand-primary transition-colors">{asset.name}</h4>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{typeInfo?.label}</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm font-black text-white">{formatCurrency(asset.value)}</div>
                  <div className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">
                    {((asset.value / totalValue) * 100).toFixed(1)}% of portfolio
                  </div>
                </div>
                <button
                  onClick={() => removeAsset(asset.id)}
                  className="p-2 transition-all text-slate-600 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
