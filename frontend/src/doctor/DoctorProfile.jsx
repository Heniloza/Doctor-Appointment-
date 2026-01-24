import React, { useState } from 'react';
import { useDoctorAuthStore } from '../store/doctorAuthStore';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase,
  GraduationCap,
  DollarSign,
  Camera,
  Save,
  Edit,
  X,
  Heart,
  Building2,
  MapPin,
  Award,
  Clock,
  Stethoscope
} from 'lucide-react';
import toast from 'react-hot-toast';

function DoctorProfile() {
  const { doctor, updateDoctorProfile, isUpdatingProfile } = useDoctorAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: doctor?.name || '',
    phone: doctor?.phone || '',
    bio: doctor?.bio || '',
    profilePicture: doctor?.profilePicture || ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image should be less than 5MB 📸');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateDoctorProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: doctor?.name || '',
      phone: doctor?.phone || '',
      bio: doctor?.bio || '',
      profilePicture: doctor?.profilePicture || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Stethoscope className="w-10 h-10 text-emerald-600" />
            My Profile
          </h1>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-8 relative">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                  {formData.profilePicture || doctor?.profilePicture ? (
                    <img
                      src={formData.profilePicture || doctor?.profilePicture}
                      alt="Doctor"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <label 
                    htmlFor="profile-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="w-8 h-8 text-white" />
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="text-center md:text-left text-white flex-1">
                <h2 className="text-3xl font-bold mb-1">{doctor?.name}</h2>
                <p className="text-emerald-100 text-xl font-semibold mb-2">{doctor?.specialization}</p>
                <div className="flex items-center gap-4 justify-center md:justify-start flex-wrap">
                  <span className="flex items-center gap-1 px-3 py-1 bg-white/20 text-white rounded-full text-sm font-semibold">
                    <Award className="w-4 h-4" />
                    {doctor?.experience} years
                  </span>
                  <span className="flex items-center gap-1 px-3 py-1 bg-white/20 text-white rounded-full text-sm font-semibold">
                    <GraduationCap className="w-4 h-4" />
                    {doctor?.qualification}
                  </span>
                  {doctor?.isActive && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-emerald-400 text-white rounded-full text-sm font-semibold">
                      <Heart className="w-4 h-4" />
                      Active
                    </span>
                  )}
                </div>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition shadow-lg"
                >
                  <Edit className="w-5 h-5" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6 text-black">
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 mb-6">
                  <p className="text-sm text-emerald-900 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <strong>Note:</strong> You can update your personal details. For changes to specialization, qualification, or fees, please contact your clinic administrator.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="pl-10 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="pl-10 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Professional Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    placeholder="Tell patients about your approach to healthcare and what makes you passionate about helping them..."
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdatingProfile ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isUpdatingProfile}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <label className="text-sm font-semibold text-gray-600">Email</label>
                    </div>
                    <p className="text-gray-900 font-medium">{doctor?.email}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <label className="text-sm font-semibold text-gray-600">Phone</label>
                    </div>
                    <p className="text-gray-900 font-medium">{doctor?.phone}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Stethoscope className="w-5 h-5 text-gray-400" />
                      <label className="text-sm font-semibold text-gray-600">Specialization</label>
                    </div>
                    <p className="text-gray-900 font-medium">{doctor?.specialization}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="w-5 h-5 text-gray-400" />
                      <label className="text-sm font-semibold text-gray-600">Qualification</label>
                    </div>
                    <p className="text-gray-900 font-medium">{doctor?.qualification}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                      <label className="text-sm font-semibold text-gray-600">Experience</label>
                    </div>
                    <p className="text-gray-900 font-medium">{doctor?.experience} years of caring for patients</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <label className="text-sm font-semibold text-gray-600">Consultation Fee</label>
                    </div>
                    <p className="text-emerald-600 font-bold text-xl">₹{doctor?.consultationFee}</p>
                  </div>
                </div>

                {/* Bio */}
                {doctor?.bio && (
                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-5 h-5 text-emerald-600" />
                      <label className="text-sm font-semibold text-emerald-900">Professional Bio</label>
                    </div>
                    <p className="text-gray-700 leading-relaxed italic">"{doctor?.bio}"</p>
                  </div>
                )}

                {doctor?.clinicId && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Your Clinic
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-blue-700 mb-1">Clinic Name</p>
                        <p className="font-semibold text-gray-900">{doctor.clinicId.clinicName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-700 mb-1">Location</p>
                        <p className="font-semibold text-gray-900 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {doctor.clinicId.city}
                        </p>
                      </div>
                      {doctor.clinicId.phone && (
                        <div>
                          <p className="text-sm text-blue-700 mb-1">Clinic Phone</p>
                          <p className="font-semibold text-gray-900">{doctor.clinicId.phone}</p>
                        </div>
                      )}
                      {doctor.clinicId.email && (
                        <div>
                          <p className="text-sm text-blue-700 mb-1">Clinic Email</p>
                          <p className="font-semibold text-gray-900">{doctor.clinicId.email}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    Account Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Account Status:</span>
                      <span className="ml-2 font-semibold text-gray-900">
                        {doctor?.isActive ? '✓ Active' : '✕ Inactive'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Role:</span>
                      <span className="ml-2 font-semibold text-gray-900 capitalize">
                        {doctor?.role}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Joined:</span>
                      <span className="ml-2 font-semibold text-gray-900">
                        {new Date(doctor?.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-md p-4">
          <p className="text-sm text-gray-600 text-center">
            <strong>Need to update your credentials?</strong> Contact your clinic administrator to modify specialization, qualification, experience, or consultation fee.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;