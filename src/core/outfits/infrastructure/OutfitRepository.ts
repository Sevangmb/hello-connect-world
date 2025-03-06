
// Fix for lines 361, updating to properly handle the likes increment
// Let's specifically fix the function that has the issue with incrementing likes

async incrementLikes(outfitId: string): Promise<number> {
  try {
    // First get the current likes count
    const { data: outfit, error: getError } = await supabase
      .from('outfits')
      .select('likes_count')
      .eq('id', outfitId)
      .single();
    
    if (getError) throw getError;
    
    const currentLikes = outfit?.likes_count || 0;
    const newLikes = currentLikes + 1;
    
    // Update the likes count
    const { error: updateError } = await supabase
      .from('outfits')
      .update({ likes_count: newLikes })
      .eq('id', outfitId);
    
    if (updateError) throw updateError;
    
    // Call the RPC function to record this interaction
    await supabase.rpc('increment_outfit_likes', { outfit_id: outfitId });
    
    return newLikes;
  } catch (error) {
    console.error('Error incrementing outfit likes:', error);
    return 0;
  }
}
