export interface Quote {
  id: string;
  text: string;
  author: string;
  category?: string;
  isFavorite?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  quoteIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  favorite: string;
  border: string;
  error: string;
  success: string;
}
