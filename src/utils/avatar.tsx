import { FC } from 'react';

const RPM_API_URL = 'https://api.readyplayer.me/v1';

export const createAvatar = async (avatarUrl: string) => {
  try {
    const response = await fetch(`${RPM_API_URL}/avatars`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: avatarUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create avatar');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating avatar:', error);
    throw error;
  }
};

export const getAvatarUrl = (avatarId: string) => {
  return `${RPM_API_URL}/avatars/${avatarId}/glb`;
};

interface AvatarComponentProps {
  avatarUrl: string;
}

export const AvatarComponent: FC<AvatarComponentProps> = ({ avatarUrl }) => {
  return (
    <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
      <img
        src={avatarUrl}
        alt="Avatar"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
}; 