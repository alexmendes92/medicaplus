
import React, { useState, useEffect } from 'react';
import { 
  Plus, Video, BookOpen, TrendingUp, Sparkles, ChevronRight, Calendar, Activity, Users, PieChart, QrCode, Newspaper, Globe, Bone, GraduationCap, FlaskConical, FileText, Stethoscope, Briefcase, Share2, ShieldCheck, Microscope
} from 'lucide-react';
import { getUpcomingHolidays, Holiday } from '../services/externalApis';
import { UserProfile } from '../types';

interface DashboardProps {
  onSelectTool: (tool: string) => void;
  onQuickAction: (topic: string) => void;
  userProfile: UserProfile;
}

type WorkspaceMode = 'clinical' | 'marketing';

const Dashboard: React.FC<DashboardProps> = ({ onSelectTool, onQuickAction, userProfile }) => {
  const [mode, setMode] = useState<WorkspaceMode>('clinical');
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [inputValue, setInputValue] = useState('');
  
  // API States
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loadingApis, setLoadingApis] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');

    const date = new Date();
    setCurrentDate(date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }));

    const loadData = async () => {
        try {
            const holidayData = await getUpcomingHolidays();
            setHolidays(Array.isArray(holidayData) ? holidayData : []);
        } catch (e) {
            console.error("Dashboard API load error", e);
            setHolidays([]);
        } finally {
            setLoadingApis(false);
        }
    };
    loadData();
  }, []);

  const handleInputSubmit = () => {
      if (inputValue.trim()) {
          onQuickAction(inputValue);
      } else {
          onSelectTool('post');
      }
  };

  return (
    <div className={`pb-32 lg:pb-12 animate-fadeIn min-h-full transition-colors duration-500 ${mode === 'clinical' ? 'bg-[#F8FAFC]' : 'bg-[#F5F3FF]'}`}>
      
      {/* 1. HERO HEADER WITH WORKSPACE TOGGLE */}
      <div className={`relative rounded-b-[3rem] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.06)] border-b overflow-hidden transition-all duration-500 ${mode === 'clinical' ? 'bg-white border-slate-100' : 'bg-slate-900 border-slate-800'}`}>
          
          {/* Abstract BG Shapes */}
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none transition-colors duration-500 ${mode === 'clinical' ? 'bg-blue-50' : 'bg-purple-500/20'}`}></div>
          
          <div className="px-6 pt-8 pb-8 relative z-10">
              
              {/* WORKSPACE SWITCHER */}
              <div className="flex justify-center mb-8">
                  <div className={`p-1 rounded-2xl flex relative shadow-inner border transition-colors duration-300 ${mode === 'clinical' ? 'bg-slate-100 border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
                      <div 
                          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl shadow-md transition-all duration-300 ease-out ${mode === 'clinical' ? 'left-1 bg-white' : 'left-[calc(50%+2px)] bg-indigo-600'}`}
                      ></div>
                      
                      <button 
                          onClick={() => setMode('clinical')}
                          className={`relative z-10 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${mode === 'clinical' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                          <Stethoscope className="w-4 h-4" /> Consultório
                      </button>
                      <button 
                          onClick={() => setMode('marketing')}
                          className={`relative z-10 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${mode === 'marketing' ? 'text-white' : 'text-slate-500 hover:text-slate-600'}`}
                      >
                          <Globe className="w-4 h-4" /> Digital
                      </button>
                  </div>
              </div>

              <div className="flex justify-between items-start mb-8">
                  <div>
                      <div className="flex items-center gap-2 mb-2">
                          <span className={`w-2 h-2 rounded-full animate-pulse ${mode === 'clinical' ? 'bg-green-500' : 'bg-purple-400'}`}></span>
                          <p className={`text-[10px] font-bold uppercase tracking-widest ${mode === 'clinical' ? 'text-slate-400' : 'text-slate-400'}`}>{currentDate}</p>
                      </div>
                      <h1 className={`text-3xl lg:text-4xl font-medium leading-tight tracking-tight ${mode === 'clinical' ? 'text-slate-900' : 'text-white'}`}>
                          {greeting}, <br />
                          <span className={`font-black text-transparent bg-clip-text bg-gradient-to-r ${mode === 'clinical' ? 'from-blue-700 to-indigo-600' : 'from-indigo-300 to-purple-300'}`}>
                              {userProfile.name ? userProfile.name.split(' ')[0] : 'Doutor(a)'}.
                          </span>
                      </h1>
                  </div>
                  
                  {/* Avatar */}
                  <div className="relative group cursor-pointer" onClick={() => onSelectTool('settings')}>
                      <div className={`w-14 h-14 rounded-2xl p-0.5 bg-gradient-to-tr shadow-lg group-hover:scale-105 transition-transform duration-300 ${mode === 'clinical' ? 'from-blue-500 to-cyan-500 shadow-blue-500/20' : 'from-purple-500 to-pink-500 shadow-purple-500/30'}`}>
                          {userProfile.photoUrl ? (
                              <img src={userProfile.photoUrl} className="w-full h-full rounded-2xl object-cover border-2 border-white" alt="Profile" />
                          ) : (
                              <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center font-bold text-slate-400 text-xl border-2 border-white">
                                  {userProfile.name ? userProfile.name[0] : 'U'}
                              </div>
                          )}
                      </div>
                  </div>
              </div>

              {/* SEARCH PILL (Context Aware) */}
              <div className="relative w-full max-w-2xl mx-auto transform hover:scale-[1.01] transition-all duration-300">
                  <div className={`absolute -inset-1 bg-gradient-to-r rounded-[1.7rem] blur opacity-20 group-hover:opacity-30 transition-opacity ${mode === 'clinical' ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500'}`}></div>
                  <div className={`relative rounded-[1.5rem] shadow-xl flex items-center p-2 border ${mode === 'clinical' ? 'bg-white shadow-slate-200/50 border-slate-100' : 'bg-slate-800 shadow-black/20 border-slate-700'}`}>
                      <div className="pl-4 pr-3">
                          {mode === 'clinical' ? (
                              <Users className="w-6 h-6 text-blue-500 animate-pulse" />
                          ) : (
                              <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                          )}
                      </div>
                      <input 
                          type="text" 
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder={mode === 'clinical' ? "Buscar protocolo, score ou anatomia..." : "Sobre o que vamos criar hoje?"}
                          className={`flex-1 py-4 bg-transparent border-none focus:outline-none text-lg font-medium ${mode === 'clinical' ? 'text-slate-900 placeholder:text-slate-400' : 'text-white placeholder:text-slate-500'}`}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleInputSubmit(); }}
                      />
                      <button 
                        onClick={handleInputSubmit}
                        className={`text-white p-3.5 rounded-xl shadow-lg transition-colors active:scale-95 ${mode === 'clinical' ? 'bg-slate-900 hover:bg-blue-600' : 'bg-indigo-600 hover:bg-indigo-500'}`}
                      >
                          <ChevronRight className="w-5 h-5" />
                      </button>
                  </div>
              </div>
          </div>
      </div>

      <div className="px-6 mt-8 space-y-10 lg:space-y-12 max-w-7xl mx-auto">
        
        {/* =================================================================================
            WORKSPACE: CLÍNICO (CONSULTÓRIO)
           ================================================================================= */}
        {mode === 'clinical' && (
            <div className="animate-slideUp space-y-10">
                
                {/* 1. Primary Action: Visual Consultation (NEW PIVOT) */}
                <div 
                    onClick={() => onSelectTool('patients')}
                    className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 cursor-pointer group hover:shadow-2xl hover:border-blue-100 transition-all relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-[100%] opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex gap-6 items-center">
                            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:rotate-3 transition-transform">
                                <Activity className="w-10 h-10" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Consultório Visual</h3>
                                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded border border-green-200 flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" /> LGPD Safe
                                    </span>
                                </div>
                                <p className="text-slate-500 font-medium max-w-lg">
                                    Explique diagnósticos, desenhe em exames e apresente orçamentos cirúrgicos visualmente. Gere PDFs na hora. <strong>Sem cadastro prévio.</strong>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-900 text-white px-6 py-4 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 group-hover:bg-blue-600 transition-colors">
                                Iniciar Sessão <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Clinical Tools Grid */}
                <div>
                    <h2 className="text-lg font-black text-slate-900 mb-5 px-2 flex items-center gap-2">
                        <Microscope className="w-5 h-5 text-blue-600" />
                        Ferramentas de Decisão & Risco
                    </h2>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <button onClick={() => onSelectTool('clinical')} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all text-left group relative overflow-hidden active:scale-95 hover:border-indigo-200">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                                <Activity className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">SARC-F</h3>
                            <p className="text-xs text-slate-500 mt-1">Risco Cirúrgico (Idoso)</p>
                        </button>

                        <button onClick={() => onSelectTool('frax')} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all text-left group relative overflow-hidden active:scale-95 hover:border-violet-200">
                            <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600 mb-4 group-hover:scale-110 transition-transform">
                                <Bone className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">FRAX</h3>
                            <p className="text-xs text-slate-500 mt-1">Risco de Fratura</p>
                        </button>

                        <button onClick={() => onSelectTool('calculator')} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all text-left group relative overflow-hidden active:scale-95 hover:border-emerald-200">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">RTS Calc</h3>
                            <p className="text-xs text-slate-500 mt-1">Retorno ao Esporte</p>
                        </button>

                        <button onClick={() => onSelectTool('prescription')} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all text-left group relative overflow-hidden active:scale-95 hover:border-orange-200">
                            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
                                <Video className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">Prescrição</h3>
                            <p className="text-xs text-slate-500 mt-1">Vídeos de Reabilitação</p>
                        </button>
                    </div>
                </div>

                {/* 3. Support Tools */}
                <div>
                    <h2 className="text-lg font-black text-slate-900 mb-5 px-2 flex items-center gap-2">
                        <FlaskConical className="w-5 h-5 text-slate-500" />
                        Apoio Diagnóstico
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button onClick={() => onSelectTool('scores')} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 hover:bg-white hover:shadow-md transition-all">
                            <div className="bg-white p-2 rounded-xl shadow-sm"><FileText className="w-5 h-5 text-indigo-600" /></div>
                            <div className="text-left">
                                <span className="block font-bold text-sm text-slate-900">Scores (Lysholm/IKDC)</span>
                                <span className="text-xs text-slate-500">Avaliação Funcional</span>
                            </div>
                        </button>
                        <button onClick={() => onSelectTool('visco')} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 hover:bg-white hover:shadow-md transition-all">
                            <div className="bg-white p-2 rounded-xl shadow-sm"><Activity className="w-5 h-5 text-blue-600" /></div>
                            <div className="text-left">
                                <span className="block font-bold text-sm text-slate-900">Viscosuplementação</span>
                                <span className="text-xs text-slate-500">Gestão de Ciclo</span>
                            </div>
                        </button>
                        <button onClick={() => onSelectTool('anatomy')} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 hover:bg-white hover:shadow-md transition-all">
                            <div className="bg-white p-2 rounded-xl shadow-sm"><Bone className="w-5 h-5 text-slate-600" /></div>
                            <div className="text-left">
                                <span className="block font-bold text-sm text-slate-900">Anatomia 3D</span>
                                <span className="text-xs text-slate-500">Modelos Interativos</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* =================================================================================
            WORKSPACE: MARKETING (POSICIONAMENTO DIGITAL)
           ================================================================================= */}
        {mode === 'marketing' && (
            <div className="animate-slideUp space-y-10">
                
                {/* 1. Studio Grid */}
                <div>
                    <h2 className="text-lg font-black text-slate-900 mb-5 px-2 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        Studio de Criação
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Hero Creator */}
                        <button 
                            onClick={() => onSelectTool('post')}
                            className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group active:scale-[0.98]"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-purple-500/20 transition-colors duration-500"></div>
                            
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                                        <Plus className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="px-3 py-1 bg-purple-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                                        IA Generativa
                                    </div>
                                </div>
                                
                                <div className="mt-8">
                                    <h3 className="text-2xl font-black mb-2 tracking-tight">Criar Post para Instagram</h3>
                                    <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-md">
                                        Gere legendas, hashtags e imagens exclusivas focadas em educação do paciente.
                                    </p>
                                </div>
                            </div>
                        </button>

                        <div className="space-y-4">
                            <button 
                                onClick={() => onSelectTool('video')}
                                className="w-full bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:border-red-100 hover:shadow-lg transition-all active:scale-[0.98] text-left group relative overflow-hidden h-[calc(50%-8px)]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                                        <Video className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-base">Vídeo Studio</h3>
                                        <p className="text-xs text-slate-500">Roteiros Virais</p>
                                    </div>
                                </div>
                            </button>

                            <button 
                                onClick={() => onSelectTool('seo')}
                                className="w-full bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:border-blue-100 hover:shadow-lg transition-all active:scale-[0.98] text-left group relative overflow-hidden h-[calc(50%-8px)]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-base">Blog Médico</h3>
                                        <p className="text-xs text-slate-500">Artigos SEO</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. Brand Management */}
                <div>
                    <h2 className="text-lg font-black text-slate-900 mb-5 px-2 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-indigo-600" />
                        Gestão de Autoridade
                    </h2>
                    
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                        <button onClick={() => onSelectTool('marketing_roi')} className="p-4 hover:bg-slate-50 rounded-2xl transition-colors text-left flex flex-col gap-3 group">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="block font-bold text-sm text-slate-900">Simulador de ROI</span>
                                <span className="text-xs text-slate-500">Quanto você deixa na mesa?</span>
                            </div>
                        </button>

                        <button onClick={() => onSelectTool('trends')} className="p-4 hover:bg-slate-50 rounded-2xl transition-colors text-left flex flex-col gap-3 group">
                            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="block font-bold text-sm text-slate-900">Trends Alert</span>
                                <span className="text-xs text-slate-500">O que está em alta</span>
                            </div>
                        </button>

                        <button onClick={() => onSelectTool('card')} className="p-4 hover:bg-slate-50 rounded-2xl transition-colors text-left flex flex-col gap-3 group">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform">
                                <QrCode className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="block font-bold text-sm text-slate-900">Cartão Digital</span>
                                <span className="text-xs text-slate-500">Link na Bio</span>
                            </div>
                        </button>

                        <button onClick={() => onSelectTool('site')} className="p-4 hover:bg-slate-50 rounded-2xl transition-colors text-left flex flex-col gap-3 group">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                <Globe className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="block font-bold text-sm text-slate-900">Meu Site</span>
                                <span className="text-xs text-slate-500">Biblioteca Pessoal</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* 3. News Feed Widget */}
                {holidays.length > 0 && (
                    <div className="bg-indigo-50 rounded-[2rem] p-6 border border-indigo-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-white p-3 rounded-xl shadow-sm text-indigo-600">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-indigo-900">Oportunidade de Conteúdo</h3>
                                <p className="text-xs text-indigo-700 mt-0.5">
                                    Próxima data: <strong>{holidays[0].localName}</strong> em {holidays[0].daysUntil} dias.
                                </p>
                            </div>
                        </div>
                        <button onClick={() => onQuickAction(`Post sobre ${holidays[0].localName} na ortopedia`)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-indigo-700 transition-colors">
                            Criar Agora
                        </button>
                    </div>
                )}
            </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
