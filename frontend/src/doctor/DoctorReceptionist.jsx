import React, { useEffect, useState } from "react";
import { useDoctorReceptionistStore } from "../store/receptionistStore";
import {
  UserPlus,
  User,
  Mail,
  Phone,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

function DoctorReceptionist() {
  const {
    receptionist,
    isLoading,
    createReceptionist,
    getReceptionist,
    deleteReceptionist,
    toggleReceptionistStatus,
  } = useDoctorReceptionistStore();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  useEffect(() => {
    getReceptionist();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createReceptionist(formData);
    if (result.success) {
      setShowCreateForm(false);
      setFormData({ name: "", email: "", password: "", phone: "" });
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your receptionist?",
      )
    ) {
      await deleteReceptionist();
    }
  };

  const handleToggleStatus = async () => {
    await toggleReceptionistStatus();
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Receptionist
          </h1>
          <p className="text-gray-600">
            Create and manage your receptionist account
          </p>
        </div>

        {!receptionist ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {!showCreateForm ? (
              <div className="text-center">
                <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No Receptionist Yet
                </h2>
                <p className="text-gray-600 mb-6">
                  Create a receptionist account to help manage your appointments
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
                >
                  Create Receptionist
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-black">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Create Receptionist Account
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter receptionist name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Create a password (min 6 characters)"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
                  >
                    Create Receptionist
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Current Receptionist
              </h2>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-10 h-10 text-teal-600" />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {receptionist.name}
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Mail className="w-5 h-5" />
                      <span>{receptionist.email}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="w-5 h-5" />
                      <span>{receptionist.phone}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">
                        Status:
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${receptionist.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {receptionist.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleToggleStatus}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
                >
                  {receptionist.isActive ? (
                    <>
                      <ToggleRight className="w-5 h-5" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5" />
                      Activate
                    </>
                  )}
                </button>

                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete Receptionist
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-emerald-900">
                  <strong>Note:</strong> Your receptionist can login at{" "}
                  <strong>/receptionistLogin</strong> and manage your
                  appointments.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorReceptionist;
