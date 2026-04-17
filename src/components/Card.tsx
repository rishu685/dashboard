'use client';

import { Card as CardType } from '@/types';
import { Trash2, Edit2, ChevronRight } from 'lucide-react';

interface CardProps {
  card: CardType;
  onEdit: (card: CardType) => void;
  onDelete: (id: string) => void;
  onMove: (id: string) => void;
  canMove: boolean;
}

export function Card({
  card,
  onEdit,
  onDelete,
  onMove,
  canMove,
}: CardProps) {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this card?')) {
      onDelete(card.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200 hover:shadow-xl hover:border-slate-300 transition-all duration-300 group hover:-translate-y-1 cursor-grab active:cursor-grabbing">
      <h3 className="font-bold text-slate-900 mb-3 line-clamp-2 text-sm leading-snug">
        {card.title}
      </h3>
      <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
        {card.description || <span className="text-slate-400 italic text-xs">No description</span>}
      </p>

      <div className="flex gap-2 justify-between items-center">
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(card)}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:scale-110 active:scale-95"
            title="Edit task"
          >
            <Edit2 size={17} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-110 active:scale-95"
            title="Delete task"
          >
            <Trash2 size={17} />
          </button>
        </div>

        {canMove && (
          <button
            onClick={() => onMove(card.id)}
            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all ml-auto font-bold hover:scale-110 active:scale-95"
            title="Move to next status"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
