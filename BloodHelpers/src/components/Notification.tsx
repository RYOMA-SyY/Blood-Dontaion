import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
  duration?: number;
}

const Notification = ({ message, type, onClose, duration = 5000 }: NotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return '';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed top-4 right-4 p-4 rounded-lg border ${getBgColor()} shadow-lg z-50`}
        initial={{ opacity: 0, y: -20, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: -20, x: 20 }}
      >
        <div className="flex items-center space-x-3">
          {getIcon()}
          <p className="text-sm font-medium text-gray-900">{message}</p>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            title="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Notification; 