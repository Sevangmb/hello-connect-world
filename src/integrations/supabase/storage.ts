
import { supabase } from './client';

/**
 * Upload a file to Supabase storage
 * @param bucket The storage bucket name
 * @param path The file path inside the bucket
 * @param file The file to upload
 * @returns Object with data and error properties
 */
export const uploadFile = async (bucket: string, path: string, file: File) => {
  try {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });
    
    if (error) throw error;
    
    // Get the public URL
    const publicURL = supabase.storage.from(bucket).getPublicUrl(data.path).data.publicUrl;
    
    return { data: { ...data, publicURL }, error: null };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { data: null, error };
  }
};

/**
 * Delete a file from Supabase storage
 * @param bucket The storage bucket name
 * @param path The file path inside the bucket
 * @returns Object with data and error properties
 */
export const deleteFile = async (bucket: string, path: string) => {
  try {
    const { data, error } = await supabase.storage.from(bucket).remove([path]);
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { data: null, error };
  }
};

/**
 * Get public URL for a file
 * @param bucket The storage bucket name
 * @param path The file path inside the bucket
 * @returns The public URL for the file
 */
export const getPublicUrl = (bucket: string, path: string) => {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
};
