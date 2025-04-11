export interface AvatarOptions {
  face: number;
  nose: number;
  mouth: number;
  eyes: number;
  eyebrows: number;
  glasses: number;
  hair: number;
  accessories: number;
  details: number;
  beard: number;
  flip: number;
  color: string;
  shape: string;
}

export interface UserAvatar {
  avatarOptions: AvatarOptions;
  updatedAt: string;
  createdAt: string;
}

export interface UserDocument {
  uid: string;
  email: string;
  displayName: string;
  avatar?: UserAvatar;
  avatarUrl?: string;
  avatarOptions?: AvatarOptions;
  bio?: string;
  role?: string;
  department?: string;
  updatedAt?: string;
  createdAt?: string;
} 