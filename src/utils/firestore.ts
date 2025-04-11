import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { User, KudosCard, KPI, Badge, UserBadge } from '../types/models';

// User 관련 함수
export const createUser = async (userId: string, userData: Partial<User>) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, userData);
};

export const getUser = async (userId: string): Promise<User | null> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? userDoc.data() as User : null;
};

export const updateUser = async (userId: string, userData: Partial<User>) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, userData);
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    console.log('Getting user by ID:', userId);
    const userDoc = await getDoc(doc(db, 'users', userId));
    console.log('User document exists:', userDoc.exists());
    
    if (!userDoc.exists()) {
      return null;
    }
    
    const userData = userDoc.data();
    console.log('User data:', userData);
    
    return {
      id: userDoc.id,
      email: userData.email || '',
      displayName: userData.displayName || '',
      avatarUrl: userData.avatarUrl || null,
      role: userData.role || null,
      createdAt: userData.createdAt?.toDate?.() || new Date(),
      updatedAt: userData.updatedAt?.toDate?.() || new Date(),
    };
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// KudosCard 관련 함수
export const createKudosCard = async (kudosData: Omit<KudosCard, 'id' | 'createdAt' | 'updatedAt'>) => {
  const kudosRef = await addDoc(collection(db, 'kudosCards'), {
    ...kudosData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return kudosRef.id;
};

export const getUserKudosCards = async (userId: string, filterBy: 'receiverId' | 'senderId' = 'receiverId') => {
  try {
    const q = query(
      collection(db, 'kudosCards'),
      where(filterBy, '==', userId)
      // orderBy('createdAt', 'desc') // 인덱스 없이 동작하도록 주석 처리
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
    })) as KudosCard[];
  } catch (error) {
    console.error(`Error getting kudos cards for user ${userId}:`, error);
    return []; // 에러 발생 시 빈 배열 반환
  }
};

export const getAllKudosCards = async (): Promise<KudosCard[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'kudosCards'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
    })) as KudosCard[];
  } catch (error) {
    console.error('Error getting all kudos cards:', error);
    return [];
  }
};

// KPI 관련 함수
export const createKPI = async (kpiData: Omit<KPI, 'id' | 'createdAt' | 'updatedAt'>) => {
  const kpiRef = collection(db, 'kpis');
  const now = new Date();
  
  const kpiToSave = {
    ...kpiData,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(kpiRef, kpiToSave);
  return { id: docRef.id, ...kpiToSave };
};

export const getUserKPIs = async (userId: string): Promise<KPI[]> => {
  const kpisRef = collection(db, 'kpis');
  const q = query(kpisRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      startDate: data.startDate?.toDate?.() || new Date(),
      endDate: data.endDate?.toDate?.() || new Date(),
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
    };
  }) as KPI[];
};

export const updateKPI = async (kpiId: string, data: Partial<KPI>): Promise<KPI> => {
  try {
    const kpiRef = doc(db, 'kpis', kpiId);
    await updateDoc(kpiRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    const updatedDoc = await getDoc(kpiRef);
    if (!updatedDoc.exists()) {
      throw new Error('KPI not found');
    }

    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
      startDate: updatedDoc.data().startDate?.toDate(),
      endDate: updatedDoc.data().endDate?.toDate(),
    } as KPI;
  } catch (error) {
    console.error('Error updating KPI:', error);
    throw error;
  }
};

export const deleteKPI = async (kpiId: string): Promise<void> => {
  try {
    const kpiRef = doc(db, 'kpis', kpiId);
    await deleteDoc(kpiRef);
  } catch (error) {
    console.error('Error deleting KPI:', error);
    throw error;
  }
};

// Badge 관련 함수
export const createBadge = async (badgeData: Omit<Badge, 'id' | 'createdAt' | 'updatedAt'>, userId: string) => {
  try {
    console.log('[createBadge] Starting badge creation for user:', userId);
    console.log('[createBadge] Badge data:', badgeData);

    // Check if badge already exists
    const existingBadgesQuery = query(
      collection(db, 'badges'),
      where('name', '==', badgeData.name),
      where('criteria', '==', badgeData.criteria)
    );
    const existingBadges = await getDocs(existingBadgesQuery);
    let badgeId;

    if (!existingBadges.empty) {
      // Use existing badge
      badgeId = existingBadges.docs[0].id;
      console.log('[createBadge] Using existing badge:', badgeId);
    } else {
      // Create new badge
      const badgeRef = await addDoc(collection(db, 'badges'), {
        ...badgeData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      badgeId = badgeRef.id;
      console.log('[createBadge] Created new badge:', badgeId);
    }

    // Check if user already has this badge
    const existingUserBadgeQuery = query(
      collection(db, 'userBadges'),
      where('userId', '==', userId),
      where('badgeId', '==', badgeId)
    );
    const existingUserBadges = await getDocs(existingUserBadgeQuery);

    if (!existingUserBadges.empty) {
      console.log('[createBadge] User already has this badge');
      const badgeDoc = await getDoc(doc(db, 'badges', badgeId));
      return { id: badgeId, ...badgeDoc.data() } as Badge;
    }

    // Create new userBadge
    const userBadgeRef = await addDoc(collection(db, 'userBadges'), {
      userId,
      badgeId,
      earnedAt: Timestamp.now(),
    });
    console.log('[createBadge] Created new userBadge:', userBadgeRef.id);

    // Return badge data
    const badgeDoc = await getDoc(doc(db, 'badges', badgeId));
    const badge = { id: badgeId, ...badgeDoc.data() } as Badge;
    console.log('[createBadge] Returning badge:', badge);
    return badge;
  } catch (error) {
    console.error('[createBadge] Error creating badge:', error);
    throw error;
  }
};

export const getUserBadges = async (userId: string) => {
  try {
    console.log('[getUserBadges] Fetching badges for user:', userId);
    
    const q = query(
      collection(db, 'userBadges'),
      where('userId', '==', userId),
      orderBy('earnedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    console.log('[getUserBadges] Found userBadges:', querySnapshot.docs.length);
    
    const userBadges = querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as UserBadge[];
    console.log('[getUserBadges] UserBadges data:', userBadges);
    
    const badgePromises = userBadges.map(async (userBadge) => {
      console.log('[getUserBadges] Fetching badge details for:', userBadge.badgeId);
      const badgeDoc = await getDoc(doc(db, 'badges', userBadge.badgeId));
      if (!badgeDoc.exists()) {
        console.log('[getUserBadges] Badge not found:', userBadge.badgeId);
        return null;
      }
      return { ...badgeDoc.data(), id: badgeDoc.id } as Badge;
    });
    
    const badges = (await Promise.all(badgePromises)).filter((badge): badge is Badge => badge !== null);
    console.log('[getUserBadges] Final badges:', badges);
    return badges;
  } catch (error) {
    console.error('[getUserBadges] Error getting user badges:', error);
    throw error;
  }
};

// 팀원 데이터를 가져오는 함수
export const getTeamMembers = async (): Promise<User[]> => {
  const usersRef = collection(db, 'users');
  const querySnapshot = await getDocs(usersRef);
  
  const users = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      email: data.email || '',
      displayName: data.displayName || '',
      role: data.role || '',
      avatarUrl: data.avatarUrl || null,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
    };
  });
  
  return users;
}; 