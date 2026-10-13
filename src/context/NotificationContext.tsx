import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { Notification } from '@/types/notifications';

interface NotificationContextProps {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => string;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  getActiveNotifications: () => Notification[];
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // Memoize unreadCount to avoid recalculating on every render
  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  /** 🔹 Crear notificación persistente */
  const addNotification = useCallback((n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...n,
      id,
      createdAt: Date.now(),
      read: false,
      progress: n.progress ?? 0,
      ...(n.status ? { status: n.status } : {}),
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Autocierre opcional
    if (n.autoClose) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(item => item.id !== id));
      }, n.duration || 5000);
    }

    return id;
  }, []);

  /** 🔹 Actualizar una notificación (por ejemplo, para progreso o cambio de estado) */
  const updateNotification = useCallback((id: string, updates: Partial<Notification>) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, ...updates } : n)));
  }, []);

  /** 🔹 Marcar como leída */
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  /** 🔹 Marcar todas como leídas */
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  /** 🔹 Eliminar una notificación */
  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  /** 🔹 Eliminar todas */
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  /** 🔹 Obtener las notificaciones activas (por ejemplo, en progreso) */
  const getActiveNotifications = useCallback(() => {
    return notifications.filter(n => n.status === 'pending' || n.status === 'connecting');
  }, [notifications]);

  // 🔹 Limpieza opcional (por ejemplo, eliminar después de 24h)
  useEffect(() => {
    const interval = setInterval(() => {
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      setNotifications(prev => prev.filter(n => n.createdAt > oneDayAgo));
    }, 60000 * 10);
    return () => clearInterval(interval);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      updateNotification,
      markAsRead,
      markAllAsRead,
      clearNotification,
      clearAllNotifications,
      getActiveNotifications,
    }),
    [
      notifications,
      unreadCount,
      addNotification,
      updateNotification,
      markAsRead,
      markAllAsRead,
      clearNotification,
      clearAllNotifications,
      getActiveNotifications,
    ]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
