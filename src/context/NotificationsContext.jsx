import { createContext, useContext, useState, useEffect } from "react";
import {
  getUserNotificationsRequest,
  getAdminNotificationsRequest,
  markNotificationAsReadRequest,
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
  const { isAuthenticated, user } = useAuth();

  const loadNotifications = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      if (user?.role === "admin" || user?.role === "super_admin") {
        const res = await getAdminNotificationsRequest();
        setNotifications(res.data.notifications || []);
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

  const markAsRead = async (notificationId) => {
    try {
      if (notificationId) {
        // Enviar petición al backend para marcar como leída
        await markNotificationAsReadRequest(notificationId);
        
        // Actualizar estado local eliminando la notificación leída
        setNotifications((prev) => 
          prev.filter(n => 
            (n.taskId && n.taskId !== notificationId) && 
            (n.userId && n.userId !== notificationId) &&
            (n._id && n._id !== notificationId)
          )
        );
        // Recargar para sincronizar (opcional, pero asegura consistencia)
        loadNotifications();
      }
    } catch (error) {
      console.error("Error al marcar notificación como leída:", error);
    }
  };

  const markAllAsViewed = async () => {
    // Implementar si se agrega endpoint para marcar todas
    // Por ahora podríamos iterar, pero mejor solo implementar la individual
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setSummary(null);
      return;
    }

    loadNotifications();

    const interval = setInterval(loadNotifications, 60000); // Revisar cada minuto

    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        summary,
        loading,
        unviewedCount: notifications.length,
        markAsRead,
        refreshNotifications: loadNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
