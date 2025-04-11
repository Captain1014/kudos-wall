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
  svgData?: string;
  updatedAt: string;
  createdAt: string;
} 