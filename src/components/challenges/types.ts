export type Participant = {
  id: string;
  user_id: string;
  outfit_id: string | null;
  comment: string | null;
  outfits: { name: string } | null;
  profiles: { username: string | null }[];
};

export type Challenge = {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  creator_id: string;
  profiles: { username: string | null };
  participants: Participant[];
  votes: { count: number }[];
};