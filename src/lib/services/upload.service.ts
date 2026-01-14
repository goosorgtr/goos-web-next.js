import { supabase } from '@/lib/supabase/client'

export const uploadService = {
  /**
   * Upload file to Supabase Storage
   */
  async uploadFile(bucket: string, path: string, file: File) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        return { success: false, message: error.message }
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)

      return {
        success: true,
        data: {
          path: data.path,
          url: urlData.publicUrl
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Upload failed'
      }
    }
  },

  /**
   * Delete file from storage
   */
  async deleteFile(bucket: string, path: string) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])

      if (error) {
        return { success: false, message: error.message }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Delete failed'
      }
    }
  },

  /**
   * Get file URL
   */
  getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return data.publicUrl
  }
}

export default uploadService
