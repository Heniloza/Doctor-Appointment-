import { create } from "zustand";
import { axiosInstance } from "../api/api.js";
import toast from "react-hot-toast";

export const useDoctorScheduleStore = create((set, get) => ({
  timeSlots: [],
  scheduleStats: null,
  isLoading: false,
  isCreating: false,

  getScheduleStats: async () => {
    try {
      const res = await axiosInstance.get("/doctor/slots/stats");
      set({ scheduleStats: res.data.data });
    } catch (error) {
      console.error("Failed to fetch schedule stats:", error);
    }
  },

  getTimeSlots: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams();
      if (filters.date) params.append("date", filters.date);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.isAvailable !== undefined)
        params.append("isAvailable", filters.isAvailable);
      if (filters.isBooked !== undefined)
        params.append("isBooked", filters.isBooked);

      const res = await axiosInstance.get(`/doctor/slots?${params}`);
      set({ timeSlots: res.data.data });
    } catch (error) {
      toast.error("Failed to fetch time slots");
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  createTimeSlot: async (slotData) => {
    set({ isCreating: true });
    try {
      const res = await axiosInstance.post("/doctor/slots/create", slotData);
      set((state) => ({
        timeSlots: [...state.timeSlots, res.data.data],
      }));
      toast.success("Time slot created successfully");
      get().getScheduleStats();
      return res.data.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create time slot",
      );
      throw error;
    } finally {
      set({ isCreating: false });
    }
  },

  createBulkTimeSlots: async (bulkData) => {
    set({ isCreating: true });

    try {
      const res = await axiosInstance.post("/doctor/slots/createBulk", bulkData);
      toast.success(res.data.message);
      get().getTimeSlots({ date: bulkData.date });
      get().getScheduleStats();
      return res.data.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create time slots",
      );
      throw error;
    } finally {
      set({ isCreating: false });
    }
  },

  updateTimeSlot: async (slotId, updates) => {
    try {
      const res = await axiosInstance.put(`/doctor/slots/${slotId}`, updates);
      set((state) => ({
        timeSlots: state.timeSlots.map((slot) =>
          slot._id === slotId ? res.data.data : slot,
        ),
      }));
      toast.success("Time slot updated");
      get().getScheduleStats();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update time slot",
      );
    }
  },

  deleteTimeSlot: async (slotId) => {
    try {
      await axiosInstance.delete(`/doctor/slots/${slotId}`);
      set((state) => ({
        timeSlots: state.timeSlots.filter((slot) => slot._id !== slotId),
      }));
      toast.success("Time slot deleted");
      get().getScheduleStats(); 
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete time slot",
      );
    }
  },

  deleteBulkTimeSlots: async (date) => {
    try {
      const res = await axiosInstance.delete("/doctor/slots/bulk/date", {
        data: { date },
      });
      toast.success(res.data.message);
      get().getTimeSlots({ date });
      get().getScheduleStats(); 
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete time slots",
      );
    }
  },
}));
