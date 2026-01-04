
export enum Category {
  FOOD = 'Food',
  RENT = 'Rent',
  TRANSPORT = 'Transport',
  ENTERTAINMENT = 'Entertainment',
  INCOME = 'Income',
  OTHER = 'Other'
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: Category;
  amount: number;
  type: 'income' | 'expense';
}

export interface Budget {
  category: Category;
  limit: number;
  spent: number;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  icon: string;
}

export interface User {
  name: string;
  email: string;
  isPremium: boolean;
  avatar: string;
}
