
import React, { useState } from 'react';
import { X, Zap, Database, Stethoscope, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'optimization' | 'sql' | 'diagnosis'>('optimization');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header & Navigation */}
        <div className="border-b border-slate-200 shrink-0">
          <div className="flex items-center justify-between p-4 pb-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                Layer Analysis
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Responsive Tabs Navigation */}
          <div className="flex px-4 gap-1 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab('optimization')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 border-b-2 transition-all outline-none ${
                activeTab === 'optimization' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200'
              }`}
            >
              <Zap className="w-4 h-4 shrink-0" />
              {/* Text hidden on mobile to prevent line-break */}
              <span className="hidden sm:inline font-bold text-sm">Optimization</span>
            </button>

            <button 
              onClick={() => setActiveTab('sql')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 border-b-2 transition-all outline-none ${
                activeTab === 'sql' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200'
              }`}
            >
              <Database className="w-4 h-4 shrink-0" />
              {/* Text hidden on mobile to prevent line-break */}
              <span className="hidden sm:inline font-bold text-sm">SQL Query</span>
            </button>

            <button 
              onClick={() => setActiveTab('diagnosis')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 border-b-2 transition-all outline-none ${
                activeTab === 'diagnosis' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200'
              }`}
            >
              <Stethoscope className="w-4 h-4 shrink-0" />
              {/* Text hidden on mobile to prevent line-break */}
              <span className="hidden sm:inline font-bold text-sm">Diagnosis</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 bg-slate-50 overflow-y-auto flex-1">
           {activeTab === 'optimization' && (
               <div className="space-y-4 animate-fadeIn">
                   <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-start gap-3">
                       <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                       <div>
                           <h4 className="font-bold text-green-900 text-sm">Index Optimized</h4>
                           <p className="text-xs text-green-700 mt-1">Spatial index usage is efficient. Query time reduced by 40%.</p>
                       </div>
                   </div>
                   <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                       <h4 className="font-bold text-slate-800 text-sm mb-3">Suggestions</h4>
                       <ul className="space-y-2">
                           <li className="text-xs text-slate-600 flex items-center gap-2">
                               <ChevronRight className="w-3 h-3 text-blue-500" /> Use bounding box filter for faster rendering.
                           </li>
                           <li className="text-xs text-slate-600 flex items-center gap-2">
                               <ChevronRight className="w-3 h-3 text-blue-500" /> Simplification recommended for zoom levels {'<'} 10.
                           </li>
                       </ul>
                   </div>
               </div>
           )}

           {activeTab === 'sql' && (
               <div className="animate-fadeIn">
                   <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto border border-slate-800 shadow-inner">
                       <code className="text-xs font-mono text-blue-300">
                           SELECT <span className="text-purple-400">*</span> <br/>
                           FROM <span className="text-green-400">spatial_layers.roads</span> <br/>
                           WHERE <span className="text-yellow-400">ST_Intersects</span>(geom, viewport) <br/>
                           AND type = <span className="text-orange-400">'primary'</span> <br/>
                           LIMIT 1000;
                       </code>
                   </div>
                   <button className="mt-4 text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                       Copy Query to Clipboard
                   </button>
               </div>
           )}

           {activeTab === 'diagnosis' && (
               <div className="space-y-4 animate-fadeIn">
                   <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                       <span className="text-sm font-medium text-slate-700">Latency</span>
                       <span className="text-sm font-bold text-green-600">12ms</span>
                   </div>
                   <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                       <span className="text-sm font-medium text-slate-700">Render Time</span>
                       <span className="text-sm font-bold text-orange-500">145ms</span>
                   </div>
                   <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-start gap-3">
                       <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                       <div>
                           <h4 className="font-bold text-orange-900 text-sm">High Feature Count</h4>
                           <p className="text-xs text-orange-700 mt-1">Current view contains 15,000+ vertices. Consider clustering.</p>
                       </div>
                   </div>
               </div>
           )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-white shrink-0 flex justify-end">
            <button onClick={onClose} className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95">
                Close Report
            </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
