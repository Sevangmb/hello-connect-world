
-- Création ou mise à jour de la fonction RPC is_admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  -- Vérifier si l'utilisateur est un administrateur
  SELECT p.is_admin INTO is_admin
  FROM public.profiles p
  WHERE p.id = user_id;
  
  -- Si null (profil non trouvé), retourner false
  RETURN COALESCE(is_admin, false);
END;
$$;

-- Accorder des permissions d'exécution sur la fonction
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO service_role;
