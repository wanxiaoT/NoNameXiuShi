
import React from 'react';

interface Props {
  onCultivate: () => void;
  onExplore: () => void;
  onBreakthrough: () => void;
  isCultivating: boolean;
  isExploring: boolean;
  canBreakthrough: boolean;
}

export const ActionPanel: React.FC<Props> = ({ 
  onCultivate, 
  onExplore, 
  onBreakthrough, 
  isCultivating, 
  isExploring,
  canBreakthrough 
}) => {
  return (
    <div className="md:col-span-3 flex flex-col gap-4">
      <button 
        onClick={onCultivate}
        disabled={isCultivating || isExploring}
        className={`group relative h-24 overflow-hidden rounded-lg border-2 border-amber-600/30 bg-white transition-all 
          ${isCultivating ? 'opacity-50' : 'hover:border-amber-600 hover:shadow-lg active:scale-95'}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <span className="font-calligraphy text-2xl text-amber-900 group-hover:text-amber-700">打坐修炼</span>
          <span className="text-[10px] text-stone-400 mt-1 uppercase tracking-tighter">Gather Qi</span>
        </div>
        {isCultivating && (
          <div className="absolute bottom-0 left-0 h-1 bg-amber-600 transition-all animate-pulse" style={{ width: '100%' }}></div>
        )}
      </button>

      <button 
        onClick={onExplore}
        disabled={isCultivating || isExploring}
        className={`group relative h-24 overflow-hidden rounded-lg border-2 border-emerald-600/30 bg-white transition-all 
          ${isExploring ? 'opacity-50' : 'hover:border-emerald-600 hover:shadow-lg active:scale-95'}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <span className="font-calligraphy text-2xl text-emerald-900 group-hover:text-emerald-700">下山历练</span>
          <span className="text-[10px] text-stone-400 mt-1 uppercase tracking-tighter">Adventure</span>
        </div>
      </button>

      <button 
        onClick={onBreakthrough}
        disabled={!canBreakthrough || isCultivating || isExploring}
        className={`group relative h-24 overflow-hidden rounded-lg border-2 transition-all 
          ${canBreakthrough 
            ? 'border-amber-600 bg-white hover:border-amber-500 animate-glow-light shadow-md active:scale-95' 
            : 'border-stone-200 bg-stone-50 grayscale opacity-40 cursor-not-allowed'}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 to-transparent"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <span className={`font-calligraphy text-2xl ${canBreakthrough ? 'text-amber-800' : 'text-stone-400'}`}>突破境界</span>
          <span className="text-[10px] text-stone-400 mt-1 uppercase tracking-tighter">Breakthrough</span>
        </div>
      </button>

      <div className="mt-auto grid grid-cols-2 gap-2">
         {['丹房', '藏经阁', '坊市', '灵田'].map(item => (
           <button key={item} className="p-3 bg-white border border-stone-200 rounded text-xs text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-all shadow-sm">
              {item}
           </button>
         ))}
      </div>
    </div>
  );
};
