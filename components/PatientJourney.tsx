
import React, { useState, useEffect } from 'react';
import { PatientJourneyState, ProtocolType, TimelineEvent, Tone } from '../types';
import { PROTOCOLS } from '../services/protocolTemplates';
import { generateJourneyMessage } from '../services/geminiService';
import { 
    Calendar, CheckCircle2, MessageCircle, Clock, Video, FileText, 
    Share2, User, ChevronRight, Wand2, ArrowRight, PlayCircle, Syringe, AlertCircle
} from 'lucide-react';

interface PatientJourneyProps {
    initialPatientData?: {
        name: string;
        surgeryDate: string;
        surgeryType: string;
    };
}

const PatientJourney: React.FC<PatientJourneyProps> = ({ initialPatientData }) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<PatientJourneyState>({
      patientName: '',
      surgeryDate: new Date().toISOString().split('T')[0],
      protocolType: 'LCA',
      tone: Tone.EMPATHETIC
  });

  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loadingMsg, setLoadingMsg] = useState<string | null>(null);

  // Initialize with passed props
  useEffect(() => {
      if (initialPatientData) {
          let type: ProtocolType = 'LCA';
          const surgeryUpper = initialPatientData.surgeryType.toUpperCase();
          if (surgeryUpper.includes('LCA') || surgeryUpper.includes('CRUZADO')) type = 'LCA';
          else if (surgeryUpper.includes('ATJ') || surgeryUpper.includes('ARTROPLASTIA') || surgeryUpper.includes('PRÓTESE')) type = 'ATJ';
          else if (surgeryUpper.includes('MENISCO')) type = 'MENISCO';
          else if (surgeryUpper.includes('OMBRO') || surgeryUpper.includes('MANGUITO')) type = 'OMBRO';

          setConfig({
              patientName: initialPatientData.name,
              surgeryDate: initialPatientData.surgeryDate,
              protocolType: type,
              tone: Tone.EMPATHETIC
          });
      }
  }, [initialPatientData]);

  // Auto-calculate on init
  useEffect(() => {
      if (initialPatientData && config.patientName) {
          calculateTimeline();
      }
  }, [config.protocolType, initialPatientData]);

  const calculateTimeline = () => {
      const baseDate = new Date(config.surgeryDate);
      const template = PROTOCOLS[config.protocolType];
      
      const events: TimelineEvent[] = template.steps.map((step, idx) => {
          const eventDate = new Date(baseDate);
          eventDate.setDate(eventDate.getDate() + step.dayOffset);
          
          return {
              ...step,
              id: `evt-${idx}`,
              calculatedDate: eventDate.toISOString().split('T')[0],
              status: 'pending'
          };
      });
      setTimeline(events);
      setStep(2);
  };

  const handleGenerateMessage = async (event: TimelineEvent) => {
      setLoadingMsg(event.id);
      try {
          const msg = await generateJourneyMessage({
              patientName: config.patientName,
              eventTitle: event.title,
              eventDescription: event.description,
              daysPostOp: event.dayOffset,
              tone: config.tone
          });
          setTimeline(prev => prev.map(e => e.id === event.id ? { ...e, generatedMessage: msg } : e));
      } catch (error) {
          alert("Erro ao gerar mensagem.");
      } finally {
          setLoadingMsg(null);
      }
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'message': return <MessageCircle className="w-4 h-4 text-white" />;
          case 'appointment': return <Calendar className="w-4 h-4 text-white" />;
          case 'rehab': return <Video className="w-4 h-4 text-white" />;
          case 'exam': return <FileText className="w-4 h-4 text-white" />;
          default: return <CheckCircle2 className="w-4 h-4 text-white" />;
      }
  };

  const getColor = (type: string) => {
      switch(type) {
          case 'message': return 'bg-green-500 shadow-green-200';
          case 'appointment': return 'bg-blue-500 shadow-blue-200';
          case 'rehab': return 'bg-purple-500 shadow-purple-200';
          case 'exam': return 'bg-orange-500 shadow-orange-200';
          default: return 'bg-slate-500 shadow-slate-200';
      }
  };

  return (
    <div className="h-full flex flex-col pb-24 lg:pb-0 animate-fadeIn">
        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
            
            {step === 1 && !initialPatientData && (
                <div className="max-w-lg mx-auto bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 animate-slideUp">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Configurar Protocolo</h2>
                    {/* Simplified Config Form */}
                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nome</label>
                            <input 
                                type="text" 
                                value={config.patientName}
                                onChange={e => setConfig({...config, patientName: e.target.value})}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Cirurgia</label>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.keys(PROTOCOLS).map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => setConfig({...config, protocolType: key as ProtocolType})}
                                        className={`p-3 rounded-xl border font-bold text-sm transition-all
                                        ${config.protocolType === key ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500' : 'border-slate-100 bg-slate-50 text-slate-500'}`}
                                    >
                                        {key}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button 
                            onClick={calculateTimeline}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all mt-4"
                        >
                            Gerar Jornada
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="max-w-3xl mx-auto">
                    {/* Header Info */}
                    <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-lg mb-8 flex justify-between items-center relative overflow-hidden">
                        <div className="relative z-10">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Protocolo Ativo</span>
                            <h2 className="text-2xl font-black">{PROTOCOLS[config.protocolType].title}</h2>
                            <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Cirurgia: {new Date(config.surgeryDate).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md relative z-10">
                            <Clock className="w-8 h-8 text-white" />
                        </div>
                        {/* Background Decor */}
                        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-600 rounded-full blur-[60px] opacity-50"></div>
                    </div>

                    {/* Timeline */}
                    <div className="relative pl-4 space-y-8 before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 before:border-l-2 before:border-dashed before:border-slate-300">
                        {timeline.map((event, idx) => {
                            const isToday = new Date(event.calculatedDate).toDateString() === new Date().toDateString();
                            const isPast = new Date(event.calculatedDate) < new Date();

                            return (
                                <div key={idx} className={`relative pl-12 group transition-all duration-500 ${isPast ? 'opacity-70 grayscale-[0.5]' : 'opacity-100'}`}>
                                    {/* Icon Marker */}
                                    <div className={`absolute left-0 top-0 w-14 h-14 rounded-2xl border-4 border-slate-50 flex items-center justify-center shadow-lg z-10 transition-transform group-hover:scale-110 ${getColor(event.type)}`}>
                                        {getIcon(event.type)}
                                    </div>

                                    {/* Content Card */}
                                    <div className={`bg-white p-6 rounded-[2rem] border transition-all relative
                                        ${isToday ? 'border-indigo-500 ring-4 ring-indigo-50 shadow-xl' : 'border-slate-100 shadow-sm hover:shadow-lg'}`}>
                                        
                                        {isToday && (
                                            <span className="absolute -top-3 -right-3 bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md animate-bounce">
                                                HOJE
                                            </span>
                                        )}

                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-black text-slate-900 text-lg">{event.title}</h3>
                                                <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-wide">
                                                    {new Date(event.calculatedDate).toLocaleDateString()} • Dia {event.dayOffset}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-sm text-slate-600 mb-5 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            {event.description}
                                        </p>

                                        {/* Generated Message */}
                                        {event.generatedMessage && (
                                            <div className="bg-green-50 p-4 rounded-2xl border border-green-100 mb-5 relative animate-scaleIn">
                                                <p className="text-xs text-green-800 whitespace-pre-line font-medium leading-relaxed italic">
                                                    "{event.generatedMessage}"
                                                </p>
                                                <div className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-sm border border-green-100">
                                                    <Wand2 className="w-3 h-3 text-green-600" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-3">
                                            {!event.generatedMessage ? (
                                                <button 
                                                    onClick={() => handleGenerateMessage(event)}
                                                    disabled={loadingMsg === event.id}
                                                    className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all hover:bg-slate-800 active:scale-95 shadow-md"
                                                >
                                                    {loadingMsg === event.id ? <Wand2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                                                    Gerar Mensagem IA
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(event.generatedMessage || '')}`)}
                                                    className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                                                >
                                                    <Share2 className="w-4 h-4" /> Enviar WhatsApp
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default PatientJourney;
