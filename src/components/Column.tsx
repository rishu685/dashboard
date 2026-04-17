'use client';

import { Card as CardType, CardStatus } from '@/types';
import { Card } from './Card';
import { Plus } from 'lucide-react';

interface ColumnProps {
  title: string;
  status: CardStatus;
  cards: CardType[];
  onAddCard: () => void;
  onEditCard: (card: CardType) => void;
  onDeleteCard: (id: string) => void;
  onMoveCard: (id: string, nextStatus: CardStatus) => void;
}

const statusConfig = {
  pending: { label: 'Pending', nextStatus: 'in-progress' as CardStatus },
  'in-progress': { label: 'In Progress', nextStatus: 'completed' as CardStatus },
  completed: { label: 'Completed', nextStatus: null },
};

export function Column({
  title,
  status,
  cards,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onMoveCard,
}: ColumnProps) {
  const canMove = statusConfig[status].nextStatus !== null;
  const nextStatus = statusConfig[status].nextStatus;

  return (
    <div className="flex flex-col bg-gradient-to-b from-white via-slate-50 to-slate-100 rounded-2xl p-6 min-h-96 border border-slate-200 shadow-md hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-200">
        <div>
          <h2 className="font-bold text-slate-900 text-xl tracking-tight">{title}</h2>
          <p className="text-sm text-slate-500 mt-2 font-semibold">{cards.length} {cards.length === 1 ? 'task' : 'tasks'}</p>
        </div>
        <button
          onClick={onAddCard}
          className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl transition-all hover:text-blue-700 font-bold hover:scale-110 active:scale-95"
          title="Add new task"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {cards.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-slate-400">
            <div className="text-center">
              <p className="text-sm font-semibold">No tasks yet</p>
              <p className="text-xs text-slate-400 mt-1">Click + to add one</p>
            </div>
          </div>
        ) : (
          cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onEdit={onEditCard}
              onDelete={onDeleteCard}
              onMove={
                canMove && nextStatus
                  ? () => onMoveCard(card.id, nextStatus)
                  : () => {}
              }
              canMove={canMove}
            />
          ))
        )}
      </div>
    </div>
  );
}
