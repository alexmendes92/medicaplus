
import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { 
    User, Eraser, Activity, 
    Image as ImageIcon, PenTool, DollarSign, 
    Share2, ShieldCheck, CheckCircle2, AlertTriangle, FileCheck
} from 'lucide-react';
import { OrthopedicBodyMap, ImageWorkspace, SurgicalModule, BillingModule } from './OrthopedicModules';
import { PainPoint } from '../types';

const VisualConsultation: React.FC = () => {
  // --- EPHEMERAL SESSION STATE (No Database) ---
  // Os dados vivem apenas enquanto a tela está aberta ou até o médico clicar em "Nova Sessão"
  const [patientName, setPatientName] = useState('');
  const [activeTab, setActiveTab] = useState<'visual' | 'images' | 'surgery' | 'budget'>('visual');
  const [sessionDate] = useState(new Date().toLocaleDateString('pt-BR'));
  
  // O SessionID é usado como 'key' nos componentes filhos. 
  // Ao mudar o ID, o React desmonta e remonta os componentes, limpando seus estados internos (canvas, inputs, etc)
  const [sessionId, setSessionId] = useState(Date.now()); 
  
  // Estado compartilhado necessário para o relatório
  const [painPoints, setPainPoints] = useState<PainPoint[]>([]);
  const captureRef = useRef<HTMLDivElement>(null);

  // Handlers
  const handleAddPainPoint = (p: PainPoint) => setPainPoints([...painPoints, p]);
  const handleRemovePainPoint = (i: number) => setPainPoints(painPoints.filter((_, idx) => idx !== i));

  const handleResetSession = () => {
      if (confirm('Iniciar nova consulta? Todos os desenhos e dados da tela atual serão perdidos.')) {
          setPatientName('');
          setPainPoints([]);
          setActiveTab('visual');
          setSessionId(Date.now()); // Hard Reset nos componentes filhos
      }
  };

  const handleGenerateReport = async () => {
      if (captureRef.current) {
          try {
              // Captura a área de trabalho visual
              const canvas = await html2canvas(captureRef.current, { 
                  scale: 2, 
                  backgroundColor: '#f8fafc', // igual ao bg-slate-50
                  ignoreElements: (element) => element.classList.contains('no-print')
              });
              
              canvas.toBlob(async (blob) => {
                  if (blob) {
                      const file = new File([blob], `Planejamento_${patientName || 'Paciente'}.png`, { type: 'image/png' });
                      
                      // Tenta usar a API de compartilhamento nativa (Mobile/Tablet)
                      if (navigator.share) {
                          try {
                            await navigator.share({ 
                                files: [file], 
                                title: `Planejamento - ${patientName}`,
                                text: `Olá ${patientName}, aqui está o resumo visual da nossa consulta e o planejamento cirúrgico.`
                            });
                          } catch (err) {
                              console.log('Share cancelled or failed, falling back to download');
                              downloadImage(canvas);
                          }
                      } else {
                          // Fallback para download direto no Desktop
                          downloadImage(canvas);
                      }
                  }
              });
          } catch (e) {
              alert("Erro ao gerar relatório visual. Tente novamente.");
          }
      }
  };

  const downloadImage = (canvas: HTMLCanvasElement) => {
      const link = document.createElement('a');
      link.download = `Planejamento_${patientName || 'Paciente'}.png`;
      link.href = canvas.toDataURL();
      link.click();
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col overflow-hidden animate-fadeIn">
        
        {/* --- HEADER: SESSION CONTEXT & CONTROLS --- */}
        <div className="bg-white border-b border-slate-200 px-4 lg:px-6 py-4 shadow-sm z-20 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
            
            <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0">
                    <Activity className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-lg lg:text-xl font-black text-slate-900 tracking-tight leading-none truncate">Consultório Visual</h1>
                        <span className="hidden sm:flex bg-green-100 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded border border-green-200 items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> LGPD SAFE (DADOS NÃO SALVOS)
                        </span>
                    </div>
                    <div className="relative group max-w-md">
                        <User className="absolute left-0 top-1 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            placeholder="Nome do Paciente (Opcional - Para Relatório)"
                            className="w-full bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none text-sm font-bold text-slate-700 placeholder:text-slate-300 pl-6 pb-1 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                <button 
                    onClick={handleResetSession}
                    className="px-4 py-2.5 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs hover:bg-red-50 hover:text-red-600 transition-all flex items-center gap-2 border border-slate-200 active:scale-95"
                >
                    <Eraser className="w-4 h-4" /> <span className="hidden lg:inline">Nova Sessão</span>
                </button>
                <button 
                    onClick={handleGenerateReport}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2 active:scale-95"
                >
                    <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Enviar para Paciente</span>
                    <span className="sm:hidden">Enviar</span>
                </button>
            </div>
        </div>

        {/* --- MAIN WORKSPACE --- */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
            
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-20 xl:w-64 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-row lg:flex-col shrink-0 overflow-x-auto lg:overflow-visible no-scrollbar z-10">
                {[
                    { id: 'visual', label: 'Mapa de Dor', icon: Activity, desc: 'Localização e Intensidade' },
                    { id: 'images', label: 'Exames & RX', icon: ImageIcon, desc: 'Desenhar sobre imagens' },
                    { id: 'surgery', label: 'Técnica', icon: PenTool, desc: 'Materiais e Procedimento' },
                    { id: 'budget', label: 'Investimento', icon: DollarSign, desc: 'Alto Valor Percebido' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`p-4 xl:p-6 flex lg:flex-col xl:flex-row items-center gap-3 transition-all border-b-2 lg:border-b-0 lg:border-l-4 text-left min-w-[100px] lg:min-w-0 flex-1 lg:flex-none justify-center xl:justify-start
                        ${activeTab === tab.id 
                            ? 'bg-blue-50 border-blue-600 text-blue-800' 
                            : 'bg-white border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                    >
                        <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
                        <div className="hidden xl:block">
                            <span className="block font-bold text-sm leading-tight">{tab.label}</span>
                            <span className="text-[10px] opacity-70 font-medium mt-0.5">{tab.desc}</span>
                        </div>
                        {/* Mobile/Tablet Label (Icon only on small screens handled by css above, but let's allow text if space) */}
                        <span className="xl:hidden text-xs font-bold whitespace-nowrap">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Content Area - Keyed by sessionId to force full reset on "New Session" */}
            <div className="flex-1 bg-slate-50 p-4 lg:p-6 overflow-y-auto" ref={captureRef} key={sessionId}>
                
                {/* Visual Header for PDF Context (Hidden on Screen, Visible on Print/Capture) */}
                {patientName && (
                    <div className="mb-6 hidden print-header">
                        <div className="flex items-center gap-2 mb-2">
                            <FileCheck className="w-5 h-5 text-slate-400" />
                            <h2 className="text-2xl font-black text-slate-900">{patientName}</h2>
                        </div>
                        <p className="text-sm text-slate-500 font-medium border-b border-slate-200 pb-4 mb-4">
                            Planejamento Visual e Orçamentário • {sessionDate}
                        </p>
                    </div>
                )}

                {activeTab === 'visual' && (
                    <div className="h-full flex flex-col animate-fadeIn">
                        <div className="bg-white p-4 lg:p-6 rounded-[2rem] border border-slate-200 shadow-sm mb-6 shrink-0">
                            <h2 className="text-lg font-bold text-slate-900 mb-1">Onde Dói?</h2>
                            <p className="text-xs text-slate-500">Toque no corpo para marcar os pontos de dor e explicar a irradiação.</p>
                        </div>
                        <div className="flex-1 min-h-[500px]">
                            <OrthopedicBodyMap 
                                points={painPoints} 
                                onAddPoint={handleAddPainPoint}
                                onRemovePoint={handleRemovePainPoint}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'images' && (
                    <div className="h-full flex flex-col animate-fadeIn">
                        <div className="bg-white p-4 lg:p-6 rounded-[2rem] border border-slate-200 shadow-sm mb-6 shrink-0">
                            <h2 className="text-lg font-bold text-slate-900 mb-1">Visualizador de Exames</h2>
                            <p className="text-xs text-slate-500">Carregue o RX/Ressonância (foto do celular) e desenhe para ilustrar a lesão.</p>
                        </div>
                        <div className="flex-1 min-h-[500px] bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border border-slate-800">
                            <ImageWorkspace />
                        </div>
                    </div>
                )}

                {activeTab === 'surgery' && (
                    <div className="h-full animate-fadeIn pb-20">
                        <div className="bg-blue-50 p-4 lg:p-6 rounded-[2rem] border border-blue-100 mb-6 flex gap-4 items-start shrink-0">
                            <AlertTriangle className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                            <div>
                                <h2 className="text-lg font-bold text-blue-900 mb-1">Planejamento Cirúrgico</h2>
                                <p className="text-xs text-blue-800/80">
                                    Descreva a técnica e os materiais (OPME). Use isso para justificar a complexidade e o valor do procedimento ao paciente.
                                </p>
                            </div>
                        </div>
                        <SurgicalModule />
                    </div>
                )}

                {activeTab === 'budget' && (
                    <div className="h-full animate-fadeIn pb-20">
                        <div className="bg-green-50 p-4 lg:p-6 rounded-[2rem] border border-green-100 mb-6 flex gap-4 items-start shrink-0">
                            <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                            <div>
                                <h2 className="text-lg font-bold text-green-900 mb-1">Apresentação de Valores</h2>
                                <p className="text-xs text-green-800/80">
                                    Transparência total. Apresente o orçamento demonstrando a complexidade dos materiais e da técnica cirúrgica.
                                </p>
                            </div>
                        </div>
                        <BillingModule />
                    </div>
                )}

            </div>
        </div>
    </div>
  );
};

export default VisualConsultation;
