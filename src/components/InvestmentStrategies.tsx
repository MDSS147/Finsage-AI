import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { 
  TrendingUp, 
  Shield, 
  Landmark, 
  Briefcase, 
  Info, 
  ChevronRight, 
  ArrowUpRight, 
  Coins, 
  Building2, 
  BookOpen,
  LineChart as LineChartIcon,
  Target
} from 'lucide-react';
import { FinancialProfile, Language, Currency } from '../types';
import { translations, TranslationKeys } from '../translations';

interface InvestmentStrategiesProps {
  profile: FinancialProfile;
  language: Language;
  currency: Currency;
}

const InvestmentStrategies: React.FC<InvestmentStrategiesProps> = ({ profile, language, currency }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const t = (key: TranslationKeys) => {
    return translations[language.code as keyof typeof translations]?.[key] || translations.en[key];
  };

  const getStrategies = () => {
    const { riskTolerance } = profile;
    
    if (riskTolerance === 'low') {
      return {
        allocation: [
          { name: t('debt'), value: 60, color: '#10b981' },
          { name: t('gold'), value: 15, color: '#f59e0b' },
          { name: t('cash'), value: 15, color: '#6366f1' },
          { name: t('equity'), value: 10, color: '#3b82f6' },
        ],
        recommendations: [
          {
            category: t('govtSchemes'),
            items: ['Public Provident Fund (PPF)', 'Sukanya Samriddhi Yojana (SSY)', 'Senior Citizens Savings Scheme (SCSS)'],
            icon: <Landmark className="text-emerald-400" size={18} />
          },
          {
            category: t('mutualFunds'),
            items: ['Liquid Funds', 'Short-term Debt Funds', 'Banking & PSU Debt Funds'],
            icon: <Briefcase className="text-blue-400" size={18} />
          },
          {
            category: t('gold'),
            items: ['Sovereign Gold Bonds (SGB)', 'Gold ETFs'],
            icon: <TrendingUp className="text-amber-400" size={18} />
          }
        ]
      };
    } else if (riskTolerance === 'medium') {
      return {
        allocation: [
          { name: t('equity'), value: 50, color: '#3b82f6' },
          { name: t('debt'), value: 30, color: '#10b981' },
          { name: t('gold'), value: 10, color: '#f59e0b' },
          { name: t('cash'), value: 10, color: '#6366f1' },
        ],
        recommendations: [
          {
            category: t('mutualFunds'),
            items: ['Large Cap Index Funds', 'Flexi Cap Funds', 'Balanced Advantage Funds'],
            icon: <Briefcase className="text-blue-400" size={18} />
          },
          {
            category: t('stocks'),
            items: ['Blue-chip Dividend Stocks', 'Consumer Staples', 'IT Sector Leaders'],
            icon: <TrendingUp className="text-indigo-400" size={18} />
          },
          {
            category: t('govtSchemes'),
            items: ['National Pension System (NPS)', 'PPF'],
            icon: <Landmark className="text-emerald-400" size={18} />
          }
        ]
      };
    } else {
      return {
        allocation: [
          { name: t('equity'), value: 75, color: '#3b82f6' },
          { name: t('debt'), value: 15, color: '#10b981' },
          { name: t('gold'), value: 5, color: '#f59e0b' },
          { name: t('cash'), value: 5, color: '#6366f1' },
        ],
        recommendations: [
          {
            category: t('mutualFunds'),
            items: ['Mid Cap Funds', 'Small Cap Funds', 'Sectoral/Thematic Funds'],
            icon: <Briefcase className="text-blue-400" size={18} />
          },
          {
            category: t('stocks'),
            items: ['Growth Stocks', 'Emerging Tech', 'Small-cap Value Picks'],
            icon: <TrendingUp className="text-indigo-400" size={18} />
          },
          {
            category: t('gold'),
            items: ['Digital Gold', 'Gold Mining Stocks'],
            icon: <TrendingUp className="text-amber-400" size={18} />
          }
        ]
      };
    }
  };

  const strategies = getStrategies();

  const investmentTypes = [
    {
      id: 'stocks',
      name: t('stocks'),
      icon: <TrendingUp size={20} />,
      desc: t('stocksDesc'),
      risk: t('high'),
      riskValue: 80,
      returnValue: 15,
      returns: '12-18% p.a.',
      suitability: profile.riskTolerance === 'high' ? t('suitabilityHigh') : (profile.riskTolerance === 'medium' ? t('suitabilityMedium') : t('suitabilityLow')),
      color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
    },
    {
      id: 'mutualFunds',
      name: t('mutualFunds'),
      icon: <Briefcase size={20} />,
      desc: t('mutualFundsDesc'),
      risk: t('medium') + ' - ' + t('high'),
      riskValue: 60,
      returnValue: 12,
      returns: '10-15% p.a.',
      suitability: profile.riskTolerance === 'low' ? t('suitabilityLow') : t('suitabilityHigh'),
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    {
      id: 'sgb',
      name: t('sgb'),
      icon: <Coins size={20} />,
      desc: t('sgbDesc'),
      risk: t('low'),
      riskValue: 10,
      returnValue: 8,
      returns: '2.5% + Gold Appr.',
      suitability: t('suitabilityHigh'),
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    },
    {
      id: 'ppf',
      name: t('ppf'),
      icon: <Landmark size={20} />,
      desc: t('ppfDesc'),
      risk: t('low'),
      riskValue: 5,
      returnValue: 7.1,
      returns: '7.1% p.a. (Tax Free)',
      suitability: profile.riskTolerance === 'low' ? t('suitabilityHigh') : t('suitabilityMedium'),
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'fd',
      name: t('fd'),
      icon: <Building2 size={20} />,
      desc: t('fdDesc'),
      risk: t('low'),
      riskValue: 2,
      returnValue: 6.5,
      returns: '6-7.5% p.a.',
      suitability: profile.riskTolerance === 'low' ? t('suitabilityHigh') : t('suitabilityLow'),
      color: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  ];

  const growthData = useMemo(() => {
    const years = 10;
    const initialSavings = profile.savings;
    const monthlyInvestment = Math.max(0, (profile.monthlyIncome - profile.monthlyExpenses) * 0.7);
    const annualRate = profile.riskTolerance === 'low' ? 0.07 : (profile.riskTolerance === 'medium' ? 0.12 : 0.15);
    
    const data = [];
    let currentWealth = initialSavings;

    for (let year = 0; year <= years; year++) {
      data.push({
        year: t('yearsCount').replace('{n}', year.toString()),
        wealth: Math.round(currentWealth),
        investment: Math.round(initialSavings + (monthlyInvestment * 12 * year))
      });
      
      // Compound for next year
      currentWealth = (currentWealth + (monthlyInvestment * 12)) * (1 + annualRate);
    }
    return data;
  }, [profile, t]);

  const formatCurrency = (value: number) => {
    const convertedValue = value * currency.rate;
    if (convertedValue >= 10000000) return `${currency.symbol}${(convertedValue / 10000000).toFixed(2)} Cr`;
    if (convertedValue >= 100000) return `${currency.symbol}${(convertedValue / 100000).toFixed(2)} L`;
    return `${currency.symbol}${convertedValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-brand-primary/10 rounded-2xl border border-brand-primary/20">
        <div className="p-2 bg-brand-primary/20 rounded-lg">
          <Shield className="text-brand-primary" size={20} />
        </div>
        <div>
          <p className="text-xs font-bold text-white uppercase tracking-widest">{t('investmentStrategies')}</p>
          <p className="text-[10px] text-slate-400">{t('riskProfileDesc').replace('{risk}', t(profile.riskTolerance))}</p>
        </div>
      </div>

      {/* Allocation Chart */}
      <div className="space-y-4 buttery-glide">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('recommendedAllocation')}</h4>
        <div className="h-48 w-full glass-surface rounded-[2rem] p-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={strategies.allocation}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {strategies.allocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: '#fff', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {strategies.allocation.map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-2 glass-surface rounded-xl border border-white/5 buttery-glide hover:bg-white/10">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] font-medium text-slate-300">{item.name}</span>
              <span className="text-[10px] font-bold text-white ml-auto">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Projected Growth Chart */}
      <div className="space-y-6 pt-4 border-t border-white/5 buttery-glide">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <LineChartIcon className="text-emerald-400" size={18} />
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">{t('projectedGrowth')}</h4>
            <p className="text-[10px] text-slate-500">{t('growthDesc')}</p>
          </div>
        </div>

        <div className="h-64 w-full glass-surface rounded-3xl p-4 border border-white/5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10 }} 
                interval={2}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickFormatter={(val) => `${currency.symbol}${(val * currency.rate / 100000).toFixed(0)}L`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: '#fff', fontSize: '12px' }}
                formatter={(value: number) => [formatCurrency(value), t('estimatedWealth')]}
              />
              <Area 
                type="monotone" 
                dataKey="wealth" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorWealth)" 
                animationDuration={2000}
              />
              <Area 
                type="monotone" 
                dataKey="investment" 
                stroke="#94a3b8" 
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="transparent"
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk-Return Trade-off Visualization */}
      <div className="space-y-6 pt-4 border-t border-white/5 buttery-glide">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/20 rounded-lg">
            <Target className="text-rose-400" size={18} />
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">{t('riskReturnTradeoff')}</h4>
            <p className="text-[10px] text-slate-500">{t('tradeoffDesc')}</p>
          </div>
        </div>

        <div className="h-64 w-full glass-surface rounded-3xl p-4 border border-white/5 relative">
          <div className="absolute left-10 top-4 bottom-10 w-px bg-white/10" />
          <div className="absolute left-10 bottom-10 right-4 h-px bg-white/10" />
          
          <span className="absolute left-2 top-1/2 -rotate-90 text-[8px] font-bold text-slate-500 uppercase tracking-widest">
            {t('expectedReturns')}
          </span>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-slate-500 uppercase tracking-widest">
            {t('potentialRisk')}
          </span>

          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis type="number" dataKey="riskValue" hide domain={[0, 100]} />
              <YAxis type="number" dataKey="returnValue" hide domain={[0, 20]} />
              <ZAxis type="number" range={[100, 400]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: '#fff', fontSize: '12px' }}
                formatter={(value: any, name: string) => [value, name === 'riskValue' ? t('riskLevel') : t('expectedReturns')]}
              />
              {investmentTypes.map((type) => (
                <Scatter 
                  key={type.id}
                  name={type.name} 
                  data={[type]} 
                  fill={type.color.includes('indigo') ? '#818cf8' : (type.color.includes('blue') ? '#3b82f6' : (type.color.includes('amber') ? '#fbbf24' : (type.color.includes('emerald') ? '#10b981' : '#94a3b8')))}
                  shape="circle"
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {investmentTypes.map((type) => (
              <div key={type.id} className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${type.color.split(' ')[0]}`} />
                <span className="text-[8px] text-slate-500 font-bold uppercase">{type.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        {strategies.recommendations.map((rec, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-5 glass-surface rounded-[2rem] border border-white/5 space-y-3 buttery-glide hover:bg-white/10"
          >
            <div className="flex items-center gap-2">
              {rec.icon}
              <h5 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{rec.category}</h5>
            </div>
            <ul className="space-y-2">
              {rec.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-xs text-slate-400">
                  <div className="mt-1.5 w-1 h-1 bg-brand-primary rounded-full shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Investment Guide Section */}
      <div className="space-y-6 pt-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <BookOpen className="text-indigo-400" size={18} />
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">{t('investmentGuide')}</h4>
            <p className="text-[10px] text-slate-500">{t('guideDesc')}</p>
          </div>
        </div>

        <div className="grid gap-4">
          {investmentTypes.map((type) => (
            <motion.div
              key={type.id}
              layout
              onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
              className={`cursor-pointer overflow-hidden rounded-[2rem] border buttery-glide ${
                selectedType === type.id 
                ? 'bg-white/10 border-white/20 shadow-xl' 
                : 'glass-surface border-white/5 hover:bg-white/10'
              }`}
            >
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${type.color.split(' ')[0]}`}>
                    {React.cloneElement(type.icon as React.ReactElement<{ className?: string }>, { className: type.color.split(' ')[1] })}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">{type.name}</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{t('riskLevel')}:</span>
                      <span className={`text-[10px] font-bold ${
                        type.risk.includes(t('high')) ? 'text-rose-400' : (type.risk.includes(t('medium')) ? 'text-amber-400' : 'text-emerald-400')
                      }`}>{type.risk}</span>
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: selectedType === type.id ? 90 : 0 }}
                  className="text-slate-500"
                >
                  <ChevronRight size={20} />
                </motion.div>
              </div>

              <AnimatePresence>
                {selectedType === type.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 pb-5 space-y-4"
                  >
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {type.desc}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{t('expectedReturns')}</p>
                        <p className="text-xs font-bold text-white">{type.returns}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{t('suitability')}</p>
                        <p className={`text-xs font-bold ${
                          type.suitability === t('suitabilityHigh') ? 'text-emerald-400' : (type.suitability === t('suitabilityMedium') ? 'text-amber-400' : 'text-slate-400')
                        }`}>{type.suitability}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                          {profile.riskTolerance === 'low' && type.riskValue < 30 ? t('perfectMatch') : 
                           profile.riskTolerance === 'medium' && type.riskValue >= 30 && type.riskValue <= 60 ? t('greatBalance') :
                           profile.riskTolerance === 'high' && type.riskValue > 60 ? t('growthEngine') : t('diversificationOption')}
                        </span>
                        <ArrowUpRight size={14} className="text-indigo-400" />
                      </div>
                      <p className="text-[10px] text-indigo-300/80 leading-relaxed italic">
                        {profile.riskTolerance === 'low' && type.riskValue < 30 ? t('lowRiskMatchDesc') : 
                         profile.riskTolerance === 'medium' && type.riskValue >= 30 && type.riskValue <= 60 ? t('mediumRiskMatchDesc') :
                         profile.riskTolerance === 'high' && type.riskValue > 60 ? t('highRiskMatchDesc') : 
                         t('diversificationDesc')}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 flex gap-3">
        <Info className="text-amber-500 shrink-0" size={16} />
        <p className="text-[10px] text-amber-500/80 leading-relaxed italic">
          These are general suggestions based on your profile. Always consult with a certified financial planner before making investment decisions.
        </p>
      </div>
    </div>
  );
};

export default InvestmentStrategies;
