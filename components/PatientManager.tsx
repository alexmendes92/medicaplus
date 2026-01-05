
import React, { useState, useMemo } from 'react';
import { 
    User, Search, Plus, Phone, MessageCircle, 
    Activity, TrendingUp, ArrowLeft,
    Bone, Sliders, X, Stethoscope, Image as ImageIcon,
    FileText, DollarSign, PenTool
} from 'lucide-react';
import PatientContentWizard from './PatientContentWizard';
import PatientJourney from './PatientJourney';
import { OrthopedicBodyMap, ImageWorkspace, SurgicalModule, BillingModule } from './OrthopedicModules';
import { PainPoint } from '../types';

// Extended Mock Data with strict status types
interface Patient {
    id: string;
    name: string;
    age: number;
    surgery: string;
    date: string;
    status: 'Pós-Op Imediato' | 'Reabilitação' | 'Alta' | 'Pré-Op';
    phone: string;
    photo: string;
    tags: string[];
    stats: {
        pain: number;
        flexion: number;
        extension: number;
    };
    painPoints?: PainPoint[];
}

const INITIAL_PATIENTS: Patient[] = [
    { 
        id: '1', name: 'Ana Clara Souza', age: 28, 
        surgery: 'LCA + Menisco', date: '2024-10-15', 
        status: 'Pós-Op Imediato',
        phone: '11999999999', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        tags: ['Atleta', 'Particular'],
        stats: { pain: 3, flexion: 90, extension: 0 },
        painPoints: [{ x: 65, y: 75, label: 'Joelho E (Pós-Op)', intensity: 3 }]
    },
    { 
        id: '2', name: 'Roberto Mendes', age: 45, 
        surgery: 'Artroplastia Total (ATJ)', date: '2024-09-01', 
        status: 'Reabilitação',
        phone: '11988888888', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        tags: ['Convênio'],
        stats: { pain: 1, flexion: 110, extension: 0 }
    },
    { 
        id: '3', name: 'Fernanda Oliveira', age: 32, 
        surgery: 'Manguito Rotador', date: '2024-10-20', 
        status: 'Pré-Op',
        phone: '11977777777', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
        tags: ['VIP'],
        stats: { pain: 5, flexion: 45, extension: 0 }
    },
];

