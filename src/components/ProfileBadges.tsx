import React from 'react';
import { Badge as BadgeType } from '../types/models';
import { Badge } from './Badge';

interface ProfileBadgesProps {
  badges: BadgeType[];
}

export const ProfileBadges: React.FC<ProfileBadgesProps> = ({ badges }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">나의 배지</h2>
      <div className="grid grid-cols-4 gap-4">
        {badges.map((badge) => (
          <Badge key={badge.id} badge={badge} size="large" />
        ))}
      </div>
    </div>
  );
}; 