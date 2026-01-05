
import React, { useState, useRef, useEffect } from 'react';
import { PainPoint, OpmeMaterial, SurgeryRecord, BillingItem } from '../types';
import { 
    Activity, Scissors, Plus, Trash2, FileText, Ruler, Maximize, 
    Download, Save, Printer, DollarSign, Check, X, AlertCircle,
    MousePointer2, Move, RotateCw, ZoomIn, UploadCloud, Stethoscope, AlertTriangle, ArrowRight, CornerDownRight, Microscope,
    Pencil, ArrowUpRight, Circle as CircleIcon, Eraser, Undo
} from 'lucide-react';

// --- CONFIG: JOINT ZONES (COMPREHENSIVE SEMIOLOGY) ---
const JOINT_ZONES = [
    // AXIAL
    { id: 'cervical', label: 'Coluna Cervical', x: 50, y: 12, radius: 6, maneuvers: ['Spurling (Radiculopatia)', 'Distração', 'Lhermitte', 'Adson (Desfiladeiro)'] },
    { id: 'lumbar', label: 'Coluna Lombar', x: 50, y: 38, radius: 8, maneuvers: ['Lasegue/SLR (Ciatalgia)', 'Bragard', 'Schober (Espondilite)', 'Slump Test', 'Valsalva'] },
    
    // UPPER LIMB
    { id: 'shoulder_r', label: 'Ombro Direito', x: 28, y: 25, radius: 7, maneuvers: ['Jobe (Supra)', 'Neer (Impacto)', 'Hawkins (Impacto)', 'Patte (Infra)', 'Gerber (Subscap)', 'Speed (Bíceps)', 'Apprehension (Instab.)'] },
    { id: 'shoulder_l', label: 'Ombro Esquerdo', x: 72, y: 25, radius: 7, maneuvers: ['Jobe (Supra)', 'Neer (Impacto)', 'Hawkins (Impacto)', 'Patte (Infra)', 'Gerber (Subscap)', 'Speed (Bíceps)', 'Apprehension (Instab.)'] },
    
    { id: 'elbow_r', label: 'Cotovelo Direito', x: 22, y: 38, radius: 5, maneuvers: ['Cozen (Epicondilite Lat.)', 'Mill', 'Tinel Cubital'] },
    { id: 'elbow_l', label: 'Cotovelo Esquerdo', x: 78, y: 38, radius: 5, maneuvers: ['Cozen (Epicondilite Lat.)', 'Mill', 'Tinel Cubital'] },
    
    { id: 'wrist_r', label: 'Punho/Mão Dir.', x: 18, y: 50, radius: 5, maneuvers: ['Phalen (Túnel do Carpo)', 'Tinel', 'Finkelstein (De Quervain)', 'Allen'] },
    { id: 'wrist_l', label: 'Punho/Mão Esq.', x: 82, y: 50, radius: 5, maneuvers: ['Phalen (Túnel do Carpo)', 'Tinel', 'Finkelstein (De Quervain)', 'Allen'] },

    // LOWER LIMB
    { id: 'hip_r', label: 'Quadril Direito', x: 40, y: 50, radius: 7, maneuvers: ['Patrick/FABERE', 'Thomas (Flexão)', 'Trendelenburg', 'Ober (Banda I.T.)', 'Ely'] },
    { id: 'hip_l', label: 'Quadril Esquerdo', x: 60, y: 50, radius: 7, maneuvers: ['Patrick/FABERE', 'Thomas (Flexão)', 'Trendelenburg', 'Ober (Banda I.T.)', 'Ely'] },

    { id: 'knee_r', label: 'Joelho Direito', x: 35, y: 75, radius: 6, maneuvers: ['Lachman (LCA)', 'Gaveta Anterior', 'Gaveta Posterior (LCP)', 'Pivot Shift', 'Stress Valgo', 'Stress Varo', 'McMurray (Menisco)', 'Appley', 'Tecla (Derrame)'] },
    { id: 'knee_l', label: 'Joelho Esquerdo', x: 65, y: 75, radius: 6, maneuvers: ['Lachman (LCA)', 'Gaveta Anterior', 'Gaveta Posterior (LCP)', 'Pivot Shift', 'Stress Valgo', 'Stress Varo', 'McMurray (Menisco)', 'Appley', 'Tecla (Derrame)'] },

    { id: 'ankle_r', label: 'Tornozelo Dir.', x: 35, y: 92, radius: 5, maneuvers: ['Gaveta Anterior (L. Talofibular)', 'Tilt Talar', 'Thompson (Aquiles)', 'Squeeze (Sindesmose)'] },
    { id: 'ankle_l', label: 'Tornozelo Esq.', x: 65, y: 92, radius: 5, maneuvers: ['Gaveta Anterior (L. Talofibular)', 'Tilt Talar', 'Thompson (Aquiles)', 'Squeeze (Sindesmose)'] },
];

