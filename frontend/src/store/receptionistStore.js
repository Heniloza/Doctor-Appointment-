import { create } from "zustand";
import { axiosInstance } from "../api/api.js";
import toast from "react-hot-toast";

export const useReceptionistStore = create((set) => ({
  receptionist: null,
  isReceptionistAuthenticated: false,
  isLoading: false,

  login: async (email, password) => {
    try {
      const res = await axiosInstance.post("/receptionist/login", {
        email,
        password,
      });

      if (res.data.success) {
        set({ receptionist: res.data.data, isReceptionistAuthenticated: true });
        toast.success("Login successful");
        return { success: true };
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, message };
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/receptionist/logout");
      set({ receptionist: null, isReceptionistAuthenticated: false });
      toast.success("Logout successful");
    } catch (error) {
      toast.error("Logout failed");
    }
  },

  checkReceptionistAuth: async () => {
    try {
      const res = await axiosInstance.get("/receptionist/check-auth");
      if (res.data.success) {
        set({ receptionist: res.data.data, isReceptionistAuthenticated: true });
      }
    } catch (error) {
      set({ receptionist: null, isReceptionistAuthenticated: false });
    }
  },

  updateProfile: async (profileData) => {
    try {
      const res = await axiosInstance.put("/receptionist/profile", profileData);
      if (res.data.success) {
        set({ receptionist: res.data.data });
        toast.success("Profile updated successfully");
        return { success: true };
      }
    } catch (error) {
      toast.error("Failed to update profile");
      return { success: false };
    }
  },

  getAppointments: async (filters = {}) => {
    try {
      set({ isLoading: true });
      const params = new URLSearchParams(filters).toString();
      const res = await axiosInstance.get(
        `/receptionist/appointments/all?${params}`,
      );
      set({ isLoading: false });
      return res.data;
    } catch (error) {
      set({ isLoading: false });
      toast.error("Failed to fetch appointments");
      return { success: false, data: [] };
    }
  },

  getTodayAppointments: async () => {
    try {
      const res = await axiosInstance.get("/receptionist/appointments/today");
      return res.data;
    } catch (error) {
      toast.error("Failed to fetch today's appointments");
      return { success: false, data: [] };
    }
  },

  getAppointmentStats: async () => {
    try {
      const res = await axiosInstance.get("/receptionist/appointments/stats");
      return res.data;
    } catch (error) {
      return { success: false, data: {} };
    }
  },

  updateAppointmentStatus: async (appointmentId, status) => {
    try {
      const res = await axiosInstance.put(
        `/receptionist/appointments/${appointmentId}/status`,
        { status },
      );
      if (res.data.success) {
        toast.success("Appointment status updated");
        return { success: true, data: res.data.data };
      }
    } catch (error) {
      toast.error("Failed to update appointment status");
      return { success: false };
    }
  },

  searchPatients: async (searchQuery) => {
    try {
      const res = await axiosInstance.get(
        `/receptionist/appointments/search-patients?search=${searchQuery}`,
      );
      return res.data;
    } catch (error) {
      return { success: false, data: [] };
    }
  },
}));

export const useDoctorReceptionistStore = create((set) => ({
  receptionist: null,
  isLoading: false,

  createReceptionist: async (receptionistData) => {
    try {
      const res = await axiosInstance.post(
        "/doctor/receptionist/create",
        receptionistData,
      );
      if (res.data.success) {
        set({ receptionist: res.data.data });
        toast.success("Receptionist created successfully");
        return { success: true, data: res.data.data };
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to create receptionist";
      toast.error(message);
      return { success: false, message };
    }
  },

  getReceptionist: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(
        "/doctor/receptionist/my-receptionist",
      );
      set({ isLoading: false });
      if (res.data.success) {
        set({ receptionist: res.data.data });
        return { success: true, data: res.data.data };
      }
      return { success: false };
    } catch (error) {
      set({ isLoading: false, receptionist: null });
      return { success: false };
    }
  },

  deleteReceptionist: async () => {
    try {
      const res = await axiosInstance.delete("/doctor/receptionist/delete");
      if (res.data.success) {
        set({ receptionist: null });
        toast.success("Receptionist deleted successfully");
        return { success: true };
      }
    } catch (error) {
      toast.error("Failed to delete receptionist");
      return { success: false };
    }
  },

  toggleReceptionistStatus: async () => {
    try {
      const res = await axiosInstance.put("/doctor/receptionist/toggle-status");
      if (res.data.success) {
        set((state) => ({
          receptionist: {
            ...state.receptionist,
            isActive: res.data.data.isActive,
          },
        }));
        toast.success(res.data.message);
        return { success: true };
      }
    } catch (error) {
      toast.error("Failed to toggle status");
      return { success: false };
    }
  },
}));
