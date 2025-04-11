import React from 'react';
import { Badge as BadgeType } from '../types/models';
import { Badge } from './Badge';

interface DashboardBadgesProps {
  badges: BadgeType[];
}

export const DashboardBadges: React.FC<DashboardBadgesProps> = ({ badges }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">최근 획득한 배지</h2>
      <div className="flex flex-wrap gap-4">
        {badges.slice(0, 4).map((badge) => (
          <Badge key={badge.id} badge={badge} size="medium" />
        ))}
      </div>
      {badges.length > 4 && (
        <p className="text-sm text-gray-500 mt-2">
          +{badges.length - 4}개의 배지 더 보기
        </p>
      )}
    </div>
  );
}; 