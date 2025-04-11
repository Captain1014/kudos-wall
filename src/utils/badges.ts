import { Badge, KudosCard } from '../types/models';
import { createBadge, getUserBadges } from './firestore';
import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { groupBy, maxBy } from 'lodash';
import { Timestamp } from 'firebase/firestore';

export const BADGE_TYPES = {
  FIRST_KUDOS: {
    name: 'First Kudos',
    description: 'Wrote your first Kudos!',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=first-kudos',
    criteria: 'firstKudos',
  },
  KUDOS_COLLECTOR_10: {
    name: 'Kudos Collector',
    description: 'Received 10 Kudos!',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=kudos-collector',
    criteria: 'kudosReceived10',
  },
  KUDOS_GIVER_10: {
    name: 'Kind Colleague',
    description: 'Wrote 10 Kudos!',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=kudos-giver',
    criteria: 'kudosGiven10',
  },
  WEEKLY_STAR: {
    name: 'Star of the Week',
    description: 'Received the most Kudos this week!',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=weekly-star',
    criteria: 'weeklyMostKudos',
  },
};

export const checkAndAwardBadges = async (userId: string, kudosCards: KudosCard[]) => {
  console.log('[checkAndAwardBadges] Starting badge check for user:', userId);
  console.log('[checkAndAwardBadges] Total kudos cards:', kudosCards.length);
  
  try {
    const existingBadges = await getUserBadges(userId);
    console.log('[checkAndAwardBadges] Existing badges:', existingBadges);

    const newBadges: Badge[] = [];
    const receivedKudos = kudosCards.filter(k => k.receiverId === userId);
    const givenKudos = kudosCards.filter(k => k.senderId === userId);
    
    console.log(`[checkAndAwardBadges] User ${userId} - Received Kudos: ${receivedKudos.length}, Given Kudos: ${givenKudos.length}`);

    // First Kudos 배지 체크
    if (receivedKudos.length > 0 && !existingBadges.some(b => b.name === BADGE_TYPES.FIRST_KUDOS.name)) {
      console.log(`[checkAndAwardBadges] User ${userId} - Checking First Kudos badge (Received: ${receivedKudos.length})`);
      try {
        const badge = await createBadge(BADGE_TYPES.FIRST_KUDOS, userId);
        if (badge) {
          console.log('[checkAndAwardBadges] Awarded First Kudos badge');
          newBadges.push(badge);
        }
      } catch (error) {
        console.error('[checkAndAwardBadges] Error awarding First Kudos badge:', error);
      }
    }

    // Kudos Collector 배지 체크
    if (receivedKudos.length >= 10 && !existingBadges.some(b => b.name === BADGE_TYPES.KUDOS_COLLECTOR_10.name)) {
      console.log(`[checkAndAwardBadges] User ${userId} - Checking Kudos Collector badge (Received: ${receivedKudos.length})`);
      try {
        const badge = await createBadge(BADGE_TYPES.KUDOS_COLLECTOR_10, userId);
        if (badge) {
          console.log('[checkAndAwardBadges] Awarded Kudos Collector badge');
          newBadges.push(badge);
        }
      } catch (error) {
        console.error('[checkAndAwardBadges] Error awarding Kudos Collector badge:', error);
      }
    }

    // Kudos Giver 배지 체크
    if (givenKudos.length >= 10 && !existingBadges.some(b => b.name === BADGE_TYPES.KUDOS_GIVER_10.name)) {
      console.log(`[checkAndAwardBadges] User ${userId} - Checking Kudos Giver badge (Given: ${givenKudos.length})`);
      try {
        const badge = await createBadge(BADGE_TYPES.KUDOS_GIVER_10, userId);
        if (badge) {
          console.log('[checkAndAwardBadges] Awarded Kudos Giver badge');
          newBadges.push(badge);
        }
      } catch (error) {
        console.error('[checkAndAwardBadges] Error awarding Kudos Giver badge:', error);
      }
    }

    // Weekly Star 배지 체크
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);

    const thisWeekKudos = kudosCards.filter(k => {
      if (!(k.createdAt instanceof Timestamp)) {
        console.warn(`[checkAndAwardBadges] Invalid createdAt type for kudo ${k.id}:`, k.createdAt);
        // Date 객체거나 다른 타입일 경우 처리 (예: new Date()로 변환)
        // 여기서는 일단 필터링에서 제외하도록 처리합니다.
        return false;
      }
      const kudoDate = k.createdAt.toDate();
      return isWithinInterval(kudoDate, { start: weekStart, end: weekEnd });
    });

    console.log('[checkAndAwardBadges] This week kudos:', {
      total: thisWeekKudos.length,
      dateRange: `${weekStart.toISOString()} - ${weekEnd.toISOString()}`
    });

    if (thisWeekKudos.length > 0) {
      const kudosByReceiver = groupBy(thisWeekKudos, 'receiverId');
      // Object.entries 결과의 타입을 명시적으로 지정합니다.
      const receiverCounts = Object.entries(kudosByReceiver).map(([id, kudos]: [string, KudosCard[]]) => ({
        id,
        count: kudos.length
      }));
      const topReceiver = maxBy(receiverCounts, 'count');

      console.log('[checkAndAwardBadges] Top receiver this week:', topReceiver);

      if (topReceiver && topReceiver.id === userId && !existingBadges.some(b => b.name === BADGE_TYPES.WEEKLY_STAR.name)) {
        console.log(`[checkAndAwardBadges] User ${userId} - Checking Weekly Star badge (Is top receiver: true)`);
        try {
          const badge = await createBadge(BADGE_TYPES.WEEKLY_STAR, userId);
          if (badge) {
            console.log('[checkAndAwardBadges] Awarded Weekly Star badge');
            newBadges.push(badge);
          }
        } catch (error) {
          console.error('[checkAndAwardBadges] Error awarding Weekly Star badge:', error);
        }
      }
    }

    console.log('[checkAndAwardBadges] Completed badge check. New badges awarded:', newBadges.length);
    return newBadges;
  } catch (error) {
    console.error('[checkAndAwardBadges] Error in badge check:', error);
    return [];
  }
}; 