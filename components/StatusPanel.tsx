
import React from 'react';
import { PlayerStats } from '../types';

interface Props {
  player: PlayerStats;
}

export const StatusPanel: React.FC<Props> = ({ player }) => {
  const progress = (player.qi / player.maxQi) * 100;

  return (
    <div className="md:col-span-3 bg-white/80 border border-stone-300 rounded-lg p-6 flex flex-col gap-6 shadow-xl backdrop-blur-sm">
      <div className="text-center">
        <h2 className="font-calligraphy text-4xl text-amber-900 mb-1">{player.name}</h2>
        <div className="text-stone-500 text-sm">寿元: {Math.floor(player.age)} / 200</div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">当前境界</span>
            <span className="text-emerald-900 font-bold">{player.realm} {player.stage}重</span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-2">
            <div 
              className="bg-emerald-600 h-2 rounded-full shadow-[0_0_8px_rgba(5,150,105,0.3)] transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
             <span className="text-[10px] text-stone-500 font-medium">灵气: {player.qi}</span>
             <span className="text-[10px] text-stone-500 font-medium">突破所需: {player.maxQi}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-100">
          <div>
            <span className="block text-[10px] text-amber-800 uppercase font-bold">气血</span>
            <span className="text-lg font-bold text-red-700">{player.health}/{player.maxHealth}</span>
          </div>
          <div>
            <span className="block text-[10px] text-amber-800 uppercase font-bold">灵石</span>
            <span className="text-lg font-bold text-emerald-700">{player.spiritStones}</span>
          </div>
          <div>
            <span className="block text-[10px] text-amber-800 uppercase font-bold">根骨</span>
            <span className="text-lg font-bold text-stone-700">{player.talent}</span>
          </div>
          <div>
            <span className="block text-[10px] text-amber-800 uppercase font-bold">气运</span>
            <span className="text-lg font-bold text-indigo-700">{player.luck}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="p-3 bg-stone-50 rounded text-xs italic text-stone-400 border-l-2 border-emerald-600">
          修仙之路漫漫，唯有恒心可证大道。
        </div>
      </div>
    </div>
  );
};
