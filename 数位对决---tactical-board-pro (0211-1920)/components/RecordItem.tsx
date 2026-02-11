
import React from 'react';
import { GameRecord, NoteState } from '../types';

interface RecordItemProps {
  record: GameRecord;
  onUpdate: (updates: Partial<GameRecord>) => void;
  onRemove: () => void;
}

const RecordItem: React.FC<RecordItemProps> = ({ record, onUpdate, onRemove }) => {
  const toggleNote = (index: number) => {
    const states: NoteState[] = ['none', 'correct', 'wrong'];
    const current = record.notes[index];
    const next = states[(states.indexOf(current) + 1) % states.length];
    const newNotes = [...record.notes];
    newNotes[index] = next;
    onUpdate({ notes: newNotes });
  };

  const changeCount = (delta: number) => {
    const newVal = Math.max(0, record.correctCount + delta);
    onUpdate({ correctCount: newVal });
  };

  return (
    <div className="grid grid-cols-[1fr_1fr_1.8fr_0.5fr] items-center p-4 border-b border-[#f1f3f4] hover:bg-gray-50 transition-colors">
      <div className="font-mono font-bold text-lg text-[#1a73e8] tracking-wider">
        {record.guess}
      </div>

      <div className="flex items-center gap-2 bg-white rounded-xl px-2 py-1 shadow-sm border border-gray-100">
        <span className="w-5 text-center font-bold">{record.correctCount}</span>
        <div className="flex flex-col text-[10px]">
          <button onClick={() => changeCount(1)} className="hover:text-blue-600">▲</button>
          <button onClick={() => changeCount(-1)} className="hover:text-red-600">▼</button>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto px-1">
        {record.notes.map((note, idx) => (
          <div
            key={idx}
            onClick={() => toggleNote(idx)}
            className={`
              w-7 h-7 flex items-center justify-center rounded-lg text-xs cursor-pointer border transition-all
              ${note === 'none' ? 'bg-white border-[#c4c7c5] text-[#888]' : ''}
              ${note === 'correct' ? 'bg-[#e6f4ea] border-[#34a853] text-[#137333] font-bold' : ''}
              ${note === 'wrong' ? 'bg-[#fce8e6] border-[#ea4335] text-[#b3261e] line-through' : ''}
            `}
          >
            {note === 'none' ? '·' : note === 'correct' ? '对' : '错'}
          </div>
        ))}
      </div>

      <button 
        onClick={onRemove}
        className="text-[#ea4335] text-xl opacity-40 hover:opacity-100 text-right pr-2"
      >
        ×
      </button>
    </div>
  );
};

export default RecordItem;
