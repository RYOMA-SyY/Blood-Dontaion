import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from '@/components/Notification';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationState {
  message: string;
  type: NotificationType;
  duration: number;
  id: number;
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationState[]>([]);

  const showNotification = useCallback((message: string, type: NotificationType, duration = 5000) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { message, type, duration, id }]);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}; 