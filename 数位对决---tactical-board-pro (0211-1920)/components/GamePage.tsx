import React, { useState, useRef, useEffect } from 'react';
import { GameState, GameRecord } from '../types';
import RecordItem from './RecordItem';

interface GamePageProps {
  state: GameState;
  onToggleSecret: () => void;
  onAddRecord: (guess: string) => void;
  onUpdateRecord: (id: string, updates: Partial<GameRecord>) => void;
  onRemoveRecord: (id: string) => void;
  onRestart: () => void;
  showToast: (msg: string) => void;
}

const GamePage: React.FC<GamePageProps> = ({ 
  state, 
  onAddRecord, 
  onUpdateRecord, 
  onRemoveRecord, 
  onRestart,
  showToast,
  onToggleSecret
}) => {
  const secretLength = state.mySecret.length;
  const [digitValues, setDigitValues] = useState<string[]>(Array(secretLength).fill(''));
  const [lockedStates, setLockedStates] = useState<boolean[]>(Array(secretLength).fill(false));
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const fullGuess = digitValues.join('');
  const isInputValid = fullGuess.length === secretLength;

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [state.history.length]);

  const handleDigitChange = (index: number, val: string) => {
    if (lockedStates[index]) return;

    const char = val.replace(/[^0-9]/g, '').slice(-1); 
    const newValues = [...digitValues];
    newValues[index] = char;
    setDigitValues(newValues);

    if (char !== '' && index < secretLength - 1) {
      for (let i = index + 1; i < secretLength; i++) {
        if (!lockedStates[i]) {
          inputRefs.current[i]?.focus();
          break;
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && digitValues[index] === '' && index > 0) {
      for (let i = index - 1; i >= 0; i--) {
        if (!lockedStates[i]) {
          inputRefs.current[i]?.focus();
          break;
        }
      }
    } else if (e.key === 'Enter' && isInputValid) {
      handleAdd();
    }
  };

  const toggleLock = (index: number) => {
    const newLocks = [...lockedStates];
    newLocks[index] = !newLocks[index];
    setLockedStates(newLocks);
  };

  const handleAdd = () => {
    if (!isInputValid) return;

    const isAlreadyGuessed = state.history.some(record => record.guess === fullGuess);
    if (isAlreadyGuessed) {
      showToast("你已猜过此数字");
      return;
    }

    onAddRecord(fullGuess);

    const resetValues = digitValues.map((val, idx) => lockedStates[idx] ? val : '');
    setDigitValues(resetValues);

    const firstEmptyIndex = lockedStates.findIndex(locked => !locked);
    if (firstEmptyIndex !== -1) {
      inputRefs.current[firstEmptyIndex]?.focus();
    }
  };

  const LockIcon = ({ locked }: { locked: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={locked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={locked ? "text-red-500" : "text-gray-300 opacity-60"}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d={locked ? "M7 11V7a5 5 0 0 1 10 0v4" : "M7 11V7a5 5 0 0 1 9.9-1"}></path>
    </svg>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      <div className="flex-none bg-white p-5 pb-2 border-b border-gray-100 shadow-sm z-20">
        <div className="bg-[#f0f4f9] rounded-2xl p-4 mb-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">
              {state.gameMode === 'ai' ? 'Target (AI)' : 'My Secret'}
            </span>
            <div className="flex items-center gap-2">
              <span className="ml-3 font-mono font-bold text-xl text-[#1a73e8] tracking-[4px]">
                {state.gameMode === 'ai' && !state.isSecretVisible ? "****" : state.mySecret}
              </span>
              {state.gameMode === 'ai' && (
                <button 
                  onClick={onToggleSecret}
                  className="p-1 text-[#1a73e8] hover:bg-blue-50 rounded-full transition-colors"
                  title={state.isSecretVisible ? "隐藏" : "显示结果（认输）"}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={state.isSecretVisible ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <button 
            onClick={onRestart}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-blue-100 text-[11px] font-bold text-[#1a73e8] hover:bg-blue-50 transition-colors shadow-sm"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            退出
          </button>
        </div>

        <div className="bg-[#f8fafd] rounded-t-xl grid grid-cols-[1fr_1fr_1.8fr_0.5fr] p-3 text-[10px] uppercase tracking-wider font-bold text-gray-400 border-b border-gray-100">
          <div>猜测内容</div>
          <div>正确数</div>
          <div>辅助笔记</div>
          <div></div>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto bg-white custom-scrollbar"
      >
        {state.history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-3 pt-10">
            <div className="text-5xl opacity-30">{state.gameMode === 'ai' ? '🤖' : '🎯'}</div>
            <div className="italic text-sm font-medium">
              {state.gameMode === 'ai' ? 'AI 已经设好谜底，开始破译吧！' : '还没有任何猜测记录'}
            </div>
          </div>
        ) : (
          <div className="flex flex-col pb-4">
            {state.history.map(record => (
              <RecordItem 
                key={record.id} 
                record={record} 
                onUpdate={(updates) => onUpdateRecord(record.id, updates)}
                onRemove={() => onRemoveRecord(record.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex-none w-full p-5 pt-3 pb-8 bg-white border-t border-gray-100 z-20 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2.5 justify-center w-full">
            {Array.from({ length: secretLength }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => toggleLock(idx)}
                  className={`p-2 mb-1.5 transition-transform active:scale-90 ${lockedStates[idx] ? 'scale-110' : ''}`}
                >
                  <LockIcon locked={lockedStates[idx]} />
                </button>
                <input
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  value={digitValues[idx]}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  disabled={lockedStates[idx]}
                  className={`w-11 h-15 text-center text-2xl font-mono font-bold rounded-[14px] border-2 transition-all outline-none ${
                    lockedStates[idx] 
                    ? 'bg-gray-100 border-gray-200 text-gray-400' 
                    : digitValues[idx] 
                      ? 'border-[#1a73e8] bg-blue-50/50 text-[#1a73e8]' 
                      : 'border-blue-100 bg-[#f0f4f9]/60 focus:border-[#1a73e8] focus:bg-white focus:shadow-sm'
                  }`}
                />
              </div>
            ))}
          </div>

          <button 
            type="button"
            onClick={handleAdd}
            disabled={!isInputValid}
            className={`w-full max-w-[300px] py-4 rounded-[24px] font-bold text-base transition-all ${
              isInputValid 
              ? 'bg-[#1a73e8] text-white active:scale-[0.98] shadow-lg shadow-blue-100 hover:bg-blue-700' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none'
            }`}
          >
            {state.gameMode === 'ai' ? '提交猜测' : '确定'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GamePage;