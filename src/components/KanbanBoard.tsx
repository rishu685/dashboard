'use client';

import { useState } from 'react';
import { Card as CardType, CardStatus } from '@/types';
import { useBoard } from '@/hooks/useBoard';
import { Column } from './Column';
import { CardModal } from './CardModal';
import { Search } from 'lucide-react';

export function KanbanBoard() {
  const { board, loading, addCard, updateCard, moveCard, deleteCard } =
    useBoard();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeColumn, setActiveColumn] = useState<CardStatus>('pending');

  const handleCreateCard = () => {
    setSelectedCard(null);
    setModalOpen(true);
  };

  const handleEditCard = (card: CardType) => {
    setSelectedCard(card);
    setActiveColumn(card.status);
    setModalOpen(true);
  };

  const handleSaveCard = (title: string, description: string) => {
    if (selectedCard) {
      updateCard(selectedCard.id, title, description);
    } else {
      addCard(title, description);
    }
  };

  const handleMoveCard = (id: string, nextStatus: CardStatus) => {
    moveCard(id, nextStatus);
  };

  const handleDeleteCard = (id: string) => {
    deleteCard(id);
  };

  const filterCards = (cards: CardType[]) => {
    if (!searchQuery.trim()) return cards;
    const query = searchQuery.toLowerCase();
    return cards.filter(
      (card) =>
        card.title.toLowerCase().includes(query) ||
        card.description.toLowerCase().includes(query)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-300 border-t-blue-600 mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto py-12 px-5">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-10 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
            <h1 className="text-6xl font-black text-slate-900 tracking-tight">
              Task Board
            </h1>
          </div>
          <p className="text-lg text-slate-500 font-medium ml-4">Organize and track your workflow with ease</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-10 backdrop-blur-sm hover:shadow-xl transition-shadow">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative group">
              <Search
                size={21}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
              />
              <input
                type="text"
                placeholder="Find a task..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-13 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 font-medium transition-all bg-white hover:border-slate-300"
              />
            </div>
            <button
              onClick={handleCreateCard}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:via-blue-700 hover:to-blue-800 transition-all font-semibold whitespace-nowrap shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
            >
              <span className="text-xl">+</span> New Task
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Column
            title="Pending"
            status="pending"
            cards={filterCards(board.pending)}
            onAddCard={() => {
              setActiveColumn('pending');
              handleCreateCard();
            }}
            onEditCard={handleEditCard}
            onDeleteCard={handleDeleteCard}
            onMoveCard={handleMoveCard}
          />
          <Column
            title="In Progress"
            status="in-progress"
            cards={filterCards(board['in-progress'])}
            onAddCard={() => {
              setActiveColumn('in-progress');
              handleCreateCard();
            }}
            onEditCard={handleEditCard}
            onDeleteCard={handleDeleteCard}
            onMoveCard={handleMoveCard}
          />
          <Column
            title="Completed"
            status="completed"
            cards={filterCards(board.completed)}
            onAddCard={() => {
              setActiveColumn('completed');
              handleCreateCard();
            }}
            onEditCard={handleEditCard}
            onDeleteCard={handleDeleteCard}
            onMoveCard={handleMoveCard}
          />
        </div>
      </div>

      <CardModal
        isOpen={modalOpen}
        card={selectedCard}
        onClose={() => {
          setModalOpen(false);
          setSelectedCard(null);
        }}
        onSave={handleSaveCard}
      />
    </div>
  );
}
