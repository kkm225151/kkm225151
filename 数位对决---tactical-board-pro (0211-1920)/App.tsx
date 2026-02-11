
import React, { useState, useCallback } from 'react';
import { GameState, GameRecord, GameMode } from './types';
import SetupPage from './components/SetupPage';
import GamePage from './components/GamePage';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    mySecret: '',
    gameMode: null,
    isSecretVisible: false,
    history: [],
    isGameStarted: false
  });

  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false
  });

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 2500);
  }, []);

  // 生成指定长度的不重复随机数字
  const generateRandomSecret = (length: number): string => {
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      result += digits.splice(randomIndex, 1)[0];
    }
    return result;
  };

  const startGame = (secret: string, mode: GameMode) => {
    setState({
      mySecret: secret,
      gameMode: mode,
      isSecretVisible: false, // 默认不显示，增加神秘感，除非用户点击
      isGameStarted: true,
      history: []
    });
  };

  // 提供给 SetupPage 的快捷启动 AI 模式
  const startAIMode = (length: number) => {
    const aiSecret = generateRandomSecret(length);
    startGame(aiSecret, 'ai');
  };

  const toggleSecretVisibility = () => {
    setState(prev => ({ ...prev, isSecretVisible: !prev.isSecretVisible }));
  };

  const addRecord = (guess: string) => {
    // 如果是 AI 模式，自动计算正确位数
    let autoCorrectCount = 0;
    if (state.gameMode === 'ai') {
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === state.mySecret[i]) {
          autoCorrectCount++;
        }
      }
    }

    const newRecord: GameRecord = {
      id: Date.now().toString(),
      guess,
      correctCount: autoCorrectCount,
      notes: Array(guess.length).fill('none')
    };

    setState(prev => ({
      ...prev,
      history: [newRecord, ...prev.history]
    }));

    if (state.gameMode === 'ai' && autoCorrectCount === state.mySecret.length) {
      showToast("恭喜！你成功破译了密码！");
    }
  };

  const updateRecord = (id: string, updates: Partial<GameRecord>) => {
    setState(prev => ({
      ...prev,
      history: prev.history.map(r => r.id === id ? { ...r, ...updates } : r)
    }));
  };

  const removeRecord = (id: string) => {
    setState(prev => ({
      ...prev,
      history: prev.history.filter(r => r.id !== id)
    }));
  };

  const restartGame = () => {
    setState({
      mySecret: '',
      gameMode: null,
      isSecretVisible: false,
      history: [],
      isGameStarted: false
    });
  };

  return (
    <div className="h-[100dvh] w-full flex justify-center items-center bg-[#f8fafd] overflow-hidden">
      <div className="w-full max-w-[650px] h-full md:h-[92vh] md:max-h-[1000px] md:rounded-[40px] bg-white shadow-2xl overflow-hidden flex flex-col relative animate-slide-in border border-gray-100">
        {!state.isGameStarted ? (
          <SetupPage onStart={startGame} onStartAI={startAIMode} showToast={showToast} />
        ) : (
          <GamePage 
            state={state} 
            onToggleSecret={toggleSecretVisibility}
            onAddRecord={addRecord}
            onUpdateRecord={updateRecord}
            onRemoveRecord={removeRecord}
            onRestart={restartGame}
            showToast={showToast}
          />
        )}

        <div 
          className={`fixed bottom-28 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 transform ${
            toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <div className="bg-[#1f1f1f] text-white px-8 py-4 rounded-full shadow-2xl text-base font-medium whitespace-nowrap">
            {toast.message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