const PatientManager: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  
  // Tab State for Details View
  const [detailTab, setDetailTab] = useState<'clinical' | 'images' | 'surgery' | 'billing' | 'comms'>('clinical');
  const [commsSubView, setCommsSubView] = useState<'message' | 'journey' | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [isAdding, setIsAdding] = useState(false);

  // Derived state for the selected patient object
  const selectedPatient = useMemo(() => 
    patients.find(p => p.id === selectedPatientId) || null
  , [patients, selectedPatientId]);

  // Filtering Logic
  const filteredPatients = useMemo(() => {
      return patients.filter(p => {
          const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                p.surgery.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesStatus = statusFilter === 'Todos' || p.status === statusFilter;
          return matchesSearch && matchesStatus;
      });
  }, [patients, searchTerm, statusFilter]);

  const handleUpdateStats = (newStats: Partial<typeof INITIAL_PATIENTS[0]['stats']>) => {
      if (!selectedPatient) return;
      setPatients(prev => prev.map(p => 
          p.id === selectedPatient.id ? { ...p, stats: { ...p.stats, ...newStats } } : p
      ));
  };

  const handlePainPointUpdate = (newPoint: PainPoint) => {
      if (!selectedPatient) return;
      const currentPoints = selectedPatient.painPoints || [];
      setPatients(prev => prev.map(p => 
          p.id === selectedPatient.id ? { ...p, painPoints: [...currentPoints, newPoint] } : p
      ));
  };

  const handlePainPointRemove = (idx: number) => {
      if (!selectedPatient) return;
      const currentPoints = selectedPatient.painPoints || [];
      setPatients(prev => prev.map(p => 
          p.id === selectedPatient.id ? { ...p, painPoints: currentPoints.filter((_, i) => i !== idx) } : p
      ));
  };

  const handleAddPatient = (e: React.FormEvent) => {
      e.preventDefault();
      const newPatient: Patient = {
          id: Date.now().toString(),
          name: "Novo Paciente",
          age: 30,
          surgery: "Avaliação Inicial",
          date: new Date().toISOString().split('T')[0],
          status: 'Pré-Op',
          phone: '',
          photo: '',
          tags: ['Novo'],
          stats: { pain: 0, flexion: 0, extension: 0 }
      };
      setPatients([newPatient, ...patients]);
      setSelectedPatientId(newPatient.id);
      setIsAdding(false);
  };

  const getStatusStyle = (status: string) => {
      switch(status) {
          case 'Pós-Op Imediato': return 'bg-red-100 text-red-700 border-red-200';
          case 'Reabilitação': return 'bg-purple-100 text-purple-700 border-purple-200';
          case 'Alta': return 'bg-green-100 text-green-700 border-green-200';
          default: return 'bg-slate-100 text-slate-600 border-slate-200';
      }
  };

  // --- SUB-COMPONENTS ---

  const EmptyStateDesktop = () => (
      <div className="hidden md:flex h-full w-full flex-col items-center justify-center text-slate-300 p-12 text-center bg-slate-50/50">
          <div className="max-w-md w-full flex flex-col items-center animate-fadeIn">
              <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-slate-200/50 border-4 border-white ring-1 ring-slate-100">
                  <User className="w-20 h-20 text-slate-200" />
              </div>
              <h2 className="text-3xl font-black text-slate-400 mb-4 tracking-tight">Prontuário Inteligente</h2>
              <p className="text-lg text-slate-400/80 leading-relaxed font-medium">
                  Selecione um paciente para acessar o mapa corporal, imagens DICOM, prescrições e planejamento cirúrgico.
              </p>
          </div>
      </div>
  );

  return (
    <div className="h-full bg-slate-50 flex overflow-hidden">
        
        {/* ADD PATIENT MODAL */}
        {isAdding && (
            <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
                <div className="bg-white rounded-t-3xl sm:rounded-3xl p-8 w-full max-w-md shadow-2xl animate-slideUp">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 mb-1">Novo Paciente</h2>
                            <p className="text-slate-500 text-sm">Cadastro rápido para iniciar acompanhamento.</p>
                        </div>
                        <button onClick={() => setIsAdding(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleAddPatient} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Nome Completo</label>
                            <input type="text" placeholder="Ex: João da Silva" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-slate-900" required />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setIsAdding(false)} className="flex-1 p-4 rounded-xl font-bold text-slate-500 hover:bg-slate-50 border border-slate-200 transition-colors">Cancelar</button>
                            <button type="submit" className="flex-1 bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg active:scale-95">Criar Ficha</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* SIDEBAR LIST (Desktop) */}
        <div className={`
            w-full md:w-[24rem] lg:w-[28rem] flex flex-col bg-white border-r border-slate-200 h-full z-20 shadow-2xl md:shadow-none transition-transform
            ${selectedPatient ? 'hidden md:flex' : 'flex'}
        `}>
            {/* Header & Search */}
            <div className="p-6 pb-2 shrink-0 bg-white/95 backdrop-blur-xl z-10 sticky top-0">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pacientes</h1>
                    <button onClick={() => setIsAdding(true)} className="bg-slate-900 text-white p-3 rounded-xl shadow-lg shadow-slate-900/20 active:scale-95 transition-transform hover:bg-slate-800">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="relative group mb-4">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Buscar por nome ou cirurgia..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-700 transition-all text-sm shadow-sm"
                    />
                </div>

                {/* Status Filters */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mask-linear-fade">
                    {['Todos', 'Pós-Op Imediato', 'Reabilitação', 'Pré-Op'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide whitespace-nowrap transition-all border flex-shrink-0
                            ${statusFilter === status 
                                ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3 pb-32 md:pb-4">
                {filteredPatients.map(patient => (
                    <div 
                        key={patient.id} 
                        onClick={() => {
                            setSelectedPatientId(patient.id);
                            setDetailTab('clinical'); // Reset to clinical tab
                            setCommsSubView(null);
                        }}
                        className={`p-4 rounded-[1.25rem] border shadow-sm cursor-pointer transition-all duration-300 group relative overflow-hidden flex flex-col gap-3 active:scale-[0.98]
                        ${selectedPatientId === patient.id 
                            ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-300' 
                            : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-md'}`}
                    >
                        <div className="flex items-start gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 bg-slate-200 border border-slate-100">
                                {patient.photo ? (
                                    <img src={patient.photo} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">{patient.name[0]}</div>
                                )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold truncate text-slate-900 leading-tight">{patient.name}</h3>
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wide border ${getStatusStyle(patient.status)}`}>
                                        {patient.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-1 text-slate-500 text-xs font-medium">
                                    <Bone className="w-3 h-3" /> {patient.surgery}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* DETAIL VIEW (Desktop & Mobile) */}
        <div className={`
            flex-1 h-full relative bg-[#F8FAFC] overflow-hidden flex flex-col
            ${selectedPatient ? 'flex' : 'hidden md:flex'}
        `}>
            {selectedPatient ? (
                <>
                    {/* Header Details */}
                    <div className="bg-white border-b border-slate-100 flex-shrink-0 z-30">
                        {/* Mobile Back Nav */}
                        <div className="md:hidden px-4 py-3 flex items-center gap-3 border-b border-slate-50">
                            <button onClick={() => setSelectedPatientId(null)} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors">
                                <ArrowLeft className="w-5 h-5 text-slate-600" />
                            </button>
                            <span className="font-bold text-slate-900">Prontuário</span>
                        </div>

                        {/* Patient Basic Info */}
                        <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 border border-slate-100 shadow-sm shrink-0">
                                    {selectedPatient.photo ? (
                                        <img src={selectedPatient.photo} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">{selectedPatient.name[0]}</div>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 leading-tight">{selectedPatient.name}</h2>
                                    <div className="flex gap-2 mt-1">
                                        {selectedPatient.tags.map(tag => (
                                            <span key={tag} className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md border border-slate-200">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                <button onClick={() => window.open(`tel:${selectedPatient.phone}`)} className="px-4 py-2 bg-slate-50 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors flex items-center gap-2">
                                    <Phone className="w-4 h-4" /> <span className="hidden md:inline">Ligar</span>
                                </button>
                                <button onClick={() => window.open(`https://wa.me/${selectedPatient.phone}`)} className="px-4 py-2 bg-green-50 text-green-700 rounded-xl font-bold text-xs hover:bg-green-100 transition-colors flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4" /> <span className="hidden md:inline">WhatsApp</span>
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="px-6 flex gap-6 overflow-x-auto no-scrollbar">
                            {[
                                { id: 'clinical', label: 'Clínico', icon: Stethoscope },
                                { id: 'images', label: 'Imagens', icon: ImageIcon },
                                { id: 'surgery', label: 'Cirurgia', icon: PenTool },
                                { id: 'billing', label: 'Faturamento', icon: DollarSign },
                                { id: 'comms', label: 'Jornada & Chat', icon: MessageCircle }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setDetailTab(tab.id as any)}
                                    className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap
                                    ${detailTab === tab.id 
                                        ? 'border-slate-900 text-slate-900' 
                                        : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                                >
                                    <tab.icon className="w-4 h-4" /> {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* TAB CONTENT AREAS */}
                    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-6">
                        
                        {/* 1. CLINICAL TAB (Default) */}
                        {detailTab === 'clinical' && (
                            <div className="h-full flex flex-col gap-6 animate-fadeIn">
                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nível de Dor</span>
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${selectedPatient.stats.pain > 4 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>EVA {selectedPatient.stats.pain}</span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="10" 
                                            value={selectedPatient.stats.pain}
                                            onChange={(e) => handleUpdateStats({ pain: parseInt(e.target.value) })}
                                            className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-slate-900"
                                        />
                                    </div>
                                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Flexão (ADM)</span>
                                            <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded">{selectedPatient.stats.flexion}°</span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="140" 
                                            value={selectedPatient.stats.flexion}
                                            onChange={(e) => handleUpdateStats({ flexion: parseInt(e.target.value) })}
                                            className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                                        />
                                    </div>
                                </div>

                                {/* Body Map Module */}
                                <div className="flex-1 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden h-[500px]">
                                    <OrthopedicBodyMap 
                                        points={selectedPatient.painPoints || []} 
                                        onAddPoint={handlePainPointUpdate}
                                        onRemovePoint={handlePainPointRemove}
                                    />
                                </div>
                            </div>
                        )}

                        {/* 2. IMAGES TAB */}
                        {detailTab === 'images' && (
                            <div className="h-full animate-fadeIn">
                                <ImageWorkspace />
                            </div>
                        )}

                        {/* 3. SURGERY TAB */}
                        {detailTab === 'surgery' && (
                            <div className="h-full animate-fadeIn">
                                <SurgicalModule />
                            </div>
                        )}

                        {/* 4. BILLING TAB */}
                        {detailTab === 'billing' && (
                            <div className="h-full animate-fadeIn">
                                <BillingModule />
                            </div>
                        )}

                        {/* 5. COMMS TAB (Original Journey/Chat) */}
                        {detailTab === 'comms' && (
                            <div className="h-full flex flex-col animate-fadeIn">
                                {!commsSubView ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                                        <button 
                                            onClick={() => setCommsSubView('message')}
                                            className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all group"
                                        >
                                            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                                <MessageCircle className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900">Criar Mensagem</h3>
                                            <p className="text-slate-500 text-center text-sm">Gerar textos com IA para WhatsApp.</p>
                                        </button>

                                        <button 
                                            onClick={() => setCommsSubView('journey')}
                                            className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all group"
                                        >
                                            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                                <TrendingUp className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900">Jornada do Paciente</h3>
                                            <p className="text-slate-500 text-center text-sm">Visualizar linha do tempo e protocolos.</p>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden relative">
                                        <button 
                                            onClick={() => setCommsSubView(null)}
                                            className="absolute top-4 right-4 z-20 bg-slate-100 p-2 rounded-full hover:bg-slate-200"
                                        >
                                            <X className="w-5 h-5 text-slate-500" />
                                        </button>
                                        {commsSubView === 'message' ? <PatientContentWizard /> : <PatientJourney key={selectedPatient.id} initialPatientData={{ name: selectedPatient.name, surgeryDate: selectedPatient.date, surgeryType: selectedPatient.surgery }} />}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </>
            ) : (
                <EmptyStateDesktop />
            )}
        </div>
    </div>
  );
};

export default PatientManager;
