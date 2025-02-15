export interface Pot {
  _id: string;  // MongoDB's id field
  id?: string;  // Optional alias for client-side compatibility
  name: string;
  category: string;
  balance: number;
  goalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface PotCategory {
  id: string;
  name: string;
  color: string;
}