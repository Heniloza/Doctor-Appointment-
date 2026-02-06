import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "./store/notificationStore";
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  Calendar,
  DollarSign,
  Stethoscope,
  Building2,
  Clock,
  Pill,
  User,
  Loader,
} from "lucide-react";

function Notifications({ userType = "user" }) {
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    isLoading,
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllRead,
    getUnreadCount,
  } = useNotificationStore();

  const [showDropdown, setShowDropdown] = useState(false);
  const [filter, setFilter] = useState("all"); 

  useEffect(() => {
    getNotifications(userType);
    getUnreadCount(userType);

    const interval = setInterval(() => {
      getUnreadCount(userType);
    }, 30000);

    return () => clearInterval(interval);
  }, [userType, getNotifications, getUnreadCount]);

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const getIconComponent = (icon) => {
    const icons = {
      calendar: Calendar,
      check: Check,
      x: X,
      bell: Bell,
      pill: Pill,
      dollar: DollarSign,
      user: User,
      stethoscope: Stethoscope,
      building: Building2,
      clock: Clock,
    };
    return icons[icon] || Bell;
  };

  const getNotificationColor = (type) => {
    const colors = {
      clinic_approved: "text-emerald-600 bg-emerald-100",
      clinic_rejected: "text-red-600 bg-red-100",
      appointment_confirmed: "text-emerald-600 bg-emerald-100",
      new_appointment: "text-purple-600 bg-purple-100",
      appointment_cancelled: "text-red-600 bg-red-100",
      appointment_reminder: "text-amber-600 bg-amber-100",
      prescription_ready: "text-teal-600 bg-teal-100",
      payment_success: "text-green-600 bg-green-100",
      doctor_approved: "text-emerald-600 bg-emerald-100",
      general: "text-gray-600 bg-gray-100",
    };
    return colors[type] || "text-gray-600 bg-gray-100";
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return notificationDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    if (notification.link) {
      navigate(notification.link);
      setShowDropdown(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead(userType);
  };

  const handleDelete = async (e, notificationId) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  const handleClearAllRead = async () => {
    await clearAllRead(userType);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        title="Notifications"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />

          <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-teal-600" />
                  Notifications
                </h3>
                <button
                  onClick={() => setShowDropdown(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    filter === "all"
                      ? "bg-teal-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    filter === "unread"
                      ? "bg-teal-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-b border-gray-200 flex gap-2 bg-gray-50">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors text-sm font-semibold"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Mark all read
                  </button>
                )}
                {notifications.some((n) => n.isRead) && (
                  <button
                    onClick={handleClearAllRead}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear read
                  </button>
                )}
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {isLoading && notifications.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 text-teal-600 animate-spin" />
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-center font-medium">
                    {filter === "unread"
                      ? "No unread notifications"
                      : "No notifications yet"}
                  </p>
                  <p className="text-gray-400 text-sm text-center mt-1">
                    {filter === "unread"
                      ? "You're all caught up!"
                      : "We'll notify you when something happens"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notification) => {
                    const IconComponent = getIconComponent(notification.icon);
                    const colorClass = getNotificationColor(notification.type);

                    return (
                      <div
                        key={notification._id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer group ${
                          !notification.isRead ? "bg-teal-50/30" : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                                {notification.title}
                              </h4>
                              {!notification.isRead && (
                                <span className="w-2 h-2 bg-teal-600 rounded-full flex-shrink-0 mt-1.5" />
                              )}
                            </div>

                            <p className="text-sm text-gray-600 mb-2 line-clamp-2 leading-relaxed">
                              {notification.message}
                            </p>

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 font-medium">
                                {formatTimeAgo(notification.createdAt)}
                              </span>

                              <button
                                onClick={(e) =>
                                  handleDelete(e, notification._id)
                                }
                                className="p-1.5 hover:bg-red-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete notification"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {filteredNotifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
                  Showing {filteredNotifications.length} of{" "}
                  {notifications.length} notifications
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Notifications;
