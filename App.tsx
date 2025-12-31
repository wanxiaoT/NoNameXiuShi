
import React, { useState, useCallback, useEffect } from 'react';
import { Layout } from './components/Layout';
import { StatusPanel } from './components/StatusPanel';
import { LogPanel } from './components/LogPanel';
import { ActionPanel } from './components/ActionPanel';
import { PlayerStats, GameLog } from './types';
import { INITIAL_PLAYER, REALMS_ORDER, REALM_REQUIREMENTS } from './constants';
import * as geminiService from './services/geminiService';

const App: React.FC = () => {
  const [player, setPlayer] = useState<PlayerStats>(INITIAL_PLAYER);
  const [logs, setLogs] = useState<GameLog[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [isCultivating, setIsCultivating] = useState(false);
  const [isExploring, setIsExploring] = useState(false);
  const [isBreakingThrough, setIsBreakingThrough] = useState(false);

  const addLog = useCallback((content: string, type: GameLog['type'] = 'info') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      content,
      type
    }].slice(-50));
  }, []);

  const handleBreakthrough = useCallback(async () => {
    // 内部再次检查，防止竞态条件
    if (isBusy || isBreakingThrough) return;
    
    setIsBusy(true);
    setIsBreakingThrough(true);
    addLog("修为已达圆满，正在自动冲击境界瓶颈！", 'warning');

    const currentRealmIndex = REALMS_ORDER.indexOf(player.realm);
    const successChance = 65 + (player.luck / 10);
    const isSuccess = Math.random() * 100 < successChance;

    // 预备下一阶段数据
    let nextRealm = player.realm;
    let nextStage = player.stage + 1;
    let nextMaxQi = player.maxQi;
    if (nextStage > 9) {
      if (currentRealmIndex < REALMS_ORDER.length - 1) {
        nextRealm = REALMS_ORDER[currentRealmIndex + 1];
        nextStage = 1;
        nextMaxQi = REALM_REQUIREMENTS[nextRealm];
      }
    } else {
      nextMaxQi = Math.floor(player.maxQi * 1.5); // 稍微增加跨度感
    }

    // 同时启动 2 秒动画和 AI 文本请求
    const messagePromise = geminiService.generateBreakthroughMessage(player.realm, nextRealm, isSuccess);
    const animationPromise = new Promise(resolve => setTimeout(resolve, 2000));

    // 等待 2 秒时间窗结束
    await animationPromise;
    const aiMessage = await Promise.race([
      messagePromise,
      new Promise<string>(resolve => setTimeout(() => resolve(isSuccess ? "天降祥瑞，金光入体，你成功晋升了！" : "灵力逆流，经脉受阻，冲击境界宣告失败。"), 500))
    ]);

    // 结算结果
    if (isSuccess) {
      if (player.stage === 9 && currentRealmIndex === REALMS_ORDER.length - 1) {
        addLog("羽化而登仙，你已踏入至高之境！", 'success');
      } else {
        addLog(aiMessage as string, 'success');
        addLog(`突破成功！晋升至 ${nextRealm} ${nextStage}重。`, 'success');
        setPlayer(prev => ({
          ...prev,
          realm: nextRealm,
          stage: nextStage,
          qi: 0,
          maxQi: nextMaxQi,
          maxHealth: prev.maxHealth + 50,
          health: prev.maxHealth + 50
        }));
      }
    } else {
      addLog(aiMessage as string, 'danger');
      addLog("突破失败，灵力溢散，修养片刻再试。", 'danger');
      setPlayer(prev => ({
        ...prev,
        qi: Math.floor(prev.qi * 0.7),
        health: Math.floor(prev.health * 0.8)
      }));
    }

    setIsBusy(false);
    setIsBreakingThrough(false);
  }, [player, isBusy, isBreakingThrough, addLog]);

  // 核心逻辑：修为够了自动突破
  useEffect(() => {
    if (player.qi >= player.maxQi && !isBusy && !isBreakingThrough) {
      handleBreakthrough();
    }
  }, [player.qi, player.maxQi, isBusy, isBreakingThrough, handleBreakthrough]);

  const handleCultivate = useCallback(() => {
    if (isBusy) return;
    setIsBusy(true);
    setIsCultivating(true);

    const qiGain = Math.floor(Math.random() * 10) + 18 + Math.floor(player.talent);
    setPlayer(prev => ({
      ...prev,
      qi: Math.min(prev.qi + qiGain, prev.maxQi),
      age: prev.age + 0.01 
    }));

    addLog(`你凝神定气，引导周天灵气汇入丹田。`, 'cultivation');
    addLog(`修为提升了 ${qiGain} 点。`, 'info');

    setTimeout(() => {
      setIsBusy(false);
      setIsCultivating(false);
    }, 300);

    geminiService.generateCultivationStory(player.realm, player.stage).then(story => {
      addLog(story, 'cultivation');
    }).catch(() => {});

  }, [isBusy, player, addLog]);

  const handleExplore = useCallback(async () => {
    if (isBusy) return;
    setIsBusy(true);
    setIsExploring(true);

    addLog("你收拾行囊，离开了闭关之地，踏上了历练的旅程...", 'warning');

    try {
      const result = await geminiService.generateEncounter(player.realm, player.luck);
      addLog(result.story, 'info');

      setPlayer(prev => ({
        ...prev,
        qi: Math.max(0, Math.min(prev.qi + (result.qiGain || 0), prev.maxQi)),
        health: Math.max(0, prev.health - (result.healthLoss || 0)),
        spiritStones: prev.spiritStones + (result.stonesFound || 0),
        age: prev.age + 0.2
      }));

      if (result.qiGain && result.qiGain > 0) addLog(`修为提升了 ${result.qiGain} 点。`, 'success');
      if (result.healthLoss && result.healthLoss > 0) addLog(`受轻伤，损耗 ${result.healthLoss} 点气血。`, 'danger');
      if (result.stonesFound && result.stonesFound > 0) addLog(`获得灵石 x${result.stonesFound}。`, 'success');
    } catch (e) {
      addLog("历练途中风平浪静，并无波澜。", 'info');
    }

    setTimeout(() => {
      setIsBusy(false);
      setIsExploring(false);
    }, 1000);
  }, [isBusy, player.realm, player.luck, addLog]);

  const canBreakthrough = player.qi >= player.maxQi;

  return (
    <Layout>
      <StatusPanel player={player} />
      <LogPanel logs={logs} />
      <ActionPanel 
        onCultivate={handleCultivate}
        onExplore={handleExplore}
        onBreakthrough={handleBreakthrough}
        isCultivating={isCultivating}
        isExploring={isExploring}
        canBreakthrough={canBreakthrough}
      />
      
      {/* 突破专用小动画 - 非死锁遮罩 */}
      {isBreakingThrough && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
          <div className="relative p-10 bg-white/90 rounded-2xl border border-amber-200 shadow-2xl flex flex-col items-center animate-in zoom-in duration-300">
            {/* 灵力漩涡动画 */}
            <div className="w-24 h-24 mb-6 relative">
              <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-t-4 border-amber-600 rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-emerald-500/20 rounded-full"></div>
              <div className="absolute inset-4 border-b-4 border-emerald-600 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
            </div>
            
            <h2 className="text-3xl font-calligraphy text-amber-900 animate-pulse">冲击瓶颈中...</h2>
            <p className="text-stone-400 text-xs mt-2 uppercase tracking-[0.2em]">Ascending</p>
            
            {/* 2秒进度条 */}
            <div className="w-48 h-1 bg-stone-100 rounded-full mt-6 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 animate-[loading_2s_linear_forwards]"></div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
