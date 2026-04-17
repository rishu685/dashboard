'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, Board, CardStatus } from '@/types';

const STORAGE_KEY = 'kanban-board';

export function useBoard() {
  const [board, setBoard] = useState<Board>({
    pending: [],
    'in-progress': [],
    completed: [],
  });
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setBoard(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load board:', error);
      }
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever board changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
    }
  }, [board, loading]);

  const addCard = useCallback(
    (title: string, description: string) => {
      const newCard: Card = {
        id: Date.now().toString(),
        title,
        description,
        status: 'pending',
        createdAt: Date.now(),
      };

      setBoard((prev) => ({
        ...prev,
        pending: [newCard, ...prev.pending],
      }));

      return newCard;
    },
    []
  );

  const updateCard = useCallback(
    (id: string, title: string, description: string) => {
      setBoard((prev) => {
        const updated = { ...prev };
        for (const status in updated) {
          const cardIndex = updated[status as CardStatus].findIndex(
            (c) => c.id === id
          );
          if (cardIndex !== -1) {
            updated[status as CardStatus][cardIndex] = {
              ...updated[status as CardStatus][cardIndex],
              title,
              description,
            };
            break;
          }
        }
        return updated;
      });
    },
    []
  );

  const moveCard = useCallback(
    (id: string, newStatus: CardStatus) => {
      setBoard((prev) => {
        // Find the card to move
        let cardToMove: Card | null = null;
        let fromStatus: CardStatus | null = null;

        for (const status of Object.keys(prev) as CardStatus[]) {
          const found = prev[status].find((c) => c.id === id);
          if (found) {
            cardToMove = found;
            fromStatus = status;
            break;
          }
        }

        if (!cardToMove || !fromStatus) {
          return prev;
        }

        // Create updated board with card moved
        const updated: Board = {
          pending: prev.pending.filter((c) => c.id !== id),
          'in-progress': prev['in-progress'].filter((c) => c.id !== id),
          completed: prev.completed.filter((c) => c.id !== id),
        };

        const movedCard: Card = {
          ...cardToMove,
          status: newStatus,
        };

        updated[newStatus] = [movedCard, ...updated[newStatus]];
        return updated;
      });
    },
    []
  );

  const deleteCard = useCallback((id: string) => {
    setBoard((prev) => {
      const updated = { ...prev };
      for (const status in updated) {
        updated[status as CardStatus] = updated[status as CardStatus].filter(
          (c) => c.id !== id
        );
      }
      return updated;
    });
  }, []);

  return {
    board,
    loading,
    addCard,
    updateCard,
    moveCard,
    deleteCard,
  };
}
