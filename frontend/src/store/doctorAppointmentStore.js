import { create } from "zustand";
import { axiosInstance } from "../api/api.js";
import toast from "react-hot-toast";

export const useDoctorAppointmentStore = create((set, get) => ({
  appointments: [],
  isLoading: false,

  getDoctorAppointments: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.date) params.append("date", filters.date);

      const res = await axiosInstance.get(`/doctor/appointments?${params}`);
      set({ appointments: res.data.data });
    } catch (error) {
      toast.error("Failed to fetch appointments");
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  getAppointmentById: async (appointmentId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(
        `/doctor/appointments/${appointmentId}`,
      );
      return res.data.data;
    } catch (error) {
      toast.error("Failed to fetch appointment details");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  completeAppointment: async (appointmentId, consultationData) => {
    try {
      const res = await axiosInstance.put(
        `/doctor/appointments/${appointmentId}/complete`,
        consultationData,
      );

      set((state) => ({
        appointments: state.appointments.map((appt) =>
          appt._id === appointmentId ? res.data.data : appt,
        ),
      }));

      toast.success("Consultation completed successfully");
      return res.data.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to complete consultation",
      );
      throw error;
    }
  },

  cancelAppointment: async (appointmentId, reason) => {
    try {
      const res = await axiosInstance.put(
        `/doctor/appointments/${appointmentId}/cancel`,
        { reason },
      );

      set((state) => ({
        appointments: state.appointments.map((appt) =>
          appt._id === appointmentId ? res.data.data : appt,
        ),
      }));

      toast.success("Appointment cancelled");
      return res.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancellation failed");
      throw error;
    }
  },

  updatePrescription: async (appointmentId, prescription) => {
    try {
      const res = await axiosInstance.put(
        `/doctor/appointments/${appointmentId}/prescription`,
        { prescription },
      );

      set((state) => ({
        appointments: state.appointments.map((appt) =>
          appt._id === appointmentId ? res.data.data : appt,
        ),
      }));

      toast.success("Prescription updated");
      return res.data.data;
    } catch (error) {
      toast.error("Failed to update prescription");
      throw error;
    }
  },
}));
