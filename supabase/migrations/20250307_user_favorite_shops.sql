
-- Create user_favorite_shops table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_favorite_shops (
  user_id UUID REFERENCES auth.users NOT NULL,
  shop_id UUID REFERENCES public.shops NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, shop_id)
);

-- Add RLS policies for user_favorite_shops
ALTER TABLE public.user_favorite_shops ENABLE ROW LEVEL SECURITY;

-- Users can view their own favorite shops
CREATE POLICY "Users can view their own favorite shops"
  ON public.user_favorite_shops
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can add their own favorite shops
CREATE POLICY "Users can add to their own favorite shops"
  ON public.user_favorite_shops
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete from their own favorite shops
CREATE POLICY "Users can delete from their own favorite shops"
  ON public.user_favorite_shops
  FOR DELETE
  USING (auth.uid() = user_id);
