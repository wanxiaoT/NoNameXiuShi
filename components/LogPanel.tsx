
import React, { useEffect, useRef } from 'react';
import { GameLog } from '../types';

interface Props {
  logs: GameLog[];
}

export const LogPanel: React.FC<Props> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogStyle = (type: string) => {
    switch (type) {
      case 'success': return 'text-emerald-700 font-bold';
      case 'danger': return 'text-red-700 font-bold';
      case 'warning': return 'text-amber-800';
      case 'cultivation': return 'text-indigo-800 italic';
      default: return 'text-stone-700';
    }
  };

  return (
    <div className="md:col-span-6 bg-white/60 border border-stone-200 rounded-lg flex flex-col overflow-hidden shadow-inner">
      <div className="p-3 bg-white/90 border-b border-stone-100 flex justify-between items-center">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">修行志</span>
        <span className="text-[10px] text-stone-400 font-medium">大道五十，天衍四九</span>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-hide font-serif text-lg leading-relaxed"
      >
        {logs.map((log) => (
          <div key={log.id} className={`${getLogStyle(log.type)} animate-in fade-in slide-in-from-bottom-2 duration-700 border-b border-stone-50 pb-2`}>
            <span className="text-stone-300 text-xs mr-3 font-mono">
              [{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
            </span>
            {log.content}
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-center text-stone-300 mt-20 italic">
            你踏入了这片神秘的大陆，故事从这里开始...
          </div>
        )}
      </div>
    </div>
  );
};
