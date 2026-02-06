import cron from "node-cron";
import APPOINTMENT from "../models/appointmentModel.js";
import {
  notifyAppointmentReminder,
  sendCustomNotification,
} from "./notificationHelper.js";

const isAppointmentIn30Minutes = (appointmentDate, startTime) => {
  try {
    const now = new Date();

    const [time, period] = startTime.includes(" ")
      ? startTime.split(" ")
      : [startTime, null];
    const [hours, minutes] = time.split(":").map(Number);

    let appointmentHours = hours;

    if (period) {
      const isPM = period.toUpperCase() === "PM";
      const isAM = period.toUpperCase() === "AM";

      if (isPM && hours !== 12) {
        appointmentHours = hours + 12;
      } else if (isAM && hours === 12) {
        appointmentHours = 0;
      }
    }

    const appointmentTime = new Date(appointmentDate);
    appointmentTime.setHours(appointmentHours, minutes, 0, 0);

    const diffInMinutes = (appointmentTime - now) / (1000 * 60);

    const isIn30Min = diffInMinutes >= 29 && diffInMinutes <= 31;

    if (isIn30Min) {
      console.log(
        `Appointment in 30 minutes: ${appointmentTime.toLocaleTimeString()}`,
      );
    }

    return isIn30Min;
  } catch (error) {
    console.error("Error parsing appointment time:", error);
    return false;
  }
};

export const start30MinuteReminderCron = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const endOfToday = new Date(today);
      endOfToday.setHours(23, 59, 59, 999);

      const appointments = await APPOINTMENT.find({
        appointmentDate: {
          $gte: today,
          $lte: endOfToday,
        },
        status: { $in: ["confirmed", "pending"] },
      })
        .populate("userId", "name email phone fcmToken")
        .populate("doctorId", "name specialization")
        .populate("clinicId", "clinicName");

      if (!appointments || appointments.length === 0) {
        return; 
      }

      const appointmentsToRemind = appointments.filter((apt) =>
        isAppointmentIn30Minutes(apt.appointmentDate, apt.startTime),
      );

      if (appointmentsToRemind.length === 0) {
        return; 
      }

      for (const appointment of appointmentsToRemind) {
        try {
          await notifyAppointmentReminder(appointment);
          console.log(
            `Sent 30-min reminder for appointment ${appointment._id}`,
          );
        } catch (error) {
          console.error(
            `Failed to send reminder for ${appointment._id}:`,
            error,
          );
        }
      }

      console.log(
        `Sent ${appointmentsToRemind.length} appointment reminders`,
      );
    } catch (error) {
      console.error("Error in 30-minute reminder cron:", error);
    }
  });

  console.log("30-minute reminder cron job started (runs every minute)");
};

export const start24HourReminderCron = () => {
  cron.schedule("0 9 * * *", async () => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const endOfTomorrow = new Date(tomorrow);
      endOfTomorrow.setHours(23, 59, 59, 999);

      const appointments = await APPOINTMENT.find({
        appointmentDate: {
          $gte: tomorrow,
          $lte: endOfTomorrow,
        },
        status: { $in: ["confirmed", "pending"] },
      })
        .populate("userId", "name email phone fcmToken")
        .populate("doctorId", "name specialization")
        .populate("clinicId", "clinicName");

      if (!appointments || appointments.length === 0) {
        console.log("No appointments tomorrow");
        return;
      }

      for (const appointment of appointments) {
        try {
          await sendCustomNotification({
            recipientType: "user",
            recipientId: appointment.userId._id,
            title: "Appointment Tomorrow",
            message: `Reminder: You have an appointment with Dr. ${appointment.doctorId.name} tomorrow at ${appointment.startTime}.`,
            type: "appointment_reminder",
            icon: "clock",
            link: "/userAppointments",
            data: {
              appointmentId: appointment._id.toString(),
              reminderType: "24hours",
              doctorName: appointment.doctorId.name,
              time: appointment.startTime,
              date: appointment.appointmentDate.toLocaleDateString(),
            },
          });

          console.log(
            `Sent 24h reminder for appointment ${appointment._id}`,
          );
        } catch (error) {
          console.error(
            `Failed to send 24h reminder for ${appointment._id}:`,
            error,
          );
        }
      }

      console.log(`Sent ${appointments.length} 24-hour reminders`);
    } catch (error) {
      console.error("Error in 24-hour reminder cron:", error);
    }
  });

  console.log("24-hour reminder cron job started (runs daily at 9 AM)");
};

export const startAllReminderCrons = () => {
  start30MinuteReminderCron();
  start24HourReminderCron();
  console.log("All reminder cron jobs initialized");
};
