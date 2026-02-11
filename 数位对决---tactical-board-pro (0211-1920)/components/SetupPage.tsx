
import React, { useState } from 'react';
import { GameMode } from '../types';

interface SetupPageProps {
  onStart: (secret: string, mode: GameMode) => void;
  onStartAI: (length: number) => void;
  showToast: (msg: string) => void;
}

const SetupPage: React.FC<SetupPageProps> = ({ onStart, onStartAI, showToast }) => {
  const [stage, setStage] = useState<'selection' | 'difficulty' | 'input'>('selection');
  const [mode, setMode] = useState<GameMode>(null);
  const [difficulty, setDifficulty] = useState(3);
  const [input, setInput] = useState('');
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const handleModeSelect = (selectedMode: GameMode) => {
    setMode(selectedMode);
    if (selectedMode === 'ai') {
      setStage('difficulty');
    } else {
      setStage('input');
    }
  };

  const handleDifficultyConfirm = () => {
    // AI 模式：确定难度后直接由 AI 出题启动
    onStartAI(difficulty);
  };

  const handleStartLocal = () => {
    if (input.length < 3 || input.length > 5) {
      showToast("请设置 3-5 位数字");
      return;
    }
    const isDuplicate = new Set(input).size !== input.length;
    if (isDuplicate) {
      showToast("数字不能重复");
      return;
    }
    onStart(input, 'local');
  };

  const restartSetup = () => {
    setStage('selection');
    setMode(null);
    setInput('');
  };

  const getDifficultyText = (val: number) => {
    if (val === 3) return "3位数 简单";
    if (val === 4) return "4位数 一般";
    if (val === 5) return "5位数 困难";
    return `${val}位数`;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white h-full relative overflow-y-auto">
      
      {stage === 'selection' && (
        <div className="animate-fade-in w-full flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-normal leading-tight text-[#1f1f1f] mb-12">
            你好，<span className="gemini-gradient-text font-bold">准备好</span><br />
            开始对决了吗？
          </h1>
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
            <button 
              onClick={() => handleModeSelect('ai')}
              className="mode-card flex flex-col items-center justify-center aspect-square border-2 border-blue-100 rounded-[28px] bg-white p-4 hover:border-[#7c72f1] transition-all"
            >
              <div className="text-3xl mb-3">🤖</div>
              <span className="text-lg font-bold text-[#1f1f1f]">自己玩儿</span>
            </button>
            <button 
              onClick={() => handleModeSelect('local')}
              className="mode-card flex flex-col items-center justify-center aspect-square border-2 border-blue-100 rounded-[28px] bg-white p-4 hover:border-[#7c72f1] transition-all"
            >
              <div className="text-3xl mb-3">👥</div>
              <div className="flex flex-col text-lg font-bold text-[#1f1f1f] leading-tight">
                <span>好友</span>
                <span>面对面玩儿</span>
              </div>
            </button>
          </div>
          <button type="button" onClick={() => setIsRulesOpen(true)} className="mt-6 text-[#1a73e8] text-sm font-medium flex items-center gap-1 hover:underline">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            查看游戏规则
          </button>
        </div>
      )}

      {stage === 'difficulty' && (
        <div className="animate-slide-in w-full max-w-sm flex flex-col items-center">
          <h2 className="text-lg font-bold text-[#1f1f1f] mb-16">请选择难度</h2>
          <div className="w-full mb-12">
            <div className="text-xl font-bold mb-6">{getDifficultyText(difficulty)}</div>
            <input 
              type="range" 
              min="3" 
              max="5" 
              step="1" 
              value={difficulty} 
              onChange={(e) => setDifficulty(parseInt(e.target.value))}
              className="difficulty-slider" 
            />
          </div>
          <button 
            type="button" 
            onClick={handleDifficultyConfirm} 
            className="px-16 py-5 rounded-[24px] text-lg font-bold bg-[#7B70FF] text-white active:scale-95 shadow-sm w-full"
          >
            开始游戏
          </button>
          <button onClick={restartSetup} className="mt-8 text-[#1a73e8] text-xs font-bold uppercase tracking-wider hover:underline">重新开始游戏</button>
        </div>
      )}

      {stage === 'input' && (
        <div className="animate-slide-in w-full max-w-sm flex flex-col items-center">
          <h2 className="text-lg font-bold text-[#1f1f1f] mb-12">请设置 3-5 位的不重复数字</h2>
          <div className="w-full mb-12">
            <div className="bg-[#f0f4f9] rounded-[32px] p-8 flex items-center justify-center">
              <input 
                type="text" 
                inputMode="numeric" 
                autoFocus
                value={input} 
                onChange={(e) => setInput(e.target.value.replace(/[^0-9]/g, '').slice(0, 5))} 
                placeholder="输 入 你 的 数 字 密 码" 
                className="w-full bg-transparent text-center text-2xl tracking-[4px] outline-none font-bold text-gray-400 placeholder:text-gray-300" 
              />
            </div>
          </div>
          <button 
            type="button" 
            onClick={handleStartLocal} 
            className={`px-16 py-5 rounded-[24px] text-lg font-bold transition-all shadow-sm w-full ${
              input.length >= 3 ? 'bg-[#7B70FF] text-white active:scale-95' : 'bg-[#f0f4f9] text-gray-400'
            }`}
          >
            开始游戏
          </button>
          <button onClick={restartSetup} className="mt-8 text-[#1a73e8] text-xs font-bold uppercase tracking-wider hover:underline">重新开始游戏</button>
        </div>
      )}

      {/* Rules Modal */}
      {isRulesOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-[450px] rounded-[40px] shadow-2xl overflow-hidden animate-slide-in">
            <div className="p-10 text-left">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><span>🕵️‍♂️</span> 破译专家：数字密码战</h2>
              <div className="space-y-5 text-base leading-relaxed text-[#444746] max-h-[50vh] overflow-y-auto pr-3 custom-scrollbar">
                <section>
                  <p className="font-bold text-[#1a73e8] mb-2 text-lg">【核心玩法】</p>
                  <p>这是一个经典的猜数字逻辑游戏：</p>
                  <ul className="list-decimal list-inside space-y-2 mt-2">
                    <li>对方设置 3-5 位不重复的数字。</li>
                    <li>猜测时，对方反馈“正确数”（数值及位置均正确的个数）。例如：密码为1234，对方猜1256，回“2个正确”；对方猜1236，回“3个正确”。</li>
                    <li>最先完全猜中者获胜。</li>
                  </ul>
                </section>
                <section>
                  <p className="font-bold text-[#1a73e8] mb-2 text-lg">【模式说明】</p>
                  <ul className="space-y-4">
                    <li><span className="font-bold text-black">自己玩儿：</span> 电脑会随机生成一个不重复的数字，你需要通过逻辑推理找出它。系统会自动计算“正确数”。</li>
                    <li><span className="font-bold text-black">面对面：</span> 你和朋友互相设置密码，轮流猜测并手动输入对方给出的反馈。</li>
                  </ul>
                </section>
              </div>
              <button type="button" onClick={() => setIsRulesOpen(false)} className="w-full mt-10 bg-[#f0f4f9] hover:bg-[#e0e8f5] text-[#1a73e8] py-5 rounded-[24px] font-bold text-lg transition-colors">我知道了</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupPage;