export type CardStatus = 'pending' | 'in-progress' | 'completed';

export interface Card {
  id: string;
  title: string;
  description: string;
  status: CardStatus;
  createdAt: number;
}

export interface Board {
  pending: Card[];
  'in-progress': Card[];
  completed: Card[];
}
