'use client';

import { useState, useEffect } from 'react';
import { Card as CardType } from '@/types';
import { X } from 'lucide-react';

interface CardModalProps {
  isOpen: boolean;
  card: CardType | null;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
}

export function CardModal({ isOpen, card, onClose, onSave }: CardModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description);
    } else {
      setTitle('');
      setDescription('');
    }
    setErrors({});
  }, [card, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: { title?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(title.trim(), description.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-20 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-slate-200 overflow-hidden">
        <div className="flex justify-between items-center p-7 border-b-2 border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50">
          <h2 className="text-2xl font-bold text-slate-900">
            {card ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-all hover:scale-110 active:scale-95"
            title="Close"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-bold text-slate-900 mb-3"
            >
              Task Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({});
              }}
              placeholder="What needs to be done?"
              maxLength={100}
              className={`w-full px-5 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all text-slate-900 placeholder:text-slate-400 font-medium ${
                errors.title
                  ? 'border-red-500 focus:border-red-600 bg-red-50'
                  : 'border-slate-200 focus:border-blue-500 bg-white hover:border-slate-300'
              }`}
              autoFocus
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-3 font-semibold flex items-center gap-1"><span>•</span> {errors.title}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-bold text-slate-900 mb-3"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any details..."
              maxLength={500}
              rows={4}
              className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-500 transition-all resize-none text-slate-900 placeholder:text-slate-400 font-medium bg-white hover:border-slate-300"
            />
            <p className="text-xs text-slate-500 mt-3 font-semibold">
              {description.length}/500 characters
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-slate-700 border-2 border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all font-semibold hover:text-slate-900 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:via-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg hover:shadow-xl active:scale-95"
            >
              {card ? 'Update' : 'Create'} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
