import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppointmentStore } from "../store/appointmentStore";
import { axiosInstance } from "../api/api";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Award,
  Briefcase,
  GraduationCap,
  Phone,
  Mail,
  Building2,
  Stethoscope,
  Heart,
  CheckCircle,
  Loader,
} from "lucide-react";

function ViewDoctorProfile() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { getDoctorAvailableSlots, availableSlots, isLoading, doctors } =
    useAppointmentStore();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);

        const doctorInStore = doctors.find((d) => d._id === doctorId);

        if (doctorInStore) {
          setDoctor(doctorInStore);
          setLoading(false);
        } else {
          const response = await axiosInstance.get(`/appointment/doctors`);
          const allDoctors = response.data.data;
          const foundDoctor = allDoctors.find((d) => d._id === doctorId);

          if (foundDoctor) {
            setDoctor(foundDoctor);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching doctor:", error);
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctor();
    }
  }, [doctorId, doctors]);

  useEffect(() => {
    if (doctorId && selectedDate) {
      getDoctorAvailableSlots(doctorId, selectedDate);
    }
  }, [doctorId, selectedDate]);

  const handleBookSlot = (slot) => {
    navigate(`/book-appointment/${doctorId}`, {
      state: {
        doctor,
        slot,
        selectedDate,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader className="w-12 h-12 text-teal-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Doctor Not Found
          </h2>
          <p className="text-gray-600 mb-4">Unable to load doctor profile</p>
          <button
            onClick={() => navigate("/findDoctors")}
            className="text-teal-600 font-semibold hover:underline"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  src={
                    doctor.profilePicture ||
                    `https://ui-avatars.com/api/?name=${doctor.name}&size=160&background=14b8a6&color=fff&bold=true`
                  }
                  alt={doctor.name}
                  className="w-40 h-40 rounded-xl object-cover"
                />

                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                     {doctor.name}
                  </h1>
                  <p className="text-xl text-teal-600 font-semibold mb-4">
                    {doctor.specialization}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="w-5 h-5" />
                      <span>{doctor.experience} years experience</span>
                    </div>

                    {doctor.qualification && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <GraduationCap className="w-5 h-5" />
                        <span>{doctor.qualification}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="px-4 py-2 bg-emerald-100 rounded-lg">
                      <span className="text-2xl font-bold text-emerald-600">
                        ₹{doctor.consultationFee}
                      </span>
                      <span className="text-sm text-gray-600 ml-2">
                        per consultation
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {doctor.bio && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-teal-600" />
                  About
                </h2>
                <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-600" />
                Clinic Information
              </h2>

              <div className="space-y-4">
                {doctor.clinicId && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Clinic Name</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {doctor.clinicId.clinicName}
                      </p>
                    </div>

                    {doctor.clinicId.address && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Address</p>
                        <p className="text-gray-700 flex items-start gap-2">
                          <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                          {doctor.clinicId.address}, {doctor.clinicId.city}
                        </p>
                      </div>
                    )}

                    {doctor.clinicId.phone && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Contact</p>
                        <p className="text-gray-700 flex items-center gap-2">
                          <Phone className="w-5 h-5 text-gray-400" />
                          {doctor.clinicId.phone}
                        </p>
                      </div>
                    )}

                    {doctor.clinicId.email && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Email</p>
                        <p className="text-gray-700 flex items-center gap-2">
                          <Mail className="w-5 h-5 text-gray-400" />
                          {doctor.clinicId.email}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-600" />
                Qualifications & Expertise
              </h2>

              <div className="space-y-4">
                {doctor.qualification && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-semibold text-gray-900">Education</p>
                      <p className="text-gray-700">{doctor.qualification}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Specialization
                    </p>
                    <p className="text-gray-700">{doctor.specialization}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Experience</p>
                    <p className="text-gray-700">
                      {doctor.experience} years of clinical practice
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                Book Appointment
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {isLoading ? (
                <div className="py-8 flex justify-center">
                  <Loader className="w-8 h-8 text-teal-600 animate-spin" />
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="py-8 text-center">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">
                    No available slots for this date
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-3">
                    {availableSlots.length} slots available
                  </p>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot._id}
                        onClick={() => handleBookSlot(slot)}
                        className="w-full p-3 border border-gray-300 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition text-left group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400 group-hover:text-teal-600" />
                            <span className="font-semibold text-gray-900">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                          <span className="text-xs text-teal-600 font-semibold group-hover:underline">
                            Book
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => navigate(`/book-appointment/${doctor._id}`)}
                  className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-teal-700 transition flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-teal-50 rounded-xl p-6 border border-teal-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Important Notice
              </h3>
              <p className="text-gray-700 text-sm">
                Please arrive 10 minutes before your appointment time. Bring any
                relevant medical reports or prescriptions for the consultation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewDoctorProfile;
