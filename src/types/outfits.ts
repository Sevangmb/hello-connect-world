
export interface Clothing {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
}

export interface Profile {
  username?: string;
  avatar_url?: string;
}

export interface Hashtag {
  id: string;
  name: string;
}

export interface Outfit {
  id: string;
  name: string;
  description?: string;
  top?: Clothing;
  bottom?: Clothing;
  shoes?: Clothing;
  user?: Profile;
  hashtags?: Hashtag[];
}
