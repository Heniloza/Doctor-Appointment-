import React, { useEffect, useState } from "react";
import { useAdminStore } from "../store/adminStore";
import {
  Search,
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  DollarSign,
  Building2,
  MapPin,
  Loader,
  Award,
  Heart,
  Stethoscope,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
} from "lucide-react";

function Doctors() {
  const { doctors, fetchAllDoctors, isLoading } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, inactive
  const [filterClinic, setFilterClinic] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchAllDoctors();
  }, [fetchAllDoctors]);

  // Get unique clinics for filter
  const uniqueClinics = [
    ...new Set(doctors.map((d) => d.clinicId?.clinicName).filter(Boolean)),
  ];

  // Filter doctors
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.clinicId?.clinicName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && doctor.isActive) ||
      (filterStatus === "inactive" && !doctor.isActive);

    const matchesClinic =
      filterClinic === "all" || doctor.clinicId?.clinicName === filterClinic;

    return matchesSearch && matchesStatus && matchesClinic;
  });

  const activeDoctors = doctors.filter((d) => d.isActive).length;
  const totalSpecializations = [
    ...new Set(doctors.map((d) => d.specialization)),
  ].length;

  const handleView = (doctor) => {
    setSelectedDoctor(doctor);
    setShowViewModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
            <Stethoscope className="w-10 h-10 text-purple-600" />
            All Doctors
          </h1>
          <p className="text-lg text-gray-600">
            Managing healthcare professionals across all clinics 🏥
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-semibold mb-1">
                  Total Doctors
                </p>
                <p className="text-4xl font-black">{doctors.length}</p>
                <p className="text-purple-100 text-xs mt-1">Registered</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-semibold mb-1">
                  Active Doctors
                </p>
                <p className="text-4xl font-black">{activeDoctors}</p>
                <p className="text-emerald-100 text-xs mt-1">
                  Currently active
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-semibold mb-1">
                  Specializations
                </p>
                <p className="text-4xl font-black">{totalSpecializations}</p>
                <p className="text-blue-100 text-xs mt-1">Different fields</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-semibold mb-1">
                  Clinics
                </p>
                <p className="text-4xl font-black">{uniqueClinics.length}</p>
                <p className="text-orange-100 text-xs mt-1">With doctors</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header with Filters */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Award className="w-6 h-6" />
                Doctor Directory
              </h2>

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by name, email, specialization, or clinic..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:border-white focus:bg-white/30 transition-all text-lg"
                  />
                  <Search className="w-5 h-5 text-white/70 absolute left-4 top-1/2 transform -translate-y-1/2" />
                </div>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 rounded-xl border-2 border-white/30 bg-white/20 text-white font-semibold focus:outline-none focus:border-white cursor-pointer"
                >
                  <option value="all" className="text-gray-900">
                    All Status
                  </option>
                  <option value="active" className="text-gray-900">
                    Active Only
                  </option>
                  <option value="inactive" className="text-gray-900">
                    Inactive Only
                  </option>
                </select>

                {/* Clinic Filter */}
                <select
                  value={filterClinic}
                  onChange={(e) => setFilterClinic(e.target.value)}
                  className="px-4 py-3 rounded-xl border-2 border-white/30 bg-white/20 text-white font-semibold focus:outline-none focus:border-white cursor-pointer"
                >
                  <option value="all" className="text-gray-900">
                    All Clinics
                  </option>
                  {uniqueClinics.map((clinic) => (
                    <option
                      key={clinic}
                      value={clinic}
                      className="text-gray-900"
                    >
                      {clinic}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Filters Display */}
              {(searchTerm ||
                filterStatus !== "all" ||
                filterClinic !== "all") && (
                <div className="flex items-center gap-2 text-sm text-white">
                  <Filter className="w-4 h-4" />
                  <span>
                    Showing {filteredDoctors.length} of {doctors.length} doctors
                  </span>
                  {(filterStatus !== "all" ||
                    filterClinic !== "all" ||
                    searchTerm !== "") && (
                    <button
                      onClick={() => {
                        setFilterStatus("all");
                        setFilterClinic("all");
                        setSearchTerm("");
                      }}
                      className="ml-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-semibold transition"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader className="w-16 h-16 text-purple-600 animate-spin mb-4" />
              <p className="text-xl text-gray-600 font-semibold">
                Loading doctors... 🏥
              </p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 px-6">
              <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Stethoscope className="w-16 h-16 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No doctors found
              </h3>
              <p className="text-gray-600 text-center max-w-md">
                {searchTerm || filterStatus !== "all" || filterClinic !== "all"
                  ? "Try adjusting your filters to find doctors"
                  : "No doctors have been registered yet"}
              </p>
            </div>
          ) : (
            /* Doctors Grid */
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-xl hover:border-purple-300 transition-all duration-300 transform hover:scale-105"
                  >
                    {/* Profile Section - Centered */}
                    <div className="flex flex-col items-center mb-3">
                      <div className="relative mb-2">
                        {doctor.profilePicture ? (
                          <img
                            src={doctor.profilePicture}
                            alt={doctor.name}
                            className="w-20 h-20 rounded-full object-cover ring-4 ring-purple-100"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl ring-4 ring-purple-100">
                            {doctor.name.charAt(0)}
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                          <Heart className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>
                      <h3 className="font-bold text-base text-gray-900 text-center">
                        Dr. {doctor.name}
                      </h3>
                      <p className="text-xs text-purple-600 font-semibold text-center">
                        {doctor.specialization}
                      </p>
                      <span
                        className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                          doctor.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {doctor.isActive ? "✓ Active" : "✕ Inactive"}
                      </span>
                    </div>

                    {/* Doctor Details */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <GraduationCap className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                        <span className="font-medium truncate">
                          {doctor.qualification}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Briefcase className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                        <span>{doctor.experience} yrs exp.</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <DollarSign className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                        <span className="font-semibold text-emerald-600">
                          ₹{doctor.consultationFee}
                        </span>
                      </div>
                    </div>

                    {/* Clinic Info */}
                    {doctor.clinicId && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
                        <p className="font-semibold text-gray-900 text-xs truncate">
                          {doctor.clinicId.clinicName}
                        </p>
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {doctor.clinicId.city}
                        </p>
                      </div>
                    )}

                    {/* View Button */}
                    <button
                      onClick={() => handleView(doctor)}
                      className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-xs font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Doctor Modal */}
      {showViewModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Stethoscope className="w-6 h-6" />
                Doctor Details
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-white hover:bg-white/20 p-2 rounded-xl transition"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              {/* Doctor Header */}
              <div className="flex items-center gap-6 mb-8 pb-6 border-b-2 border-gray-200">
                {selectedDoctor.profilePicture ? (
                  <img
                    src={selectedDoctor.profilePicture}
                    alt={selectedDoctor.name}
                    className="w-32 h-32 rounded-full object-cover ring-4 ring-purple-200 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-4xl ring-4 ring-purple-200 shadow-lg">
                    {selectedDoctor.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-3xl font-bold text-gray-900 mb-2">
                    Dr. {selectedDoctor.name}
                  </h4>
                  <p className="text-xl text-purple-600 font-semibold mb-2">
                    {selectedDoctor.specialization}
                  </p>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-bold ${
                        selectedDoctor.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedDoctor.isActive ? "✓ Active" : "✕ Inactive"}
                    </span>
                    <span className="px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                      {selectedDoctor.experience} years exp.
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-5 h-5 text-purple-600" />
                    <label className="text-sm font-semibold text-gray-600">
                      Email
                    </label>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {selectedDoctor.email}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-5 h-5 text-purple-600" />
                    <label className="text-sm font-semibold text-gray-600">
                      Phone
                    </label>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {selectedDoctor.phone}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                    <label className="text-sm font-semibold text-gray-600">
                      Qualification
                    </label>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {selectedDoctor.qualification}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    <label className="text-sm font-semibold text-gray-600">
                      Consultation Fee
                    </label>
                  </div>
                  <p className="text-emerald-600 font-bold text-xl">
                    ₹{selectedDoctor.consultationFee}
                  </p>
                </div>
              </div>

              {/* Bio */}
              {selectedDoctor.bio && (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
                  <h5 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    About Doctor
                  </h5>
                  <p className="text-gray-700 leading-relaxed italic">
                    "{selectedDoctor.bio}"
                  </p>
                </div>
              )}

              {selectedDoctor.clinicId && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                  <h5 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Clinic Details
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-blue-700 mb-1">Clinic Name</p>
                      <p className="font-semibold text-gray-900">
                        {selectedDoctor.clinicId.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 mb-1">Location</p>
                      <p className="font-semibold text-gray-900">
                        {selectedDoctor.clinicId.city}
                      </p>
                    </div>
                    {selectedDoctor.clinicId.phone && (
                      <div>
                        <p className="text-sm text-blue-700 mb-1">
                          Clinic Phone
                        </p>
                        <p className="font-semibold text-gray-900">
                          {selectedDoctor.clinicId.phone}
                        </p>
                      </div>
                    )}
                    {selectedDoctor.clinicId.email && (
                      <div>
                        <p className="text-sm text-blue-700 mb-1">
                          Clinic Email
                        </p>
                        <p className="font-semibold text-gray-900">
                          {selectedDoctor.clinicId.email}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Doctors;
