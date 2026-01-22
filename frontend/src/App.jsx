import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RoleSelection from './RoleSelection';
import UserSignup from './auth/user/UserSignup';
import UserLogin from './auth/user/UserLogin';
import { Toaster } from 'react-hot-toast';
import VerifyOtp from './auth/user/VerifyOtp';
import { useUserAuthStore } from './store/userAuthStore';
import UserHome from './user/UserHome';
import { useEffect } from 'react';
import ClinicRequests from './admin/ClinicRequests.jsx';
import AdminMainLayout from './layout/AdminMainLayout.jsx';
import Doctors from './admin/Doctors.jsx';
import Users from './admin/Users.jsx';
import Appointments from './admin/Appointments.jsx';

function App() {
  const { user, isUserAuthenticated, isLoggedIn, checkAuth } = useUserAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RoleSelection />} />

          {/* User routes */}
          <Route
            path="/userSignup"
            element={
              !isUserAuthenticated ? (
                <UserSignup />
              ) : (
                <Navigate to="/userHome" />
              )
            }
          />
          <Route
            path="userLogin"
            element={
              !isUserAuthenticated ? (
                <UserLogin />
              ) : (
                <Navigate to={"/UserHome"} />
              )
            }
          />
          <Route
            path="/userVerify"
            element={
              !isUserAuthenticated && isLoggedIn ? (
                <VerifyOtp />
              ) : (
                <Navigate to="/userLogin" />
              )
            }
          />
          <Route
            path="/userHome"
            element={
              isUserAuthenticated ? <UserHome /> : <Navigate to="/userLogin" />
            }
          />

          {/* Admin ROutes */}
          <Route
            path="/admin/clinicRequests"
            element={
              isUserAuthenticated && user?.role === "admin" ? (
                <AdminMainLayout>
                  <ClinicRequests />
                </AdminMainLayout>
              ) : (
                <Navigate to="/userLogin" />
              )
            }
          />

          <Route
            path="/admin/doctors"
            element={
              isUserAuthenticated && user?.role === "admin" ? (
                <AdminMainLayout>
                  <Doctors />
                </AdminMainLayout>
              ) : (
                <Navigate to="/userLogin" />
              )
            }
          />

          <Route
            path="/admin/users"
            element={
              isUserAuthenticated && user?.role === "admin" ? (
                <AdminMainLayout>
                  <Users />
                </AdminMainLayout>
              ) : (
                <Navigate to="/userLogin" />
              )
            }
          />
          
          <Route
            path="/admin/appointments"
            element={
              isUserAuthenticated && user?.role === "admin" ? (
                <AdminMainLayout>
                  <Appointments />
                </AdminMainLayout>
              ) : (
                <Navigate to="/userLogin" />
              )
            }
          />


        </Routes>
      </Router>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App
