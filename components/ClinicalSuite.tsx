
import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { 
    Activity, Eye, Camera, Syringe, Weight, Pill, Utensils, 
    ChevronRight, AlertTriangle, CheckCircle2, UploadCloud, 
    Loader2, Scale, Calendar, Info, FlaskConical, PersonStanding, X, ArrowRight, ArrowLeft, Share2, Flame,
    Muscle, Dumbbell, BookOpen
} from 'lucide-react';
import { analyzeWoundImage, checkDrugInteractions, generateSupplementPlan } from '../services/geminiService';
import { WoundAnalysisResult, DrugInteractionResult, SupplementPlan, UserProfile } from '../types';

type Tool = 'sarcf' | 'wound' | 'valgus' | 'visco' | 'weight' | 'meds' | 'supplements';

interface ClinicalSuiteProps {
    userProfile?: UserProfile;
}

const ClinicalSuite: React.FC<ClinicalSuiteProps> = ({ userProfile }) => {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [step, setStep] = useState(1);
  const captureRef = useRef<HTMLDivElement>(null);

  // --- SARC-F STATE (Validado Cientificamente) ---
  const [sarcAnswers, setSarcAnswers] = useState({
      strength: 0,
      walking: 0,
      rising: 0,
      stairs: 0,
      falls: 0
  });
  const [sarcResult, setSarcResult] = useState<number | null>(null);

  const calculateSarcF = () => {
      const total = Object.values(sarcAnswers).reduce((a: number, b: number) => a + b, 0);
      setSarcResult(total);
      setStep(6); // Result screen
  };

  const handleShareResult = async () => {
      if (captureRef.current) {
          try {
              const canvas = await html2canvas(captureRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
              canvas.toBlob(async (blob) => {
                  if (blob) {
                      const file = new File([blob], 'resultado_clinico.png', { type: 'image/png' });
                      if (navigator.share) {
                          try { await navigator.share({ files: [file], title: 'Resultado Clínico' }); } catch (e) { console.log(e); }
                      } else {
                          const link = document.createElement('a');
                          link.download = 'resultado.png';
                          link.href = canvas.toDataURL();
                          link.click();
                      }
                  }
              });
          } catch (e) { alert("Erro ao criar imagem."); }
      }
  };

  // --- WOUND STATE ---
  const [woundImage, setWoundImage] = useState<string | null>(null);
  const [woundAnalysis, setWoundAnalysis] = useState<WoundAnalysisResult | null>(null);
  const [woundLoading, setWoundLoading] = useState(false);
  const woundInputRef = useRef<HTMLInputElement>(null);

  const handleWoundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setWoundImage(reader.result as string);
              setStep(2);
          };
          reader.readAsDataURL(e.target.files[0]);
      }
  };

  const runWoundAnalysis = async () => {
      if(!woundImage) return;
      setWoundLoading(true);
      try {
          const result = await analyzeWoundImage(woundImage);
          setWoundAnalysis(result);
          setStep(3);
      } catch (e) { console.error(e); } finally { setWoundLoading(false); }
  };

  // --- VISCO STATE ---
  const [viscoDate, setViscoDate] = useState(new Date().toISOString().split('T')[0]);
  const [viscoBrand, setViscoBrand] = useState('Synvisc One');
  const [viscoSide, setViscoSide] = useState('Direito');

  // --- WEIGHT BIOMECHANICS ---
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  
  // --- MEDS STATE ---
  const [medsList, setMedsList] = useState('');
  const [medResult, setMedResult] = useState<DrugInteractionResult | null>(null);
  const [medLoading, setMedLoading] = useState(false);

  const checkMeds = async () => {
      if(!medsList) return;
      setMedLoading(true);
      try {
          const result = await checkDrugInteractions(medsList);
          setMedResult(result);
          setStep(2);
      } catch (e) { console.error(e); } finally { setMedLoading(false); }
  };

  // --- SUPPLEMENTS STATE ---
  const [injuryType, setInjuryType] = useState('Cartilagem (Artrose)');
  const [suppPlan, setSuppPlan] = useState<SupplementPlan | null>(null);
  const [suppLoading, setSuppLoading] = useState(false);

  const generateSupplements = async () => {
      setSuppLoading(true);
      try {
          const result = await generateSupplementPlan(injuryType);
          setSuppPlan(result);
          setStep(2);
      } catch (e) { console.error(e); } finally { setSuppLoading(false); }
  };

  const closeTool = () => {
      setActiveTool(null);
      setStep(1);
      setSarcResult(null);
      setWoundImage(null);
      setWoundAnalysis(null);
      setMedResult(null);
      setSuppPlan(null);
  };

  const ProgressDots = ({ total, current }: { total: number, current: number }) => (
      <div className="flex gap-1.5 justify-center mb-6">
          {Array.from({ length: total }).map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i + 1 === current ? 'w-6 bg-slate-900' : i + 1 < current ? 'w-1.5 bg-green-50' : 'w-1.5 bg-slate-200'}`} />
          ))}
      </div>
  );

  const StepHeader = ({ title, desc }: { title: string, desc: string }) => (
      <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{title}</h2>
          <p className="text-sm text-slate-500 font-medium">{desc}</p>
      </div>
  );

  const SelectionCard = ({ selected, onClick, icon: Icon, title, desc }: any) => (
      <button 
          onClick={onClick}
          className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left active:scale-[0.98]
          ${selected ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900' : 'border-slate-100 bg-white hover:border-slate-200'}`}
      >
          <div className={`p-3 rounded-xl shrink-0 ${selected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
              <Icon className="w-6 h-6" />
          </div>
          <div>
              <span className={`block font-bold text-sm ${selected ? 'text-slate-900' : 'text-slate-600'}`}>{title}</span>
              {desc && <span className="text-xs text-slate-400 font-medium">{desc}</span>}
          </div>
          {selected && <CheckCircle2 className="w-5 h-5 text-slate-900 ml-auto" />}
      </button>
  );

  const NextButton = ({ onClick, disabled, label = "Continuar" }: any) => (
      <button 
          onClick={onClick}
          disabled={disabled}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
      >
          {label} <ArrowRight className="w-4 h-4" />
      </button>
  );

  // Layout Wrapper to ensure footer is at bottom
  const ToolLayout = ({ children, footer }: { children?: React.ReactNode, footer: React.ReactNode }) => (
      <div className="flex flex-col h-full bg-white lg:bg-transparent">
          <div className="flex-1 overflow-y-auto no-scrollbar p-6">
              <div className="max-w-md mx-auto h-full flex flex-col">
                  {children}
              </div>
          </div>
          <div className="p-6 border-t border-slate-100 bg-white z-10 shrink-0">
              <div className="max-w-md mx-auto">
                  {footer}
              </div>
          </div>
      </div>
  );

  const renderToolContent = () => {
      switch(activeTool) {
          case 'sarcf':
              return (
                  <ToolLayout
                    footer={
                        step < 6 ? <NextButton onClick={() => setStep(s => s + 1)} /> :
                        step === 5 ? <NextButton onClick={calculateSarcF} label="Calcular Risco" /> :
                        <div className="flex gap-3">
                            <button onClick={handleShareResult} className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95">
                                <Share2 className="w-4 h-4" /> Relatório
                            </button>
                            <button onClick={() => { setStep(1); setSarcAnswers({ strength: 0, walking: 0, rising: 0, stairs: 0, falls: 0 }); }} className="flex-1 text-slate-400 font-bold text-sm border border-slate-200 rounded-xl hover:bg-slate-50">
                                Novo Exame
                            </button>
                        </div>
                    }
                  >
                      {/* SARC-F QUESTIONS */}
                      {step === 1 && (
                          <div className="animate-fadeIn">
                              <ProgressDots total={5} current={1} />
                              <StepHeader title="Força (Strength)" desc="Quanta dificuldade para levantar/carregar 5kg?" />
                              <div className="space-y-3">
                                  <SelectionCard selected={sarcAnswers.strength === 0} onClick={() => setSarcAnswers({...sarcAnswers, strength: 0})} icon={Dumbbell} title="Nenhuma" desc="Levanta facilmente." />
                                  <SelectionCard selected={sarcAnswers.strength === 1} onClick={() => setSarcAnswers({...sarcAnswers, strength: 1})} icon={Dumbbell} title="Alguma" desc="Sente esforço." />
                                  <SelectionCard selected={sarcAnswers.strength === 2} onClick={() => setSarcAnswers({...sarcAnswers, strength: 2})} icon={Dumbbell} title="Muita / Incapaz" desc="Não consegue." />
                              </div>
                          </div>
                      )}
                      {step === 2 && (
                          <div className="animate-slideUp">
                              <ProgressDots total={5} current={2} />
                              <StepHeader title="Caminhada (Assistance)" desc="Dificuldade em atravessar um cômodo?" />
                              <div className="space-y-3">
                                  <SelectionCard selected={sarcAnswers.walking === 0} onClick={() => setSarcAnswers({...sarcAnswers, walking: 0})} icon={PersonStanding} title="Nenhuma" />
                                  <SelectionCard selected={sarcAnswers.walking === 1} onClick={() => setSarcAnswers({...sarcAnswers, walking: 1})} icon={PersonStanding} title="Alguma" />
                                  <SelectionCard selected={sarcAnswers.walking === 2} onClick={() => setSarcAnswers({...sarcAnswers, walking: 2})} icon={PersonStanding} title="Muita / Incapaz" desc="Usa apoio ou não consegue." />
                              </div>
                          </div>
                      )}
                      {step === 3 && (
                          <div className="animate-slideUp">
                              <ProgressDots total={5} current={3} />
                              <StepHeader title="Levantar (Rising)" desc="Dificuldade para sair da cama/cadeira?" />
                              <div className="space-y-3">
                                  <SelectionCard selected={sarcAnswers.rising === 0} onClick={() => setSarcAnswers({...sarcAnswers, rising: 0})} icon={Activity} title="Nenhuma" />
                                  <SelectionCard selected={sarcAnswers.rising === 1} onClick={() => setSarcAnswers({...sarcAnswers, rising: 1})} icon={Activity} title="Alguma" />
                                  <SelectionCard selected={sarcAnswers.rising === 2} onClick={() => setSarcAnswers({...sarcAnswers, rising: 2})} icon={Activity} title="Muita / Incapaz" />
                              </div>
                          </div>
                      )}
                      {step === 4 && (
                          <div className="animate-slideUp">
                              <ProgressDots total={5} current={4} />
                              <StepHeader title="Escadas (Climb)" desc="Dificuldade em subir 10 degraus?" />
                              <div className="space-y-3">
                                  <SelectionCard selected={sarcAnswers.stairs === 0} onClick={() => setSarcAnswers({...sarcAnswers, stairs: 0})} icon={Activity} title="Nenhuma" />
                                  <SelectionCard selected={sarcAnswers.stairs === 1} onClick={() => setSarcAnswers({...sarcAnswers, stairs: 1})} icon={Activity} title="Alguma" />
                                  <SelectionCard selected={sarcAnswers.stairs === 2} onClick={() => setSarcAnswers({...sarcAnswers, stairs: 2})} icon={Activity} title="Muita / Incapaz" />
                              </div>
                          </div>
                      )}
                      {step === 5 && (
                          <div className="animate-slideUp">
                              <ProgressDots total={5} current={5} />
                              <StepHeader title="Quedas (Falls)" desc="Quantas quedas no último ano?" />
                              <div className="space-y-3">
                                  <SelectionCard selected={sarcAnswers.falls === 0} onClick={() => { setSarcAnswers({...sarcAnswers, falls: 0}); calculateSarcF(); }} icon={AlertTriangle} title="Nenhuma" />
                                  <SelectionCard selected={sarcAnswers.falls === 1} onClick={() => { setSarcAnswers({...sarcAnswers, falls: 1}); calculateSarcF(); }} icon={AlertTriangle} title="1 a 3 quedas" />
                                  <SelectionCard selected={sarcAnswers.falls === 2} onClick={() => { setSarcAnswers({...sarcAnswers, falls: 2}); calculateSarcF(); }} icon={AlertTriangle} title="4 ou mais quedas" />
                              </div>
                          </div>
                      )}
                      
                      {step === 6 && sarcResult !== null && (
                          <div className="animate-scaleIn pt-4">
                              {/* Capture Ref */}
                              <div ref={captureRef} className="text-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative mb-6">
                                  {/* Branding */}
                                  <div className="flex items-center justify-center gap-2 mb-6 border-b border-slate-50 pb-2">
                                      <Flame className="w-3 h-3 text-slate-900" />
                                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{userProfile?.name || 'MediSocial Clinical'}</span>
                                  </div>

                                  <div className="flex items-center justify-center gap-2 mb-2">
                                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score SARC-F</span>
                                  </div>
                                  
                                  <div className={`w-40 h-40 mx-auto rounded-full border-8 shadow-xl flex flex-col items-center justify-center mb-6 relative ${sarcResult >= 4 ? 'border-red-100 bg-red-50 text-red-700' : 'border-green-100 bg-green-50 text-green-700'}`}>
                                      <span className="text-6xl font-black tracking-tighter leading-none">{sarcResult}</span>
                                      <span className="text-xs font-bold mt-1 opacity-70">/ 10</span>
                                  </div>

                                  <h3 className={`text-2xl font-black mb-2 ${sarcResult >= 4 ? 'text-red-700' : 'text-green-700'}`}>
                                      {sarcResult >= 4 ? "Sarcopenia Provável" : "Baixo Risco"}
                                  </h3>
                                  
                                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left">
                                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                          {sarcResult >= 4 
                                              ? "Score ≥ 4 é preditivo de sarcopenia, risco aumentado de quedas, hospitalização e complicações pós-operatórias. Recomenda-se avaliação de massa muscular." 
                                              : "Função muscular preservada. Manter atividade física e aporte proteico adequado."}
                                      </p>
                                      <p className="text-[9px] text-slate-400 mt-2 font-mono">Fonte: Malmstrom TK, et al. J Am Med Dir Assoc. 2013;14(8):530-5.</p>
                                  </div>
                              </div>
                          </div>
                      )}
                  </ToolLayout>
              );
          case 'visco':
              return (
                  <ToolLayout
                    footer={
                        step === 1 ? <NextButton onClick={() => setStep(2)} /> :
                        <button onClick={() => setStep(1)} className="w-full py-4 text-slate-400 font-bold text-sm hover:text-slate-600">Editar Dados</button>
                    }
                  >
                      {step === 1 && (
                          <div className="animate-fadeIn">
                              <ProgressDots total={2} current={1} />
                              <StepHeader title="Produto & Lado" desc="Qual viscosuplemento será utilizado?" />
                              <div className="space-y-3 mb-6">
                                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Produto</label>
                                  {['Synvisc One (12 meses)', 'Euflexxa (6 meses)', 'Suprahyal (6 meses)'].map(brand => (
                                      <SelectionCard key={brand} selected={viscoBrand === brand} onClick={() => setViscoBrand(brand)} icon={Syringe} title={brand} />
                                  ))}
                              </div>
                              <div className="grid grid-cols-2 gap-3 mb-6">
                                  <button onClick={() => setViscoSide('Esquerdo')} className={`p-4 rounded-2xl border-2 font-bold text-sm transition-all ${viscoSide === 'Esquerdo' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 bg-white text-slate-500'}`}>Esquerdo</button>
                                  <button onClick={() => setViscoSide('Direito')} className={`p-4 rounded-2xl border-2 font-bold text-sm transition-all ${viscoSide === 'Direito' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 bg-white text-slate-500'}`}>Direito</button>
                              </div>
                          </div>
                      )}
                      {step === 2 && (
                          <div className="animate-slideUp">
                              <ProgressDots total={2} current={2} />
                              <StepHeader title="Data da Aplicação" desc="Quando foi ou será realizado o procedimento?" />
                              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm mb-6">
                                  <Calendar className="w-8 h-8 text-blue-600 mb-4" />
                                  <input type="date" value={viscoDate} onChange={e => setViscoDate(e.target.value)} className="w-full text-lg font-bold text-slate-900 bg-slate-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-100" />
                              </div>
                              <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 text-center mb-6">
                                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Próximo Ciclo Estimado</p>
                                  <p className="text-3xl font-black text-slate-900">
                                      {new Date(new Date(viscoDate).setMonth(new Date(viscoDate).getMonth() + (viscoBrand.includes('12') ? 12 : 6))).toLocaleDateString()}
                                  </p>
                              </div>
                          </div>
                      )}
                  </ToolLayout>
              );
          case 'weight':
              return (
                  <ToolLayout
                    footer={
                        step === 1 ? <NextButton onClick={() => setStep(2)} disabled={!currentWeight} /> :
                        <button onClick={() => setStep(1)} className="w-full py-4 text-slate-400 font-bold text-sm hover:text-slate-600">Novo Cálculo</button>
                    }
                  >
                      {step === 1 && (
                          <div className="animate-fadeIn">
                              <ProgressDots total={2} current={1} />
                              <StepHeader title="Biomecânica" desc="Informe o peso atual para análise de carga." />
                              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm text-center mb-6 relative overflow-hidden">
                                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-50 rounded-full"></div>
                                  <input type="number" value={currentWeight} onChange={e => setCurrentWeight(e.target.value)} placeholder="00.0" className="text-6xl font-black text-center w-full bg-transparent outline-none placeholder:text-slate-200 text-slate-900 relative z-10" autoFocus />
                                  <span className="text-sm font-bold text-slate-400 mt-2 block uppercase tracking-widest">Peso Corporal (Kg)</span>
                              </div>
                          </div>
                      )}
                      {step === 2 && (
                          <div className="animate-slideUp">
                              <ProgressDots total={2} current={2} />
                              <StepHeader title="Meta Terapêutica" desc="Qual o objetivo para redução de carga?" />
                              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm text-center mb-6">
                                  <input type="number" value={targetWeight} onChange={e => setTargetWeight(e.target.value)} placeholder="00.0" className="text-6xl font-black text-center w-full bg-transparent outline-none placeholder:text-slate-200 text-green-600" autoFocus />
                                  <span className="text-sm font-bold text-slate-400 mt-2 block uppercase tracking-widest">Meta (Kg)</span>
                              </div>
                              {targetWeight && (
                                  <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 text-center mb-6 animate-scaleIn">
                                      <Scale className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                                      <p className="text-xs font-bold text-orange-800 uppercase tracking-widest mb-1">Alívio de Força de Reação Articular</p>
                                      <p className="text-4xl font-black text-orange-600 tracking-tighter">
                                          {((parseFloat(currentWeight) - parseFloat(targetWeight)) * 4 * 5000 / 1000).toFixed(1)} Ton
                                      </p>
                                      <p className="text-[10px] text-orange-700/70 mt-2 font-medium px-4 leading-relaxed">
                                          Estimativa baseada na <strong>Lei de Wolff</strong> e estudos de marcha: Cada 1kg perdido reduz ~4kg de carga compressiva no joelho por passo.
                                      </p>
                                  </div>
                              )}
                          </div>
                      )}
                  </ToolLayout>
              );
          case 'meds':
              return (
                  <ToolLayout
                    footer={
                        step === 1 ? <NextButton onClick={checkMeds} disabled={medLoading || !medsList} label={medLoading ? "Consultando Base..." : "Verificar Interações"} /> :
                        <button onClick={() => setStep(1)} className="w-full py-4 text-slate-400 font-bold text-sm hover:text-slate-600">Nova Verificação</button>
                    }
                  >
                      {step === 1 && (
                          <div className="animate-fadeIn">
                              <StepHeader title="Farmacologia" desc="Cole a lista de medicamentos para análise de segurança." />
                              <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm mb-6">
                                  <textarea value={medsList} onChange={e => setMedsList(e.target.value)} placeholder="Ex: AAS 100mg, Losartana 50mg, Omeprazol 20mg, Ibuprofeno..." className="w-full h-40 p-4 bg-slate-50 rounded-xl outline-none text-lg font-medium placeholder:text-slate-300 resize-none focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all" />
                              </div>
                          </div>
                      )}
                      {step === 2 && medResult && (
                          <div className="animate-slideUp">
                              <div className={`p-8 rounded-[2.5rem] text-center mb-6 ${medResult.hasInteraction ? 'bg-red-50 text-red-900' : 'bg-green-50 text-green-900'}`}>
                                  {medResult.hasInteraction ? <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" /> : <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />}
                                  <h3 className="text-2xl font-black leading-tight mb-2">{medResult.hasInteraction ? 'Interação Detectada' : 'Combinação Segura'}</h3>
                                  <p className={`text-sm font-medium opacity-80 leading-relaxed`}>{medResult.details}</p>
                              </div>
                              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-6">
                                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Conduta Clínica Sugerida</h4>
                                  <p className="text-sm font-bold text-slate-700 leading-relaxed">{medResult.recommendation}</p>
                              </div>
                          </div>
                      )}
                  </ToolLayout>
              );
          case 'supplements':
              return (
                  <ToolLayout
                    footer={
                        step === 1 ? <NextButton onClick={generateSupplements} disabled={suppLoading} label={suppLoading ? "Gerando..." : "Gerar Protocolo"} /> :
                        <button onClick={() => setStep(1)} className="w-full py-4 text-slate-400 font-bold text-sm hover:text-slate-600">Novo Protocolo</button>
                    }
                  >
                      {step === 1 && (
                          <div className="animate-fadeIn">
                              <StepHeader title="Suporte Nutricional" desc="Qual o foco clínico da suplementação?" />
                              <div className="space-y-3 mb-8">
                                  {['Cartilagem (Artrose)', 'Músculo (Sarcopenia)', 'Tendão (Tendinite)', 'Pós-Op LCA'].map(type => (
                                      <SelectionCard key={type} selected={injuryType === type} onClick={() => setInjuryType(type)} icon={Utensils} title={type} />
                                  ))}
                              </div>
                          </div>
                      )}
                      {step === 2 && suppPlan && (
                          <div className="animate-slideUp">
                              <StepHeader title="Protocolo Baseado em Evidência" desc={suppPlan.injuryType} />
                              <div className="space-y-4 mb-8">
                                  {suppPlan.supplements.map((supp, idx) => (
                                      <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
                                          <div className="flex justify-between items-start">
                                              <h3 className="font-black text-slate-900">{supp.name}</h3>
                                              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-xs font-bold">{supp.dosage}</span>
                                          </div>
                                          <p className="text-xs text-slate-500 leading-relaxed">{supp.reason}</p>
                                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded">
                                              <Calendar className="w-3 h-3" /> {supp.timing}
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}
                  </ToolLayout>
              );
          case 'wound':
              return (
                  <ToolLayout
                    footer={
                        step === 1 ? null :
                        step === 2 ? <NextButton onClick={runWoundAnalysis} disabled={woundLoading} label={woundLoading ? "Analisando Tecidos..." : "Iniciar Análise IA"} /> :
                        <button onClick={() => setStep(1)} className="w-full py-4 text-slate-400 font-bold text-sm hover:text-slate-600">Nova Análise</button>
                    }
                  >
                      {step === 1 && (
                          <div className="animate-fadeIn text-center flex flex-col h-full justify-center">
                              <StepHeader title="Análise de Ferida" desc="Visão computacional para sinais flogísticos." />
                              <div onClick={() => woundInputRef.current?.click()} className="w-full aspect-square bg-slate-100 rounded-[2.5rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all group mb-6">
                                  <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                      <Camera className="w-8 h-8 text-slate-400" />
                                  </div>
                                  <span className="font-bold text-slate-400">Capturar Imagem</span>
                                  <input type="file" ref={woundInputRef} className="hidden" accept="image/*" onChange={handleWoundUpload} />
                              </div>
                          </div>
                      )}
                      {step === 2 && woundImage && (
                          <div className="animate-slideUp">
                              <div className="w-full aspect-square rounded-[2rem] overflow-hidden shadow-xl mb-6 relative">
                                  <img src={woundImage} className="w-full h-full object-cover" />
                                  <button onClick={() => { setWoundImage(null); setStep(1); }} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full backdrop-blur-md">
                                      <X className="w-5 h-5" />
                                  </button>
                              </div>
                          </div>
                      )}
                      {step === 3 && woundAnalysis && (
                          <div className="animate-slideUp">
                              <div className={`p-6 rounded-[2rem] text-white mb-6 shadow-xl ${woundAnalysis.riskLevel === 'Alto' ? 'bg-red-500' : woundAnalysis.riskLevel === 'Moderado' ? 'bg-orange-500' : 'bg-green-500'}`}>
                                  <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">Classificação de Risco</p>
                                  <h2 className="text-4xl font-black mb-2">{woundAnalysis.riskLevel}</h2>
                                  <p className="text-sm font-medium opacity-90">{woundAnalysis.recommendation}</p>
                              </div>
                              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-6">
                                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Sinais Identificados</h4>
                                  <ul className="space-y-3">
                                      {woundAnalysis.signs.map((sign, i) => (
                                          <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-700">
                                              <CheckCircle2 className="w-5 h-5 text-slate-900 shrink-0" />
                                              {sign}
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                          </div>
                      )}
                  </ToolLayout>
              );
          case 'valgus':
              return (
                  <div className="max-w-md mx-auto text-center pt-20 text-slate-400">
                      <Camera className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p className="font-bold">Módulo em Desenvolvimento</p>
                      <button onClick={closeTool} className="mt-4 text-sm text-blue-600 underline">Voltar</button>
                  </div>
              );
          default: return null;
      }
  };

  const ToolCard = ({ id, icon: Icon, title, desc, color }: any) => (
      <button 
        onClick={() => setActiveTool(id)}
        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all text-left flex flex-col gap-4 group active:scale-[0.98] h-full"
      >
          <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-current w-fit group-hover:scale-110 transition-transform`}>
              <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
          </div>
          <div>
              <h3 className="font-black text-slate-900 mb-1 text-lg tracking-tight">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2">{desc}</p>
          </div>
      </button>
  );

  return (
    <div className="h-full flex flex-col bg-slate-50 animate-fadeIn pb-24 lg:pb-0">
        {activeTool && (
            <div className="px-6 pt-6 pb-2 flex justify-between items-center bg-white border-b border-slate-50 sticky top-0 z-20">
                <button onClick={closeTool} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-900">
                    <X className="w-6 h-6" />
                </button>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                    Consultoria Digital
                </div>
                <div className="w-8"></div>
            </div>
        )}

        {/* If no tool active, show menu in scrollable area. If tool active, render tool layout which handles its own scroll/footer */}
        {activeTool ? (
            <div className="flex-1 h-full overflow-hidden">
                {renderToolContent()}
            </div>
        ) : (
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
                    <div className="col-span-full mb-4 px-2">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Ferramentas de Consultório</h1>
                        <p className="text-sm text-slate-500 font-medium">Utilitários para avaliação rápida e suporte à decisão.</p>
                    </div>
                    <ToolCard id="sarcf" icon={Activity} title="SARC-F" desc="Rastreio de sarcopenia e risco de quedas." color="text-green-600 bg-green-600" />
                    <ToolCard id="wound" icon={Eye} title="Wound AI" desc="Análise de feridas por visão computacional." color="text-red-500 bg-red-500" />
                    <ToolCard id="visco" icon={Syringe} title="Ciclo Visco" desc="Gestão de datas do Ácido Hialurônico." color="text-blue-500 bg-blue-500" />
                    <ToolCard id="weight" icon={Weight} title="Carga Articular" desc="Biomecânica do impacto do peso." color="text-orange-500 bg-orange-500" />
                    <ToolCard id="meds" icon={Pill} title="Interações" desc="Verificador de segurança medicamentosa." color="text-teal-600 bg-teal-600" />
                    <ToolCard id="supplements" icon={Utensils} title="Suplementos" desc="Planner de protocolos nutricionais." color="text-pink-600 bg-pink-600" />
                </div>
            </div>
        )}
    </div>
  );
};

export default ClinicalSuite;
