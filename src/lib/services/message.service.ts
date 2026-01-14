import { supabaseApi, QueryOptions } from '@/lib/supabase/api'
import type { TablesInsert } from '@/lib/supabase/types'

export const messageService = {
  async getThreads(userId: string) {
    return await supabaseApi.query('message_threads')
      .select(`
        *,
        participant1:users!message_threads_participant1_id_fkey (*),
        participant2:users!message_threads_participant2_id_fkey (*)
      `)
      .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
      .order('updated_at', { ascending: false })
  },

  async getMessages(threadId: string) {
    return await supabaseApi.query('messages')
      .select(`
        *,
        sender:users (*)
      `)
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true })
  },

  async sendMessage(data: Partial<TablesInsert<'messages'>>) {
    return await supabaseApi.create('messages', data)
  },

  async markAsRead(messageId: string) {
    return await supabaseApi.update('messages', messageId, {
      isRead: true
    })
  }
}

export default messageService
