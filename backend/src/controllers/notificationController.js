import NOTIFICATION from "../models/notificationModel.js";

export const getUserNotifications = async (req, res) => {
  try {
    const { unreadOnly } = req.query;

    const filter = {
      recipientType: "user",
      recipientId: req.user._id,
    };

    if (unreadOnly === "true") {
      filter.isRead = false;
    }

    const notifications = await NOTIFICATION.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await NOTIFICATION.countDocuments({
      recipientType: "user",
      recipientId: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    console.error("Get user notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};

export const getDoctorNotifications = async (req, res) => {
  try {
    const { unreadOnly } = req.query;

    const filter = {
      recipientType: "doctor",
      recipientId: req.doctor._id,
    };

    if (unreadOnly === "true") {
      filter.isRead = false;
    }

    const notifications = await NOTIFICATION.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await NOTIFICATION.countDocuments({
      recipientType: "doctor",
      recipientId: req.doctor._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    console.error("Get doctor notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};

export const getClinicNotifications = async (req, res) => {
  try {
    const { unreadOnly } = req.query;

    const filter = {
      recipientType: "clinic",
      recipientId: req.clinic._id,
    };

    if (unreadOnly === "true") {
      filter.isRead = false;
    }

    const notifications = await NOTIFICATION.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await NOTIFICATION.countDocuments({
      recipientType: "clinic",
      recipientId: req.clinic._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    console.error("Get clinic notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await NOTIFICATION.findByIdAndUpdate(
      req.params.id,
      {
        isRead: true,
        readAt: new Date(),
      },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error("Mark notification read error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating notification",
      error: error.message,
    });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    let filter = { isRead: false };

    if (req.user) {
      filter.recipientType = "user";
      filter.recipientId = req.user._id;
    } else if (req.doctor) {
      filter.recipientType = "doctor";
      filter.recipientId = req.doctor._id;
    } else if (req.clinic) {
      filter.recipientType = "clinic";
      filter.recipientId = req.clinic._id;
    } else {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await NOTIFICATION.updateMany(filter, {
      isRead: true,
      readAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating notifications",
      error: error.message,
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await NOTIFICATION.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting notification",
      error: error.message,
    });
  }
};

export const deleteAllReadNotifications = async (req, res) => {
  try {
    let filter = { isRead: true };

    if (req.user) {
      filter.recipientType = "user";
      filter.recipientId = req.user._id;
    } else if (req.doctor) {
      filter.recipientType = "doctor";
      filter.recipientId = req.doctor._id;
    } else if (req.clinic) {
      filter.recipientType = "clinic";
      filter.recipientId = req.clinic._id;
    } else {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await NOTIFICATION.deleteMany(filter);

    res.status(200).json({
      success: true,
      message: "All read notifications deleted",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Delete read notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting notifications",
      error: error.message,
    });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    let filter = { isRead: false };

    if (req.user) {
      filter.recipientType = "user";
      filter.recipientId = req.user._id;
    } else if (req.doctor) {
      filter.recipientType = "doctor";
      filter.recipientId = req.doctor._id;
    } else if (req.clinic) {
      filter.recipientType = "clinic";
      filter.recipientId = req.clinic._id;
    } else {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const count = await NOTIFICATION.countDocuments(filter);

    res.status(200).json({
      success: true,
      unreadCount: count,
    });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching count",
      error: error.message,
    });
  }
};

