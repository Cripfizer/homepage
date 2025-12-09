export interface Icon {
  id?: number;
  title: string;
  type: 'link' | 'folder';
  imageUrl?: string;
  materialIconName?: string;
  imageSize?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
  url?: string;
  parent?: string | null;
  position: number;
  createdAt?: string;
  updatedAt?: string;
  children?: Icon[];
}
