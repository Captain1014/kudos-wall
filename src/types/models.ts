export interface User {
  id: string;
  email: string;
  displayName: string;
  role?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface KudosCard {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface KPI {
  id: string;
  userId: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  criteria: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Date;
} 