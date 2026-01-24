import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDoctorAuthStore } from "../store/doctorAuthStore";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  Stethoscope,
  Activity,
  Sun,
  Moon,
  Coffee,
} from "lucide-react";

function DoctorHome() {
  const navigate = useNavigate();
  const { doctor } = useDoctorAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12)
      return {
        text: "Good Morning",
        icon: Sun,
        color: "from-amber-500 to-orange-500",
      };
    if (hour < 17)
      return {
        text: "Good Afternoon",
        icon: Coffee,
        color: "from-blue-500 to-cyan-500",
      };
    return {
      text: "Good Evening",
      icon: Moon,
      color: "from-indigo-500 to-purple-500",
    };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  // TODO: Have to replace with actual data
  const stats = {
    todayAppointments: 12,
    completedToday: 10,
    upcomingToday: 2,
    totalPatients: 156,
    avgRating: 4.8,
  };

  // TODO: Have to replace with actual data
  const todayAppointments = [
    {
      id: 1,
      patient: "John Smith",
      time: "10:00 AM",
      type: "Consultation",
      status: "completed",
      age: 45,
      issue: "Regular checkup",
    },
    {
      id: 2,
      patient: "Sarah Johnson",
      time: "11:30 AM",
      type: "Follow-up",
      status: "completed",
      age: 32,
      issue: "Post-surgery follow-up",
    },
    {
      id: 3,
      patient: "Michael Brown",
      time: "2:00 PM",
      type: "Consultation",
      status: "upcoming",
      age: 28,
      issue: "Fever and headache",
    },
    {
      id: 4,
      patient: "Emily Davis",
      time: "3:30 PM",
      type: "Consultation",
      status: "upcoming",
      age: 55,
      issue: "Blood pressure monitoring",
    },
  ];

  // TODO: Have to replace with actual data
  const recentPatients = [
    {
      id: 1,
      name: "John Smith",
      lastVisit: "2 days ago",
      condition: "Improving",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      lastVisit: "1 week ago",
      condition: "Stable",
    },
    {
      id: 3,
      name: "Michael Brown",
      lastVisit: "3 days ago",
      condition: "Follow-up needed",
    },
  ];

  const upcomingAppointments = todayAppointments.filter(
    (apt) => apt.status === "upcoming",
  );
  const nextAppointment = upcomingAppointments[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-12 h-12 bg-gradient-to-r ${greeting.color} rounded-full flex items-center justify-center shadow-lg`}
            >
              <GreetingIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {greeting.text}, Dr. {doctor?.name?.split(" ").pop()}!
              </h1>
              <p className="text-lg text-gray-600">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                •{" "}
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        {nextAppointment && (
          <div className="mb-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-blue-100 text-sm font-semibold mb-1">
                    Next Appointment
                  </p>
                  <h3 className="text-2xl font-bold">
                    {nextAppointment.patient}
                  </h3>
                  <p className="text-blue-100 mt-1">
                    {nextAppointment.time} • {nextAppointment.issue}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/doctorAppointments")}
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition shadow-lg"
              >
                View Details
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => navigate("/doctorAppointments")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-semibold mb-1">
                  Today's Appointments
                </p>
                <p className="text-4xl font-black">{stats.todayAppointments}</p>
                <p className="text-emerald-100 text-xs mt-1">
                  Patients to see!
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-semibold mb-1">
                  Completed Today
                </p>
                <p className="text-4xl font-black">{stats.completedToday}</p>
                <p className="text-blue-100 text-xs mt-1">progress!</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-semibold mb-1">
                  Remaining Today
                </p>
                <p className="text-4xl font-black">{stats.upcomingToday}</p>
                <p className="text-purple-100 text-xs mt-1">Keep going! </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div
            className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => navigate("/doctorPatients")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-semibold mb-1">
                  Total Patients
                </p>
                <p className="text-4xl font-black">{stats.totalPatients}</p>
                <p className="text-orange-100 text-xs mt-1">Lives touched!</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/doctorSchedule")}
                className="w-full flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">
                    Manage Schedule
                  </span>
                </div>
                <Activity className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
              </button>

              <button
                onClick={() => navigate("/doctorAppointments")}
                className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">
                    View Appointments
                  </span>
                </div>
                <Activity className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
              </button>

              <button
                onClick={() => navigate("/doctorPatients")}
                className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">
                    Patient Records
                  </span>
                </div>
                <Activity className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-600" />
                Today's Schedule
              </h2>
              <button
                onClick={() => navigate("/doctorAppointments")}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-600">
                    Completed
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completedToday}
                </p>
              </div>

              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-semibold text-gray-600">
                    Upcoming
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.upcomingToday}
                </p>
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    apt.status === "completed"
                      ? "bg-gray-50 border-gray-200"
                      : "bg-emerald-50 border-emerald-200 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">
                          {apt.patient}
                        </h3>
                        <span className="text-sm text-gray-500">
                          • {apt.age} years
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{apt.issue}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm text-gray-500">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {apt.time}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          {apt.type}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-bold ${
                          apt.status === "completed"
                            ? "bg-gray-200 text-gray-700"
                            : "bg-emerald-500 text-white"
                        }`}
                      >
                        {apt.status === "completed" ? "✓ Done" : "Next"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Recent Patients
              </h2>
              <button
                onClick={() => navigate("/doctorPatients")}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {recentPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {patient.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {patient.lastVisit}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      patient.condition === "Improving"
                        ? "bg-emerald-100 text-emerald-700"
                        : patient.condition === "Stable"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {patient.condition}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              Today's Progress
            </h2>

            <div className="space-y-6">
              <div className="relative">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-700">
                      Appointments Progress
                    </span>
                    <span className="text-xs px-3 py-1 bg-emerald-500 text-white rounded-full font-bold">
                      {Math.round(
                        (stats.completedToday / stats.todayAppointments) * 100,
                      )}
                      % Complete
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{
                        width: `${(stats.completedToday / stats.todayAppointments) * 100}%`,
                      }}
                    >
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 text-sm">
                    <span className="text-gray-600">
                      <strong className="text-emerald-600">
                        {stats.completedToday}
                      </strong>{" "}
                      of {stats.todayAppointments} completed
                    </span>
                    <span className="text-gray-600">
                      <strong className="text-purple-600">
                        {stats.upcomingToday}
                      </strong>{" "}
                      remaining
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-600">
                      Avg. Time
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">25 min</p>
                  <p className="text-xs text-blue-700 mt-1">Per consultation</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-600">
                      This Week
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">48</p>
                  <p className="text-xs text-purple-700 mt-1">
                    Patients treated
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorHome;
