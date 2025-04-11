import React from 'react';
import { Badge as BadgeType } from '../types/models';

interface BadgeProps {
  badge: BadgeType;
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
}

const sizeClasses = {
  small: 'w-8 h-8',
  medium: 'w-12 h-12',
  large: 'w-16 h-16'
};

export const Badge: React.FC<BadgeProps> = ({ 
  badge, 
  size = 'medium',
  showTooltip = true 
}) => {
  return (
    <div className="relative group">
      <img
        src={badge.imageUrl}
        alt={badge.name}
        className={`${sizeClasses[size]} rounded-full`}
      />
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          <p className="font-bold">{badge.name}</p>
          <p className="text-xs">{badge.description}</p>
        </div>
      )}
    </div>
  );
};

export default Badge; 