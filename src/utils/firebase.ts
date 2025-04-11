import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, Timestamp, DocumentData } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { User, KudosCard, KPI, Badge, UserBadge } from '../types/models';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

interface FirestoreTimestamp {
  toDate: () => Date;
}

interface FirestoreDoc extends DocumentData {
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

interface FirestoreKPIDoc extends FirestoreDoc {
  startDate: FirestoreTimestamp;
  endDate: FirestoreTimestamp;
}

interface FirestoreUserBadgeDoc extends DocumentData {
  earnedAt: FirestoreTimestamp;
}

// Function to list all users from Firestore
export const listUsers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Firebase Timestamp를 Date로 변환하는 유틸리티 함수
export const convertTimestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

// Firestore 문서를 모델 타입으로 변환하는 유틸리티 함수들
export const convertToUser = (doc: FirestoreDoc & { id: string; email: string; displayName: string; avatarUrl?: string }): User => ({
  id: doc.id,
  email: doc.email,
  displayName: doc.displayName,
  avatarUrl: doc.avatarUrl,
  createdAt: convertTimestampToDate(doc.createdAt as Timestamp),
  updatedAt: convertTimestampToDate(doc.updatedAt as Timestamp),
});

export const convertToKudosCard = (doc: FirestoreDoc & { id: string; senderId: string; receiverId: string; message: string; category: string }): KudosCard => ({
  id: doc.id,
  senderId: doc.senderId,
  receiverId: doc.receiverId,
  message: doc.message,
  category: doc.category,
  createdAt: convertTimestampToDate(doc.createdAt as Timestamp),
  updatedAt: convertTimestampToDate(doc.updatedAt as Timestamp),
});

export const convertToKPI = (doc: FirestoreKPIDoc & { id: string; userId: string; title: string; description: string; target: number; current: number; unit: string }): KPI => ({
  id: doc.id,
  userId: doc.userId,
  title: doc.title,
  description: doc.description,
  target: doc.target,
  current: doc.current,
  unit: doc.unit,
  startDate: convertTimestampToDate(doc.startDate as Timestamp),
  endDate: convertTimestampToDate(doc.endDate as Timestamp),
  createdAt: convertTimestampToDate(doc.createdAt as Timestamp),
  updatedAt: convertTimestampToDate(doc.updatedAt as Timestamp),
});

export const convertToBadge = (doc: FirestoreDoc & { id: string; name: string; description: string; imageUrl: string; criteria: string }): Badge => ({
  id: doc.id,
  name: doc.name,
  description: doc.description,
  imageUrl: doc.imageUrl,
  criteria: doc.criteria,
  createdAt: convertTimestampToDate(doc.createdAt as Timestamp),
  updatedAt: convertTimestampToDate(doc.updatedAt as Timestamp),
});

export const convertToUserBadge = (doc: FirestoreUserBadgeDoc & { id: string; userId: string; badgeId: string }): UserBadge => ({
  id: doc.id,
  userId: doc.userId,
  badgeId: doc.badgeId,
  earnedAt: convertTimestampToDate(doc.earnedAt as Timestamp),
});

export { auth, db, storage, analytics };
export default app; 