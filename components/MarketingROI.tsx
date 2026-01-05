
import React, { useState } from 'react';
import { 
    PieChart, DollarSign, Users, TrendingUp, 
    Calculator, RefreshCw, Target, Wallet, Sparkles,
    ArrowRight, CheckCircle2, AlertCircle
} from 'lucide-react';
import { generateMarketingAnalysis } from '../services/geminiService';

const MarketingROI: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'campaign' | 'growth'>('growth');

  // --- GROWTH SIMULATOR STATE ---
  const [ticketSurgery, setTicketSurgery] = useState('15000'); // Default 15k
  const [monthlyConsultations, setMonthlyConsultations] = useState('40');
  const [currentConversion, setCurrentConversion] = useState('10'); // 10% conversion rate
  const [projectedLift, setProjectedLift] = useState('5'); // +5% conversion lift with visual tool

  // --- CAMPAIGN METRICS STATE ---
  const [adSpend, setAdSpend] = useState('');
  const [leads, setLeads] = useState('');
  const [patients, setPatients] = useState('');
  
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

  // Format currency
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // --- HANDLERS ---

  const calculateCampaign = async () => {
      const spend = parseFloat(adSpend) || 0;
      const numLeads = parseFloat(leads) || 0;
      const numPatients = parseFloat(patients) || 0;
      const avgTicket = parseFloat(ticketSurgery) || 0;

      if (spend === 0 || numPatients === 0) return;

      const cac = spend / numPatients;
      const cpl = numLeads > 0 ? spend / numLeads : 0;
      const revenue = numPatients * avgTicket;
      const profit = revenue - spend;
      const roi = spend > 0 ? (profit / spend) * 100 : 0;
      const conversionRate = numLeads > 0 ? (numPatients / numLeads) * 100 : 0;

      setMetrics({ cac, cpl, revenue, roi, conversionRate });
      
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

  // --- GROWTH CALCULATIONS ---
  const ticket = parseFloat(ticketSurgery) || 0;
  const volume = parseFloat(monthlyConsultations) || 0;
  const baseConv = parseFloat(currentConversion) / 100;
  const lift = parseFloat(projectedLift) / 100;
  const newConv = baseConv + lift;

  const currentSurgeries = Math.round(volume * baseConv);
  const newSurgeries = Math.round(volume * newConv);
  const extraSurgeries = newSurgeries - currentSurgeries;
  
  const currentRevenue = currentSurgeries * ticket;
  const newRevenue = newSurgeries * ticket;
  const extraRevenue = newRevenue - currentRevenue;
  const annualExtra = extraRevenue * 12;

  return (
    <div className="h-full flex flex-col bg-slate-50 animate-fadeIn pb-24 lg:pb-0">
        
        {/* TABS HEADER */}
        <div className="px-6 pt-6 pb-2">
            <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex">
                <button 
                    onClick={() => setActiveTab('growth')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'growth' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <TrendingUp className="w-4 h-4" /> Simulador de Crescimento
                </button>
                <button 
                    onClick={() => setActiveTab('campaign')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'campaign' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <Target className="w-4 h-4" /> Calc. de Campanhas
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6 no-scrollbar">
            
            {/* === TAB 1: GROWTH SIMULATOR (THE SALES PITCH) === */}
            {activeTab === 'growth' && (
                <div className="max-w-3xl mx-auto space-y-6 animate-slideUp">
                    
                    {/* The "Hook" Card */}
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-yellow-300" />
                                O Poder da Conversão Visual
                            </h2>
                            <p className="text-emerald-100 font-medium text-sm max-w-lg leading-relaxed">
                                A maioria dos pacientes não fecha cirurgia porque <strong>não entende a gravidade</strong>. 
                                Usar o Consultório Visual para desenhar a lesão e explicar a técnica aumenta sua autoridade e conversão.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* INPUTS */}
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-5">
                            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-100 pb-3">Seus Números Atuais</h3>
                            
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ticket Médio (Cirurgia)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-3.5 w-5 h-5 text-emerald-600" />
                                    <input 
                                        type="number" 
                                        value={ticketSurgery} 
                                        onChange={e => setTicketSurgery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Consultas/Mês</label>
                                    <input 
                                        type="number" 
                                        value={monthlyConsultations} 
                                        onChange={e => setMonthlyConsultations(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Conv. Atual (%)</label>
                                    <input 
                                        type="number" 
                                        value={currentConversion} 
                                        onChange={e => setCurrentConversion(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <label className="block text-xs font-bold text-blue-800 uppercase mb-2">Impacto da Ferramenta (+%)</label>
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="range" 
                                        min="1" max="20" 
                                        value={projectedLift} 
                                        onChange={e => setProjectedLift(e.target.value)}
                                        className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <span className="text-xl font-black text-blue-600">+{projectedLift}%</span>
                                </div>
                                <p className="text-[10px] text-blue-600/80 mt-2 leading-tight">
                                    Estimativa conservadora: Ferramentas visuais aumentam a retenção e confiança em média 15-30%.
                                </p>
                            </div>
                        </div>

                        {/* RESULTS */}
                        <div className="space-y-6">
                            {/* Comparison Card */}
                            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm h-full flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Wallet className="w-24 h-24" />
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Cenário Atual</p>
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-2xl font-bold text-slate-700">{formatCurrency(currentRevenue)}</span>
                                        <span className="text-sm text-slate-400">/mês</span>
                                    </div>

                                    <div className="w-full h-px bg-slate-100 my-4"></div>

                                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" /> Com Consultório Visual
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-slate-900">{formatCurrency(newRevenue)}</span>
                                        <span className="text-sm text-emerald-600 font-bold">+{extraSurgeries} cirurgias</span>
                                    </div>
                                </div>

                                <div className="mt-6 bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                                    <div className="flex items-center gap-3 mb-1">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                        <span className="font-bold text-emerald-900 text-sm">O ROI é imediato</span>
                                    </div>
                                    <p className="text-xs text-emerald-800 leading-relaxed">
                                        Basta fechar <strong>1 cirurgia extra</strong> para pagar a licença anual da ferramenta e ainda lucrar <strong>{formatCurrency(ticket - 1000)}</strong> (estimado).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Annual Projection */}
                    <div className="bg-slate-900 rounded-[2rem] p-8 text-center text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10">
                            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-2">Potencial Anual Extra</p>
                            <h3 className="text-5xl lg:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                + {formatCurrency(annualExtra)}
                            </h3>
                            <p className="text-slate-400 text-xs mt-4 max-w-md mx-auto">
                                *Projeção baseada apenas na melhoria da taxa de conversão, mantendo o mesmo investimento em marketing.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* === TAB 2: CAMPAIGN CALCULATOR (LEGACY) === */}
            {activeTab === 'campaign' && (
                <div className="max-w-2xl mx-auto space-y-6 animate-slideUp">
                    {/* Inputs Card */}
                    <div className="bg-white p-5 lg:p-8 rounded-3xl border border-slate-200 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Calculator className="w-5 h-5" /></div>
                            Dados da Campanha
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Investimento (Ads)</label>
                                <input 
                                    type="number" 
                                    value={adSpend}
                                    onChange={e => setAdSpend(e.target.value)}
                                    placeholder="Ex: 2000"
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Ticket Médio</label>
                                <input 
                                    type="number" 
                                    value={ticketSurgery}
                                    onChange={e => setTicketSurgery(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Leads</label>
                                <input 
                                    type="number" 
                                    value={leads}
                                    onChange={e => setLeads(e.target.value)}
                                    placeholder="50"
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Pacientes</label>
                                <input 
                                    type="number" 
                                    value={patients}
                                    onChange={e => setPatients(e.target.value)}
                                    placeholder="10"
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={calculateCampaign}
                            disabled={loadingInsight}
                            className="w-full mt-8 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-5 h-5 ${loadingInsight ? 'animate-spin' : ''}`} /> 
                            {loadingInsight ? "Analisando..." : "Calcular Resultados"}
                        </button>
                    </div>

                    {/* Metrics Results */}
                    {metrics && (
                        <div className="animate-slideUp space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Custo por Paciente (CAC)</p>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{formatCurrency(metrics.cac)}</h3>
                                </div>
                                <div className={`p-6 rounded-3xl border shadow-sm ${metrics.roi > 0 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-red-50 text-white border-red-500'}`}>
                                    <p className="text-xs font-bold text-white/80 uppercase tracking-wide mb-2">ROI (Retorno)</p>
                                    <h3 className="text-4xl font-black">{metrics.roi.toFixed(0)}%</h3>
                                </div>
                            </div>
                            
                            {/* AI Insight */}
                            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex gap-4 items-start shadow-sm">
                                <div className="bg-blue-100 p-2 rounded-xl text-blue-600 shrink-0"><Sparkles className="w-6 h-6" /></div>
                                <div className="text-sm text-blue-900 leading-relaxed">
                                    <span className="font-black block mb-2 text-xs uppercase tracking-wider opacity-70">Diagnóstico da IA</span>
                                    {aiInsight ? <p className="animate-fadeIn">{aiInsight}</p> : <div className="w-full h-4 bg-blue-200 rounded animate-pulse"></div>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
    </div>
  );
};

export default MarketingROI;
