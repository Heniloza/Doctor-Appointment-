import React, { useEffect, useState } from "react";
import { useReceptionistStore } from "../../store/receptionistStore";
import {
  Calendar,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  LogOut,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function ReceptionistDashboard() {
  const {
    receptionist,
    getAppointmentStats,
    getTodayAppointments,
    logout,
    updateAppointmentStatus,
  } = useReceptionistStore();
  const [stats, setStats] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const [statsRes, appointmentsRes] = await Promise.all([
      getAppointmentStats(),
      getTodayAppointments(),
    ]);

    if (statsRes.success) {
      setStats(statsRes.data);
    }

    if (appointmentsRes.success) {
      setTodayAppointments(appointmentsRes.data);
    }

    setIsLoading(false);
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
      navigate("/receptionistLogin");
    }
  };

  const handleMarkComplete = async (appointmentId) => {
    if (window.confirm("Mark this appointment as completed?")) {
      setUpdatingStatus(appointmentId);
      const result = await updateAppointmentStatus(appointmentId, "completed");

      if (result.success) {
        await fetchData();
      }
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, {receptionist?.name}
            </h1>
            <p className="text-gray-600">
              Managing appointments for {receptionist?.doctorId?.name}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.totalToday || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Today</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.confirmed || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Confirmed</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.completed || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Completed</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.pending || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Pending</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.cancelled || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Cancelled</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Today's Appointments
            </h2>
          </div>

          {todayAppointments.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No appointments today</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="p-6 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={appointment.userId?.profilePicture}
                        alt=""
                        className="size-10 bg-teal-100 rounded-full bg-cover flex items-center justify-center"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {appointment.userId?.name || "Unknown Patient"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {appointment.userId?.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.startTime} - {appointment.endTime}
                        </p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(appointment.status)}`}
                        >
                          {appointment.status}
                        </span>
                      </div>

                      {(appointment.status === "confirmed" ||
                        appointment.status === "pending") && (
                        <button
                          onClick={() => handleMarkComplete(appointment._id)}
                          disabled={updatingStatus === appointment._id}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updatingStatus === appointment._id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span className="text-sm">Updating...</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              <span className="text-sm">Mark Complete</span>
                            </>
                          )}
                        </button>
                      )}

                      {appointment.status === "completed" && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                      )}

                      {appointment.status === "cancelled" && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg">
                          <XCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Cancelled</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReceptionistDashboard;
