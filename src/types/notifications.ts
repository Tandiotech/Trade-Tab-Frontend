// types/notifications.ts

type NotificationStatus = 'pending' | 'connecting' | 'success' | 'error';
type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType; // Para íconos y colores (visual)
  title: string; // Encabezado visible
  message: string; // Texto o descripción
  status?: NotificationStatus; // Estado funcional (para progreso o conexión)
  progress?: number; // 0 - 100 (opcional, si aplica)
  accountName?: string; // Datos adicionales opcionales
  accountNumber?: string;
  accountType?: string;
  server?: string;
  error?: string;
  result?: any; // Resultado o payload de éxito
  createdAt: number;
  read: boolean;
  autoClose?: boolean; // Si se debe eliminar automáticamente
  duration?: number; // Duración del autocierre
}
