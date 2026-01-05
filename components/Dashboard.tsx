
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { 
    PlusSquare, Video, BookOpen, Activity, 
    Zap, Search, ArrowRight, Flame
} from 'lucide-react';

interface DashboardProps {
    onSelectTool: (tool: string) => void;
    onQuickAction: (topic: string) => void;
    userProfile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectTool, onQuickAction, userProfile }) => {
    const [greeting, setGreeting] = useState('Olá');
    const [currentDate, setCurrentDate] = useState('');
    const [quickTopic, setQuickTopic] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Bom dia');
        else if (hour < 18) setGreeting('Boa tarde');
        else setGreeting('Boa noite');

        const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
        setCurrentDate(new Date().toLocaleDateString('pt-BR', dateOptions));
    }, []);

    const handleQuickEnter = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && quickTopic.trim()) {
            onQuickAction(quickTopic);
        }
    };

    return (
        <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-12 animate-fadeIn">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{currentDate}</p>
                    </div>
                    <h1 className="text-3xl lg:text-5xl font-medium leading-tight text-slate-900 tracking-tight">
                        {greeting}, <br />
                        <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            {userProfile.name ? userProfile.name.split(' ')[0] : 'Doutor(a)'}.
                        </span>
                    </h1>
                </div>
                
                {/* Profile Widget */}
                <div 
                    className="relative group cursor-pointer" 
                    onClick={() => onSelectTool('settings')}
                >
                    <div className="w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-tr from-blue-500 to-purple-500 shadow-xl group-hover:scale-105 transition-transform duration-300">
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

            {/* Quick Action Input */}
            <div className="relative z-10 group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative bg-white p-2 rounded-3xl shadow-lg border border-slate-100 flex items-center">
                    <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                        <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    </div>
                    <input 
                        type="text" 
                        value={quickTopic}
                        onChange={(e) => setQuickTopic(e.target.value)}
                        onKeyDown={handleQuickEnter}
                        placeholder="Sobre o que você quer postar hoje? (Ex: Dor no Ombro)"
                        className="flex-1 bg-transparent px-4 py-3 text-lg font-medium outline-none text-slate-700 placeholder:text-slate-300"
                    />
                    <button 
                        onClick={() => quickTopic.trim() && onQuickAction(quickTopic)}
                        className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-md"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { id: 'post', label: 'Criar Post', icon: PlusSquare, color: 'text-purple-600', bg: 'bg-purple-50', desc: 'Instagram Feed & Stories' },
                    { id: 'video', label: 'Vídeo Studio', icon: Video, color: 'text-red-600', bg: 'bg-red-50', desc: 'Roteiros & Podcast' },
                    { id: 'seo', label: 'Artigo SEO', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Blog Otimizado' },
                    { id: 'clinical', label: 'Ferramentas Clínicas', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Calculadoras & Scores' },
                ].map(tool => (
                    <button 
                        key={tool.id}
                        onClick={() => onSelectTool(tool.id)}
                        className="group relative p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity`}>
                            <tool.icon className={`w-24 h-24 ${tool.color}`} />
                        </div>
                        <div className={`w-12 h-12 rounded-2xl ${tool.bg} ${tool.color} flex items-center justify-center mb-4`}>
                            <tool.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{tool.label}</h3>
                        <p className="text-xs text-slate-500 font-medium">{tool.desc}</p>
                    </button>
                ))}
            </div>

            {/* Recent Activity / Suggestions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4 text-indigo-300 text-xs font-bold uppercase tracking-widest">
                            <Flame className="w-4 h-4" /> Destaque
                        </div>
                        <h2 className="text-2xl font-black mb-2">Marketing ROI</h2>
                        <p className="text-indigo-200 text-sm mb-6 leading-relaxed max-w-sm">
                            Calcule o retorno sobre investimento das suas campanhas e simule o crescimento do consultório.
                        </p>
                        <button 
                            onClick={() => onSelectTool('marketing_roi')}
                            className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors"
                        >
                            Acessar Simulador
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden group cursor-pointer" onClick={() => onSelectTool('trends')}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4 text-orange-600 text-xs font-bold uppercase tracking-widest">
                            <Search className="w-4 h-4" /> Tendências
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Trend Analyzer</h2>
                        <p className="text-slate-500 text-sm mb-6 leading-relaxed max-w-sm">
                            Descubra o que os pacientes estão pesquisando hoje e crie conteúdo viral.
                        </p>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:gap-4 transition-all">
                            Ver Trends <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