// --- MODULE 1: INTERACTIVE BODY MAP (SEMIOLOGY) ---
export const OrthopedicBodyMap: React.FC<{ 
    points: PainPoint[]; 
    onAddPoint: (p: PainPoint) => void;
    onRemovePoint: (idx: number) => void; 
}> = ({ points, onAddPoint, onRemovePoint }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    
    // Popover State
    const [activeZone, setActiveZone] = useState<typeof JOINT_ZONES[0] | null>(null);
    const [maneuverResults, setManeuverResults] = useState<Record<string, string>>({});

    const handleMapClick = (e: React.MouseEvent) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        // SVG viewBox is 0 0 200 400.
        // x % = clickX / width * 100
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        // Find nearest zone within radius
        const hitZone = JOINT_ZONES.find(z => {
            const dist = Math.sqrt(Math.pow(z.x - x, 2) + Math.pow(z.y - y, 2));
            return dist < z.radius;
        });

        if (hitZone) {
            setActiveZone(hitZone);
            setManeuverResults({});
        } else {
            // Generic Pain Point (Fallback for myofascial/undefined areas)
            onAddPoint({ x, y, label: 'Ponto Álgico', intensity: 5, type: 'pain' });
        }
    };

    const saveSemiology = () => {
        if (!activeZone) return;
        
        // Filter only positive results
        const validResults = Object.entries(maneuverResults).filter(([_, val]) => val !== 'neg');
        
        if (validResults.length > 0) {
            // Create a smart label
            const positives = validResults.map(([k, v]) => `${k.split('(')[0].trim()}`).join(', ');
            onAddPoint({
                x: activeZone.x,
                y: activeZone.y,
                label: `${activeZone.label}: ${positives}`,
                intensity: 0,
                type: 'maneuver',
                details: maneuverResults
            });
        } else {
            // Just pain if no maneuvers positive
            onAddPoint({
                x: activeZone.x,
                y: activeZone.y,
                label: `Dor: ${activeZone.label}`,
                intensity: 5,
                type: 'pain'
            });
        }
        setActiveZone(null);
    };

    const toggleManeuver = (maneuver: string, value: string) => {
        setManeuverResults(prev => ({
            ...prev,
            [maneuver]: prev[maneuver] === value ? 'neg' : value
        }));
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 h-full relative">
            
            {/* SEMIOLOGY POPOVER OVERLAY */}
            {activeZone && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm rounded-3xl animate-fadeIn p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-slideUp">
                        <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                            <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                                <Stethoscope className="w-4 h-4 text-blue-400" />
                                {activeZone.label}
                            </h3>
                            <button onClick={() => setActiveZone(null)} className="hover:bg-white/10 p-1 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        
                        <div className="p-4 max-h-[350px] overflow-y-auto bg-slate-50">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Checklist de Manobras</p>
                            <div className="space-y-2">
                                {activeZone.maneuvers.map(m => (
                                    <div key={m} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                        <span className="text-xs font-bold text-slate-700 w-1/2 leading-tight" title={m}>{m}</span>
                                        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                                            {['+', '++', '+++'].map(val => (
                                                <button
                                                    key={val}
                                                    onClick={() => toggleManeuver(m, val)}
                                                    className={`w-8 h-6 text-[10px] font-black rounded transition-all ${
                                                        maneuverResults[m] === val 
                                                            ? 'bg-red-500 text-white shadow-md' 
                                                            : 'text-slate-400 hover:bg-white hover:text-slate-600'
                                                    }`}
                                                >
                                                    {val}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-2">
                            <button onClick={() => setActiveZone(null)} className="px-4 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Cancelar</button>
                            <button onClick={saveSemiology} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2">
                                <Check className="w-4 h-4" /> Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MAP AREA */}
            <div className="flex-1 bg-slate-100 rounded-[2.5rem] relative overflow-hidden border border-slate-200 shadow-inner group cursor-crosshair select-none">
                <div className="absolute top-6 left-6 z-10 pointer-events-none">
                    <span className="bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 shadow-sm border border-slate-200">
                        <Microscope className="w-3 h-3 text-blue-600" /> Semiologia
                    </span>
                </div>
                
                <div className="w-full h-full flex items-center justify-center p-8 relative">
                    <svg 
                        ref={svgRef}
                        viewBox="0 0 200 400" 
                        className="h-full w-auto drop-shadow-xl text-slate-300 fill-current pointer-events-auto transition-colors duration-300 hover:text-slate-400"
                        onClick={handleMapClick}
                    >
                        <path d="M100,20 C115,20 125,30 125,45 C125,60 115,70 100,70 C85,70 75,60 75,45 C75,30 85,20 100,20 Z" />
                        <path d="M100,70 L140,80 L160,100 L170,200 L150,210 L140,110 L100,100 L60,110 L50,210 L30,200 L40,100 L60,80 Z" />
                        <path d="M70,200 L70,300 L60,380 L80,390 L90,300 L90,200 Z" />
                        <path d="M130,200 L130,300 L140,380 L120,390 L110,300 L110,200 Z" />
                        {JOINT_ZONES.map(z => (
                            <circle 
                                key={z.id} 
                                cx={z.x * 2} 
                                cy={z.y * 4} 
                                r={z.radius * 2}
                                className="fill-transparent hover:fill-blue-500/30 cursor-pointer transition-all duration-300"
                            />
                        ))}
                    </svg>
                    
                    {points.map((p, idx) => (
                        <div 
                            key={idx}
                            className={`absolute -ml-4 -mt-4 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-scaleIn cursor-pointer hover:scale-110 transition-transform group/marker
                            ${p.type === 'maneuver' ? 'w-10 h-10 bg-slate-900 z-30' : 'w-8 h-8 bg-red-500/90 z-20'}`}
                            style={{ left: `${p.x}%`, top: `${p.y}%` }}
                            onClick={(e) => { e.stopPropagation(); onRemovePoint(idx); }}
                        >
                            {p.type === 'maneuver' ? <AlertTriangle className="w-5 h-5 text-yellow-400 animate-pulse" /> : <span className="text-[10px] text-white font-black">{p.intensity}</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* SIDEBAR LIST */}
            <div className="w-full md:w-80 bg-white rounded-[2.5rem] border border-slate-200 p-6 overflow-y-auto shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wide">
                        <Activity className="w-4 h-4 text-blue-600" /> Prontuário
                    </h3>
                    <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">{points.length} Itens</span>
                </div>

                {points.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                        <MousePointer2 className="w-10 h-10 mb-3 text-slate-300" />
                        <p className="text-xs text-slate-500 font-bold max-w-[150px]">Toque nas articulações para adicionar achados.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {points.map((p, idx) => (
                            <div key={idx} className={`p-4 rounded-2xl border flex flex-col gap-2 relative group overflow-hidden transition-all hover:shadow-md ${p.type === 'maneuver' ? 'bg-slate-50 border-slate-200' : 'bg-red-50 border-red-100'}`}>
                                <div className="flex items-start justify-between relative z-10">
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md mb-1 inline-block ${p.type === 'maneuver' ? 'bg-slate-900 text-white' : 'bg-red-200 text-red-800'}`}>
                                        {p.type === 'maneuver' ? 'Semiologia' : 'Dor Referida'}
                                    </span>
                                    <button onClick={() => onRemovePoint(idx)} className="text-slate-400 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                                </div>
                                <p className="text-sm font-bold text-slate-900 leading-tight relative z-10">{p.label.split(':')[0]}</p>
                                {p.details && (
                                    <div className="mt-2 space-y-1 relative z-10">
                                        {Object.entries(p.details).map(([k, v]) => (
                                            <div key={k} className="flex justify-between items-center text-xs border-b border-slate-200/50 pb-1 last:border-0 last:pb-0">
                                                <span className="text-slate-500 font-medium truncate w-2/3" title={k}>{k.split('(')[0]}</span>
                                                <span className="font-black text-red-600 bg-red-50 px-1.5 rounded">{v}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MODULE 2: IMAGE WORKSPACE (EDUCATIONAL ANNOTATION) ---
export const ImageWorkspace: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [tool, setTool] = useState<'pen' | 'arrow' | 'circle' | 'eraser'>('pen');
    const [color, setColor] = useState('#ef4444'); // Default red
    
    // Canvas Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDrawing = useRef(false);
    const startPos = useRef<{x: number, y: number}>({ x: 0, y: 0 });
    const snapshot = useRef<ImageData | null>(null);

    // Initial Image Handling
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files?.[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result as string);
                // Reset canvas when new image loads
                if (canvasRef.current) {
                    const ctx = canvasRef.current.getContext('2d');
                    ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // Canvas Resize Observer to match image size
    useEffect(() => {
        if (image && containerRef.current && canvasRef.current) {
            const resizeCanvas = () => {
                // Ensure canvas matches the container/image aspect ratio visually
                canvasRef.current!.width = containerRef.current!.clientWidth;
                canvasRef.current!.height = containerRef.current!.clientHeight;
            };
            // Initial sizing
            setTimeout(resizeCanvas, 100);
            window.addEventListener('resize', resizeCanvas);
            return () => window.removeEventListener('resize', resizeCanvas);
        }
    }, [image]);

    // Drawing Logic
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        isDrawing.current = true;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        startPos.current = { x, y };
        snapshot.current = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
        ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
        
        if (tool === 'pen') {
            ctx.moveTo(x, y);
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing.current || !canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (tool === 'pen' || tool === 'eraser') {
            ctx.lineTo(x, y);
            ctx.stroke();
        } else if (snapshot.current) {
            // Restore state to avoid trails for shapes
            ctx.putImageData(snapshot.current, 0, 0);
            ctx.beginPath();
            
            if (tool === 'circle') {
                const radius = Math.sqrt(Math.pow(x - startPos.current.x, 2) + Math.pow(y - startPos.current.y, 2));
                ctx.arc(startPos.current.x, startPos.current.y, radius, 0, 2 * Math.PI);
                ctx.stroke();
            } else if (tool === 'arrow') {
                // Draw Line
                const headlen = 15; // length of head in pixels
                const dx = x - startPos.current.x;
                const dy = y - startPos.current.y;
                const angle = Math.atan2(dy, dx);
                
                ctx.moveTo(startPos.current.x, startPos.current.y);
                ctx.lineTo(x, y);
                ctx.lineTo(x - headlen * Math.cos(angle - Math.PI / 6), y - headlen * Math.sin(angle - Math.PI / 6));
                ctx.moveTo(x, y);
                ctx.lineTo(x - headlen * Math.cos(angle + Math.PI / 6), y - headlen * Math.sin(angle + Math.PI / 6));
                ctx.stroke();
            }
        }
    };

    const stopDrawing = () => {
        isDrawing.current = false;
    };

    const clearCanvas = () => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };

    const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#000000', '#ffffff'];

    return (
        <div className="flex flex-col h-full bg-slate-900 rounded-3xl overflow-hidden relative">
            {/* Toolbar */}
            <div className="bg-slate-800 p-2 flex items-center justify-between border-b border-slate-700 select-none">
                <div className="flex gap-2 items-center">
                    <button onClick={() => setTool('pen')} className={`p-2 rounded-lg transition-all ${tool === 'pen' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700'}`}><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setTool('arrow')} className={`p-2 rounded-lg transition-all ${tool === 'arrow' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700'}`}><ArrowUpRight className="w-4 h-4" /></button>
                    <button onClick={() => setTool('circle')} className={`p-2 rounded-lg transition-all ${tool === 'circle' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700'}`}><CircleIcon className="w-4 h-4" /></button>
                    <button onClick={() => setTool('eraser')} className={`p-2 rounded-lg transition-all ${tool === 'eraser' ? 'bg-red-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700'}`}><Eraser className="w-4 h-4" /></button>
                    
                    <div className="w-px h-6 bg-slate-600 mx-1"></div>
                    
                    <div className="flex gap-1.5">
                        {colors.map(c => (
                            <button 
                                key={c}
                                onClick={() => setColor(c)}
                                className={`w-5 h-5 rounded-full border-2 transition-all ${color === c ? 'border-white scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <button onClick={clearCanvas} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    <label className="p-2 bg-slate-700 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-slate-600 flex items-center gap-2">
                        <UploadCloud className="w-4 h-4" /> <span className="hidden sm:inline">Imagem</span>
                        <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                    </label>
                </div>
            </div>

            {/* Viewer/Canvas */}
            <div ref={containerRef} className="flex-1 relative bg-black flex items-center justify-center overflow-hidden cursor-crosshair">
                {image ? (
                    <>
                        <img 
                            src={image} 
                            className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-80" 
                            alt="Exam" 
                        />
                        <canvas 
                            ref={canvasRef}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            className="absolute inset-0 w-full h-full z-10"
                        />
                    </>
                ) : (
                    <div className="text-slate-500 flex flex-col items-center select-none">
                        <Maximize className="w-12 h-12 mb-2 opacity-20" />
                        <p className="text-sm font-medium">Carregue um RX ou Ressonância para desenhar</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MODULE 3: SURGICAL PLAN (OPME) ---
export const SurgicalModule: React.FC = () => {
    const [materials, setMaterials] = useState<OpmeMaterial[]>([]);
    const [description, setDescription] = useState('');

    const addMaterial = () => {
        const id = Date.now().toString();
        setMaterials([...materials, { id, name: '', qty: 1, lot: '', serial: '' }]);
    };

    const updateMaterial = (id: string, field: keyof OpmeMaterial, val: any) => {
        setMaterials(prev => prev.map(m => m.id === id ? { ...m, [field]: val } : m));
    };

    const generateDescription = (type: string) => {
        if (type === 'LCA') setDescription("Paciente em decúbito dorsal, raquianestesia. Realizada artroscopia diagnóstica identificando ruptura do LCA. Preparo do enxerto de flexores (semitendíneo/grácil). Túneis femoral e tibial confeccionados. Fixação com botão cortical femoral e parafuso de interferência tibial.");
        if (type === 'ATJ') setDescription("Abordagem parapatelar medial. Osteotomias femoral distal e tibial proximal guiadas. Balanço ligamentar. Cimentação dos componentes femoral, tibial e patelar. Teste de estabilidade e ADM satisfatórios.");
    };

    return (
        <div className="space-y-6 h-full overflow-y-auto no-scrollbar pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Description */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" /> Descrição Cirúrgica</h3>
                        <div className="flex gap-2">
                            <button onClick={() => generateDescription('LCA')} className="text-[10px] bg-slate-100 px-2 py-1 rounded-lg font-bold hover:bg-slate-200">Template LCA</button>
                            <button onClick={() => generateDescription('ATJ')} className="text-[10px] bg-slate-100 px-2 py-1 rounded-lg font-bold hover:bg-slate-200">Template ATJ</button>
                        </div>
                    </div>
                    <textarea 
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full h-48 p-4 bg-slate-50 rounded-xl text-sm border-0 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                        placeholder="Descreva o procedimento..."
                    />
                </div>

                {/* OPME Tracking */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2"><Scissors className="w-5 h-5 text-purple-600" /> Rastreabilidade OPME</h3>
                        <button onClick={addMaterial} className="bg-slate-900 text-white p-1.5 rounded-lg"><Plus className="w-4 h-4" /></button>
                    </div>
                    
                    <div className="space-y-3">
                        {materials.map(mat => (
                            <div key={mat.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                                <div className="flex gap-2 mb-2">
                                    <input type="text" placeholder="Material (ex: Parafuso)" value={mat.name} onChange={e => updateMaterial(mat.id, 'name', e.target.value)} className="flex-1 bg-white p-2 rounded-lg border border-slate-200 outline-none" />
                                    <input type="number" placeholder="Qtd" value={mat.qty} onChange={e => updateMaterial(mat.id, 'qty', parseInt(e.target.value))} className="w-12 bg-white p-2 rounded-lg border border-slate-200 outline-none" />
                                </div>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Lote" value={mat.lot} onChange={e => updateMaterial(mat.id, 'lot', e.target.value)} className="flex-1 bg-white p-2 rounded-lg border border-slate-200 outline-none font-mono" />
                                    <input type="text" placeholder="Série" value={mat.serial} onChange={e => updateMaterial(mat.id, 'serial', e.target.value)} className="flex-1 bg-white p-2 rounded-lg border border-slate-200 outline-none font-mono" />
                                </div>
                            </div>
                        ))}
                        {materials.length === 0 && <p className="text-center text-xs text-slate-400 py-4">Nenhum material registrado.</p>}
                    </div>
                </div>
            </div>
            
            <div className="flex justify-end gap-3">
                <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2 hover:bg-slate-50">
                    <Printer className="w-4 h-4" /> Imprimir Relatório
                </button>
                <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 hover:bg-slate-800">
                    <Save className="w-4 h-4" /> Salvar Prontuário
                </button>
            </div>
        </div>
    );
};

// --- MODULE 4: BILLING (TISS/TUSS) ---
export const BillingModule: React.FC = () => {
    const [items, setItems] = useState<BillingItem[]>([]);
    
    const tussCodes = [
        { code: '30726010', desc: 'Artroplastia total de joelho', val: 2500.00 },
        { code: '30730077', desc: 'Reconstrução ligamentar intra-articular (LCA)', val: 1800.00 },
        { code: '20101015', desc: 'Consulta em consultório', val: 350.00 },
        { code: '30712060', desc: 'Infiltração articular', val: 400.00 },
    ];

    const addItem = (template: any) => {
        setItems([...items, { ...template, type: 'honorario' }]);
    };

    const total = items.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 flex items-center gap-2"><DollarSign className="w-5 h-5 text-green-600" /> Faturamento TISS</h3>
                <div className="text-right">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Total Previsto</span>
                    <span className="block text-xl font-black text-slate-900">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row">
                {/* Selector */}
                <div className="w-full md:w-1/3 p-4 border-r border-slate-100 bg-white overflow-y-auto">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-3">Tabela TUSS</p>
                    <div className="space-y-2">
                        {tussCodes.map(code => (
                            <button 
                                key={code.code} 
                                onClick={() => addItem(code)}
                                className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
                            >
                                <div className="flex justify-between mb-1">
                                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-1.5 rounded">{code.code}</span>
                                    <span className="text-xs font-bold text-green-600">R$ {code.val}</span>
                                </div>
                                <p className="text-xs font-medium text-slate-700 leading-tight group-hover:text-blue-800">{code.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 p-4 bg-slate-50/50">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-3">Itens Lançados</p>
                    {items.length === 0 ? (
                        <div className="h-40 flex items-center justify-center text-slate-400 text-sm">Nenhum item lançado.</div>
                    ) : (
                        <div className="space-y-2">
                            {items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <div>
                                        <span className="text-xs font-bold text-slate-900 block">{item.description}</span>
                                        <span className="text-xs font-bold text-slate-900 block">{item.description}</span>
                                        <span className="text-[10px] text-slate-400 font-mono">{item.code}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-slate-700">R$ {item.value}</span>
                                        <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="p-4 border-t border-slate-200 flex justify-end">
                <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-green-500/30 flex items-center gap-2 hover:bg-green-700 active:scale-95 transition-all">
                    <Check className="w-4 h-4" /> Gerar Guia
                </button>
            </div>
        </div>
    );
};
