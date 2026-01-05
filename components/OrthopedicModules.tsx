
import React, { useState, useRef } from 'react';
import { PainPoint, OpmeMaterial, SurgeryRecord, BillingItem } from '../types';
import { 
    Activity, Scissors, Plus, Trash2, FileText, Ruler, Maximize, 
    Download, Save, Printer, DollarSign, Check, X, AlertCircle,
    MousePointer2, Move, RotateCw, ZoomIn, UploadCloud
} from 'lucide-react';

// --- MODULE 1: INTERACTIVE BODY MAP ---
export const OrthopedicBodyMap: React.FC<{ 
    points: PainPoint[]; 
    onAddPoint: (p: PainPoint) => void;
    onRemovePoint: (idx: number) => void; 
}> = ({ points, onAddPoint, onRemovePoint }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    const handleMapClick = (e: React.MouseEvent) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        onAddPoint({ x, y, label: 'Ponto de Dor', intensity: 5 });
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 h-full">
            <div className="flex-1 bg-slate-100 rounded-3xl relative overflow-hidden border border-slate-200 shadow-inner group cursor-crosshair">
                <p className="absolute top-4 left-4 text-xs font-bold text-slate-400 pointer-events-none uppercase tracking-widest">Homúnculo Visual</p>
                <div className="w-full h-full flex items-center justify-center p-8">
                    {/* Simplified Human Silhouette SVG */}
                    <svg 
                        ref={svgRef}
                        viewBox="0 0 200 400" 
                        className="h-full w-auto drop-shadow-xl text-slate-300 fill-current"
                        onClick={handleMapClick}
                    >
                        <path d="M100,20 C115,20 125,30 125,45 C125,60 115,70 100,70 C85,70 75,60 75,45 C75,30 85,20 100,20 Z" /> {/* Head */}
                        <path d="M100,70 C100,70 140,80 160,100 L170,200 L150,210 L140,110 L100,100 L60,110 L50,210 L30,200 L40,100 C60,80 100,70 100,70 Z" /> {/* Torso & Arms */}
                        <path d="M70,200 L70,300 L60,380 L80,390 L90,300 L90,200 Z" /> {/* Left Leg */}
                        <path d="M130,200 L130,300 L140,380 L120,390 L110,300 L110,200 Z" /> {/* Right Leg */}
                    </svg>
                    
                    {/* Render Points */}
                    {points.map((p, idx) => (
                        <div 
                            key={idx}
                            className="absolute w-6 h-6 -ml-3 -mt-3 bg-red-500/80 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[10px] text-white font-bold animate-scaleIn cursor-pointer hover:scale-125 transition-transform"
                            style={{ left: `${p.x}%`, top: `${p.y}%` }}
                            onClick={(e) => { e.stopPropagation(); onRemovePoint(idx); }}
                        >
                            {p.intensity}
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full md:w-64 bg-white rounded-3xl border border-slate-200 p-4 overflow-y-auto">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-red-500" /> Registros
                </h3>
                {points.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">Clique no corpo para adicionar pontos de dor.</p>
                ) : (
                    <div className="space-y-2">
                        {points.map((p, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">{p.intensity}</div>
                                <input 
                                    type="text" 
                                    defaultValue={p.label}
                                    className="flex-1 bg-transparent text-xs font-medium outline-none"
                                />
                                <button onClick={() => onRemovePoint(idx)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MODULE 2: IMAGE WORKSPACE (PACS LITE) ---
export const ImageWorkspace: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [tool, setTool] = useState<'none' | 'ruler' | 'angle'>('none');
    
    // Simulate measurements
    const [measurements, setMeasurements] = useState<{type: string, val: string, x: number, y: number}[]>([]);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files?.[0]) {
            const reader = new FileReader();
            reader.onload = () => setImage(reader.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleCanvasClick = (e: React.MouseEvent) => {
        if (!image || tool === 'none') return;
        
        // Mocking interaction: Just add a label where clicked
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (tool === 'ruler') {
            setMeasurements([...measurements, { type: 'Dist', val: '24.5mm', x, y }]);
        } else if (tool === 'angle') {
            setMeasurements([...measurements, { type: 'Cobb', val: '12°', x, y }]);
        }
        setTool('none'); // Reset after adding
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 rounded-3xl overflow-hidden relative">
            {/* Toolbar */}
            <div className="bg-slate-800 p-2 flex items-center justify-between border-b border-slate-700">
                <div className="flex gap-2">
                    <button onClick={() => setTool('none')} className={`p-2 rounded-lg ${tool === 'none' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}><MousePointer2 className="w-4 h-4" /></button>
                    <button onClick={() => setTool('ruler')} className={`p-2 rounded-lg ${tool === 'ruler' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}><Ruler className="w-4 h-4" /></button>
                    <button onClick={() => setTool('angle')} className={`p-2 rounded-lg ${tool === 'angle' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}><RotateCw className="w-4 h-4" /></button>
                </div>
                <div className="flex gap-2">
                    <label className="p-2 bg-slate-700 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-slate-600 flex items-center gap-2">
                        <UploadCloud className="w-4 h-4" /> Upload DICOM/IMG
                        <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                    </label>
                </div>
            </div>

            {/* Viewer */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden cursor-crosshair" onClick={handleCanvasClick}>
                {image ? (
                    <div className="relative">
                        <img src={image} className="max-h-[600px] opacity-90" />
                        {measurements.map((m, i) => (
                            <div key={i} className="absolute bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-white" style={{ left: m.x, top: m.y }}>
                                {m.type}: {m.val}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-slate-500 flex flex-col items-center">
                        <Maximize className="w-12 h-12 mb-2 opacity-20" />
                        <p className="text-sm">Arraste uma imagem de Raio-X ou RM</p>
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
