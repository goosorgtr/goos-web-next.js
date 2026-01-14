import { create } from 'zustand'
import { supabase } from '@/lib/supabase/client'
import notificationService from '@/lib/services/notification.service'
import type { Tables } from '@/lib/supabase/types'

type Notification = Tables<'notifications'>

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  
  // Actions
  fetchNotifications: (userId: string) => Promise<void>
  fetchUnreadCount: (userId: string) => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: (userId: string) => Promise<void>
  subscribeToNotifications: (userId: string) => () => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async (userId: string) => {
    set({ loading: true, error: null })
    
    try {
      const result = await notificationService.getByUser(userId, { limit: 50 })
      
      if (result.success && result.data) {
        set({ 
          notifications: result.data,
          loading: false 
        })
      } else {
        set({ 
          error: 'message' in result ? result.message : 'Failed to fetch notifications',
          loading: false 
        })
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false 
      })
    }
  },

  fetchUnreadCount: async (userId: string) => {
    try {
      const result = await notificationService.getUnread(userId)
      
      if (result.data) {
        set({ unreadCount: result.data.length })
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId)
      
      // Update local state
      set(state => ({
        notifications: state.notifications.map(notif =>
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  },

  markAllAsRead: async (userId: string) => {
    try {
      await notificationService.markAllAsRead(userId)
      
      // Update local state
      set(state => ({
        notifications: state.notifications.map(notif => ({
          ...notif,
          isRead: true
        })),
        unreadCount: 0
      }))
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  },

  subscribeToNotifications: (userId: string) => {
    // Subscribe to real-time notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const newNotification = payload.new as Notification
          
          set(state => ({
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1
          }))
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const updatedNotification = payload.new as Notification
          
          set(state => ({
            notifications: state.notifications.map(notif =>
              notif.id === updatedNotification.id ? updatedNotification : notif
            )
          }))
        }
      )
      .subscribe()

    // Return cleanup function
    return () => {
      supabase.removeChannel(channel)
    }
  }
}))

export default useNotificationStore
