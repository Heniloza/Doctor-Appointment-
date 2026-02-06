import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import toast from "react-hot-toast";
import { axiosInstance } from "../api/api";


const firebaseConfig = {
  apiKey: "AIzaSyA4_LxSn8c-52ZpjJ2nOHXnm0SbgLsHZrM",
  authDomain: "doctrek---doctor-appointment.firebaseapp.com",
  projectId: "doctrek---doctor-appointment",
  storageBucket: "doctrek---doctor-appointment.firebasestorage.app",
  messagingSenderId: "149508306728",
  appId: "1:149508306728:web:928c151738030b5502c21d",
  measurementId: "G-G70KCPLY9N",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async (userType) => {
  try {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return null;
    }

    if (!("serviceWorker" in navigator)) {
      console.log("Service Worker not supported");
      return null;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted");

      const token = await getToken(messaging, {
        vapidKey: "YOUR_VAPID_KEY_HERE",
      });

      if (token) {
        console.log("FCM Token received");

        await saveFCMToken(token, userType);

        return token;
      } else {
        console.log("No FCM token available");
        return null;
      }
    } else if (permission === "denied") {
      console.log("Notification permission denied");
      toast.error("Please enable notifications to receive updates");
      return null;
    } else {
      console.log("Notification permission dismissed");
      return null;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return null;
  }
};


const saveFCMToken = async (token, userType) => {
  try {
    await axiosInstance.post(
      `/fcm-token/${userType}/save`,
      { token, device: "web" },
      { withCredentials: true },
    );
    console.log("FCM token saved to backend");
  } catch (error) {
    console.error("Error saving FCM token:", error);
  }
};

export const removeFCMToken = async (token, userType) => {
  try {
    await axiosInstance.post(
      `/fcm-token/${userType}/remove`,
      { token },
      { withCredentials: true },
    );
    console.log("FCM token removed from backend");
  } catch (error) {
    console.error("Error removing FCM token:", error);
  }
};

export const listenForMessages = (onMessageReceived) => {
  onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);

    const { title, body } = payload.notification || {};

    if (title && body) {
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                    <span className="text-2xl">🔔</span>
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{title}</p>
                  <p className="mt-1 text-sm text-gray-500">{body}</p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  if (payload.data?.link) {
                    window.location.href = payload.data.link;
                  }
                }}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-teal-600 hover:text-teal-500"
              >
                View
              </button>
            </div>
          </div>
        ),
        {
          duration: 5000,
          position: "top-right",
        },
      );
    }

    if (onMessageReceived) {
      onMessageReceived(payload);
    }
  });
};

export const initializeFCM = async (userType, onMessageReceived) => {
  try {
    const token = await requestNotificationPermission(userType);

    if (token) {
      listenForMessages(onMessageReceived);
      console.log("FCM initialized successfully");
    }
  } catch (error) {
    console.error("Error initializing FCM:", error);
  }
};

