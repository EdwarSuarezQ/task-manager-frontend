import { createContext, useContext, useState, useEffect } from "react";
import {
  getUserNotificationsRequest,
  getAdminNotificationsRequest,
} from "../api/tasks";
import { useAuth } from "./AuhtContext";

const NotificationsContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context)
    throw new Error("useNotifications must be used within a provider");
  return context;
};

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewedNotifications, setViewedNotifications] = useState(new Set());
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const savedViewed = localStorage.getItem(
        `viewedNotifications_${user._id}`
      );
      if (savedViewed) {
        try {
          const viewedArray = JSON.parse(savedViewed);
          setViewedNotifications(new Set(viewedArray));
        } catch (error) {
          console.error("Error loading viewed notifications:", error);
        }
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user && viewedNotifications.size > 0) {
      const viewedArray = Array.from(viewedNotifications);
      localStorage.setItem(
        `viewedNotifications_${user._id}`,
        JSON.stringify(viewedArray)
      );
    }
  }, [viewedNotifications, isAuthenticated, user]);

  const loadNotifications = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      if (user?.role === "admin") {
        const res = await getAdminNotificationsRequest();
        setNotifications(res.data.alerts || []);
        setSummary(res.data.summary || null);
      } else {
        const res = await getUserNotificationsRequest();
        setNotifications(res.data || []);
        setSummary(null);
      }
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
      setNotifications([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsViewed = () => {
    const allNotificationIds = notifications.map((_, index) => index);
    setViewedNotifications(
      new Set([...viewedNotifications, ...allNotificationIds])
    );
  };

  const markAsViewed = (notificationIndex) => {
    setViewedNotifications((prev) => new Set([...prev, notificationIndex]));
  };

  const getUnviewedNotifications = () => {
    return notifications.filter((_, index) => !viewedNotifications.has(index));
  };

  const getUnviewedCount = () => {
    return getUnviewedNotifications().length;
  };

  const clearViewedNotifications = () => {
    setViewedNotifications(new Set());
    if (user) {
      localStorage.removeItem(`viewedNotifications_${user._id}`);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setSummary(null);
      clearViewedNotifications();
      return;
    }

    loadNotifications();

    const interval = setInterval(loadNotifications, 120000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user?.role]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        summary,
        loading,
        unviewedCount: getUnviewedCount(),
        markAllAsViewed,
        markAsViewed,
        clearViewedNotifications,
        refreshNotifications: loadNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
