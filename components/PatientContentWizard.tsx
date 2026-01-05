
import React, { useState, useRef } from 'react';
import { generateAppointmentMessage } from '../services/geminiService';
import { Appointment, Tone } from '../types';
import html2canvas from 'html2canvas';
import { 
    User, Send, Sparkles, Check, Copy, Share2, Flame, RefreshCw, Zap,
    Stethoscope, FileText, CalendarCheck, HelpCircle, Loader2
} from 'lucide-react';

type IntentType = 'surgery' | 'post_op' | 'exam' | 'checkin';

const PatientContentWizard: React.FC = () => {
  const [patientName, setPatientName] = useState('');
  const [intent, setIntent] = useState<IntentType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const intents = [
      { id: 'surgery', label: 'Agendar Cirurgia', icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-50', prompt: 'Mensagem para agendar cirurgia. Confirmar data, jejum e local.' },
      { id: 'post_op', label: 'Pós-Operatório', icon: Stethoscope, color: 'text-green-600', bg: 'bg-green-50', prompt: 'Mensagem de acompanhamento pós-operatório. Perguntar sobre dor e curativo.' },
      { id: 'exam', label: 'Explicar Exame', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50', prompt: 'Explicação simplificada de resultado de exame (RM ou RX).' },
      { id: 'checkin', label: 'Retorno/Check-in', icon: HelpCircle, color: 'text-orange-600', bg: 'bg-orange-50', prompt: 'Mensagem de reativação para paciente sumido ou retorno de rotina.' },
  ];

  const handleGenerate = async (selectedIntent: IntentType) => {
      if (!patientName) {
          alert("Digite o nome do paciente.");
          return;
      }
      setIntent(selectedIntent);
      setIsGenerating(true);
      setGeneratedMessage('');

      const selectedObj = intents.find(i => i.id === selectedIntent);
      
      try {
          const mockApt: Appointment = {
              id: 'temp',
              patientName: patientName,
              date: new Date().toISOString().split('T')[0],
              time: '00:00',
              type: 'first_visit',
              status: 'confirmed',
              phone: ''
          };

          const msg = await generateAppointmentMessage({ 
              appointment: mockApt, 
              tone: Tone.EMPATHETIC,
              customNote: selectedObj?.prompt 
          });
          setGeneratedMessage(msg);
      } catch (e) {
          setGeneratedMessage("Erro ao gerar. Tente novamente.");
      } finally {
          setIsGenerating(false);
      }
  };

  const handleCopy = () => {
      navigator.clipboard.writeText(generatedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const handleShareImage = async () => {
      if (captureRef.current) {
          try {
              const canvas = await html2canvas(captureRef.current, { scale: 2, backgroundColor: '#ffffff' });
              canvas.toBlob(async (blob) => {
                  if (blob) {
                      const file = new File([blob], 'orientacao.png', { type: 'image/png' });
                      if (navigator.share) {
                          await navigator.share({ files: [file], title: 'Orientação Médica' });
                      } else {
                          const link = document.createElement('a');
                          link.download = 'orientacao.png';
                          link.href = canvas.toDataURL();
                          link.click();
                      }
                  }
              });
          } catch (e) { alert("Erro ao criar imagem."); }
      }
  };

  const reset = () => {
      setIntent(null);
      setGeneratedMessage('');
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col pb-24 lg:pb-0 animate-fadeIn">
        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
            <div className="max-w-md mx-auto space-y-8">
                
                {/* 1. Patient Input */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm transition-all hover:shadow-md">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4 ml-1">Para quem é a mensagem?</label>
                    <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                            <User className="w-6 h-6" />
                        </div>
                        <input 
                            type="text" 
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            placeholder="Nome do Paciente"
                            className="w-full font-bold text-lg text-slate-900 outline-none placeholder:text-slate-300 bg-transparent"
                        />
                    </div>
                </div>

                {/* 2. Action Grid */}
                {!generatedMessage && !isGenerating && (
                    <div className="animate-slideUp">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4 ml-1">Objetivo da Comunicação</label>
                        <div className="grid grid-cols-2 gap-4">
                            {intents.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleGenerate(item.id as IntentType)}
                                    className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all text-left flex flex-col gap-3 group active:scale-[0.98]"
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${item.bg} ${item.color}`}>
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <span className="font-bold text-slate-900 text-sm leading-tight">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Loading */}
                {isGenerating && (
                    <div className="py-20 text-center animate-pulse flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 relative">
                            <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                            <Sparkles className="w-8 h-8 text-blue-500" />
                        </div>
                        <p className="font-black text-slate-900 text-lg">Escrevendo...</p>
                        <p className="text-sm text-slate-500 mt-1">IA personalizando para {patientName}</p>
                    </div>
                )}

                {/* 3. Result Area */}
                {generatedMessage && (
                    <div className="animate-scaleIn space-y-6">
                        <div ref={captureRef} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                                    <Flame className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Dr. Carlos Franciozi</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ortopedia</p>
                                </div>
                            </div>
                            
                            <textarea 
                                value={generatedMessage}
                                onChange={(e) => setGeneratedMessage(e.target.value)}
                                className="w-full h-56 resize-none outline-none text-slate-600 font-medium text-base leading-relaxed bg-transparent"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={handleShareImage} className="py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 active:scale-95 hover:bg-indigo-700 transition-all">
                                <Share2 className="w-4 h-4" /> Imagem
                            </button>
                            <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(generatedMessage)}`, '_blank')} className="py-4 bg-[#25D366] text-white rounded-2xl font-bold text-sm shadow-xl shadow-green-500/20 flex items-center justify-center gap-2 active:scale-95 hover:brightness-105 transition-all">
                                <Send className="w-4 h-4" /> WhatsApp
                            </button>
                            <button onClick={handleCopy} className="py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 hover:bg-slate-50 transition-all shadow-sm">
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />} Copiar
                            </button>
                            <button onClick={reset} className="py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 hover:bg-slate-50 transition-all shadow-sm">
                                <RefreshCw className="w-4 h-4" /> Novo
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default PatientContentWizard;
