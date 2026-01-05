
import React, { useState, useEffect } from 'react';
import { 
    PieChart, DollarSign, Users, TrendingUp, ArrowRight, 
    Calculator, RefreshCw, Target, Wallet, Sparkles
} from 'lucide-react';
import { generateMarketingAnalysis } from '../services/geminiService';

const MarketingROI: React.FC = () => {
  // Inputs
  const [adSpend, setAdSpend] = useState('');
  const [leads, setLeads] = useState('');
  const [patients, setPatients] = useState('');
  const [ticket, setTicket] = useState('');

  // Results
  const [metrics, setMetrics] = useState<{
      cac: number;
      cpl: number;
      revenue: number;
      roi: number;
      conversionRate: number;
  } | null>(null);

  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const calculate = async () => {
      const spend = parseFloat(adSpend) || 0;
      const numLeads = parseFloat(leads) || 0;
      const numPatients = parseFloat(patients) || 0;
      const avgTicket = parseFloat(ticket) || 0;

      if (spend === 0 || numPatients === 0) return;

      const cac = spend / numPatients;
      const cpl = numLeads > 0 ? spend / numLeads : 0;
      const revenue = numPatients * avgTicket;
      const profit = revenue - spend;
      const roi = spend > 0 ? (profit / spend) * 100 : 0;
      const conversionRate = numLeads > 0 ? (numPatients / numLeads) * 100 : 0;

      setMetrics({ cac, cpl, revenue, roi, conversionRate });
      
      // Get AI Insight
      setLoadingInsight(true);
      setAiInsight(null);
      try {
          const insight = await generateMarketingAnalysis({ spend, leads: numLeads, patients: numPatients, revenue });
          setAiInsight(insight);
      } catch (e) {
          console.error(e);
      } finally {
          setLoadingInsight(false);
      }
  };

  // Format currency
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="h-full flex flex-col bg-slate-50 animate-fadeIn pb-24 lg:pb-0">
        
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 no-scrollbar">
            
            <div className="max-w-2xl mx-auto space-y-6">
                
                {/* Inputs Card */}
                <div className="bg-white p-5 lg:p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><Calculator className="w-5 h-5" /></div>
                        Dados da Campanha
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Investimento Total (Ads)</label>
                            <div className="relative group">
                                <DollarSign className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                <input 
                                    type="number" 
                                    value={adSpend}
                                    onChange={e => setAdSpend(e.target.value)}
                                    placeholder="Ex: 2000"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono font-bold text-lg text-slate-900 placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Ticket Médio</label>
                            <div className="relative group">
                                <Wallet className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                <input 
                                    type="number" 
                                    value={ticket}
                                    onChange={e => setTicket(e.target.value)}
                                    placeholder="Ex: 800"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono font-bold text-lg text-slate-900 placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Leads (Contatos)</label>
                            <div className="relative group">
                                <Target className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                <input 
                                    type="number" 
                                    value={leads}
                                    onChange={e => setLeads(e.target.value)}
                                    placeholder="Ex: 50"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono font-bold text-lg text-slate-900 placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Pacientes Agendados</label>
                            <div className="relative group">
                                <Users className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                <input 
                                    type="number" 
                                    value={patients}
                                    onChange={e => setPatients(e.target.value)}
                                    placeholder="Ex: 10"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono font-bold text-lg text-slate-900 placeholder:text-slate-300"
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={calculate}
                        disabled={loadingInsight}
                        className="w-full mt-8 bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95 touch-manipulation text-lg disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${loadingInsight ? 'animate-spin' : ''}`} /> 
                        {loadingInsight ? "Analisando..." : "Calcular Resultados"}
                    </button>
                </div>

                {/* Metrics Results */}
                {metrics && (
                    <div className="animate-slideUp space-y-4">
                        
                        {/* Main Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm relative overflow-hidden">
                                <div className="absolute right-0 top-0 w-20 h-20 bg-emerald-50 rounded-bl-full -mr-6 -mt-6"></div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Custo por Paciente (CAC)</p>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{formatCurrency(metrics.cac)}</h3>
                                <p className="text-xs text-slate-400 mt-2 font-medium">Quanto custou cada agendamento.</p>
                            </div>

                            <div className={`p-6 rounded-3xl border shadow-sm relative overflow-hidden ${metrics.roi > 0 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-red-50 text-white border-red-500'}`}>
                                <div className="absolute right-0 top-0 w-20 h-20 bg-white/10 rounded-bl-full -mr-6 -mt-6"></div>
                                <p className="text-xs font-bold text-white/80 uppercase tracking-wide mb-2">ROI (Retorno)</p>
                                <h3 className="text-4xl font-black">{metrics.roi.toFixed(0)}%</h3>
                                <p className="text-xs text-white/80 mt-2 font-medium">Para cada R$1, voltou R${((metrics.roi/100) + 1).toFixed(2)}.</p>
                            </div>
                        </div>

                        {/* Secondary Stats */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-6 text-sm flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-slate-400" /> Detalhamento Financeiro
                            </h3>
                            
                            <div className="space-y-5">
                                <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                                    <span className="text-sm text-slate-500 font-medium">Custo por Lead (CPL)</span>
                                    <span className="font-bold text-slate-900 text-lg">{formatCurrency(metrics.cpl)}</span>
                                </div>
                                <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                                    <span className="text-sm text-slate-500 font-medium">Taxa de Conversão</span>
                                    <span className="font-bold text-slate-900 text-lg">{metrics.conversionRate.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-sm font-bold text-emerald-700">Receita Gerada</span>
                                    <span className="text-2xl font-black text-emerald-600">{formatCurrency(metrics.revenue)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Insight AI */}
                        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex gap-4 items-start shadow-sm">
                            <div className="bg-blue-100 p-2 rounded-xl text-blue-600 shrink-0">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div className="text-sm text-blue-900 leading-relaxed">
                                <span className="font-black block mb-2 text-xs uppercase tracking-wider opacity-70">Diagnóstico da IA</span>
                                {aiInsight ? (
                                    <p className="animate-fadeIn">{aiInsight}</p>
                                ) : (
                                    <div className="flex gap-1 items-center opacity-50">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                )}

            </div>
        </div>
    </div>
  );
};

export default MarketingROI;
