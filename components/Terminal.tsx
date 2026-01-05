
import React, { useState } from 'react';
import { Search, Copy, Trash2, Terminal as TerminalIcon } from 'lucide-react';

const Terminal = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden font-mono text-sm shadow-2xl my-6">
      {/* Toolbar Container: Stack on mobile, Row on desktop */}
      <div className="bg-slate-900 p-3 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        {/* Left Side: Window Controls & File Name */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex gap-1.5 shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          <div className="flex items-center gap-2 text-slate-400 select-none min-w-0">
            <TerminalIcon className="w-4 h-4 shrink-0" />
            {/* Truncate file name on small screens */}
            <span className="truncate max-w-[150px] sm:max-w-none font-bold text-xs">pipeline_logs.log</span>
          </div>
        </div>

        {/* Right Side: Search & Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          
          {/* Search Input: Full width on mobile, fixed width on desktop */}
          <div className="relative w-full sm:w-48">
            <Search className="absolute left-2 top-1.5 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 text-slate-300 pl-8 pr-3 py-1.5 rounded-lg text-xs border border-slate-700 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="flex gap-1 shrink-0">
            <button className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors" title="Copy Logs">
                <Copy className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-red-400 transition-colors" title="Clear Terminal">
                <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Content Area */}
      <div className="p-4 h-64 overflow-y-auto space-y-1.5 text-xs sm:text-sm bg-slate-950/50">
        <div className="flex gap-2"><span className="text-blue-500 font-bold">[INFO]</span> <span className="text-slate-300">Initializing system components...</span></div>
        <div className="flex gap-2"><span className="text-blue-500 font-bold">[INFO]</span> <span className="text-slate-300">Loading modules: orthopedics, gemini_ai, react_dom...</span></div>
        <div className="flex gap-2"><span className="text-green-500 font-bold">[SUCCESS]</span> <span className="text-slate-300">Database connection established (latency: 12ms).</span></div>
        <div className="flex gap-2"><span className="text-yellow-500 font-bold">[WARN]</span> <span className="text-slate-300">Mobile viewport detected. Optimizing layout for touch input.</span></div>
        <div className="flex gap-2"><span className="text-blue-500 font-bold">[INFO]</span> <span className="text-slate-300">Rendering Dashboard component...</span></div>
        <div className="flex gap-2"><span className="text-purple-500 font-bold">[DEBUG]</span> <span className="text-slate-300">Fetching user profile data from local storage.</span></div>
        <div className="flex gap-2"><span className="text-green-500 font-bold">[READY]</span> <span className="text-slate-300">System ready. Waiting for user input.</span></div>
        <div className="flex gap-2 mt-2"><span className="text-green-400 font-bold">$</span> <span className="text-slate-100 animate-pulse">_</span></div>
      </div>
    </div>
  );
};

export default Terminal;
