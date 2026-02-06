import { create } from "zustand";
import toast from "react-hot-toast";
import {axiosInstance} from "../api/api"

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  getNotifications: async (userType) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/notifications/${userType}`);
      set({
        notifications: res.data.data || [],
        unreadCount: res.data.unreadCount || 0,
      });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      set({ isLoading: false });
    }
  },

  getUnreadCount: async (userType) => {
    try {
      const res = await axiosInstance.get(
        `/notifications/${userType}/unread-count`,
      );
      set({ unreadCount: res.data.unreadCount || 0 });
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  },

  markAsRead: async (notificationId) => {
    try {
      await axiosInstance.put(`/notifications/${notificationId}/read`);

      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === notificationId
            ? { ...n, isRead: true, readAt: new Date() }
            : n,
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  },

  markAllAsRead: async (userType) => {
    try {
      await axiosInstance.put(`/notifications/${userType}/mark-all-read`);

      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          isRead: true,
          readAt: new Date(),
        })),
        unreadCount: 0,
      }));

      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all as read");
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      await axiosInstance.delete(`/notifications/${notificationId}`);

      set((state) => {
        const notification = state.notifications.find(
          (n) => n._id === notificationId,
        );
        const wasUnread = notification && !notification.isRead;

        return {
          notifications: state.notifications.filter(
            (n) => n._id !== notificationId,
          ),
          unreadCount: wasUnread
            ? Math.max(0, state.unreadCount - 1)
            : state.unreadCount,
        };
      });

      toast.success("Notification deleted");
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error("Failed to delete notification");
    }
  },

  clearAllRead: async (userType) => {
    try {
      await axiosInstance.delete(`/notifications/${userType}/clear-read`);

      set((state) => ({
        notifications: state.notifications.filter((n) => !n.isRead),
      }));

      toast.success("Read notifications cleared");
    } catch (error) {
      console.error("Failed to clear notifications:", error);
      toast.error("Failed to clear notifications");
    }
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  resetStore: () => {
    set({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
    });
  },
}));
