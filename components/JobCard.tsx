
import React from 'react';
import { Database, Globe, CheckCircle, AlertCircle, Clock, Loader2 } from 'lucide-react';

interface JobProps {
  job: {
    id: string;
    status: string;
    layer: {
      name: string;
      url: string;
    };
  };
}

const JobCard: React.FC<JobProps> = ({ job }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'processing': return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      case 'processing': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      {/* Icon - Shrink 0 to prevent squashing */}
      <div className="p-3 bg-slate-50 rounded-lg shrink-0">
        <Database className="w-6 h-6 text-slate-500" />
      </div>

      {/* Main Content - Min-w-0 and Flex-1 to allow truncation within flex container */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-slate-900 mb-0.5 flex items-center">
          <span className="truncate">{job.layer.name}</span>
        </h3>
        
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Globe className="w-3 h-3 shrink-0" />
          <p className="truncate hover:text-blue-600 transition-colors" title={job.layer.url}>
            {job.layer.url}
          </p>
        </div>
      </div>

      {/* Status Badge - Shrink 0 */}
      <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 shrink-0 ${getStatusStyles(job.status)}`}>
        {getStatusIcon(job.status)}
        <span className="uppercase tracking-wider text-[10px] hidden sm:inline">{job.status}</span>
      </div>
    </div>
  );
};

export default JobCard;
