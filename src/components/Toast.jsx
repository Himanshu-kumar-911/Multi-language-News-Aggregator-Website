import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const toastTypes = {
  success: {
    icon: CheckCircleIcon,
    bgColor: 'bg-green-50 dark:bg-green-900',
    borderColor: 'border-green-200 dark:border-green-700',
    textColor: 'text-green-800 dark:text-green-200',
    iconColor: 'text-green-400 dark:text-green-300'
  },
  error: {
    icon: XCircleIcon,
    bgColor: 'bg-red-50 dark:bg-red-900',
    borderColor: 'border-red-200 dark:border-red-700',
    textColor: 'text-red-800 dark:text-red-200',
    iconColor: 'text-red-400 dark:text-red-300'
  },
  warning: {
    icon: ExclamationTriangleIcon,
    bgColor: 'bg-yellow-50 dark:bg-yellow-900',
    borderColor: 'border-yellow-200 dark:border-yellow-700',
    textColor: 'text-yellow-800 dark:text-yellow-200',
    iconColor: 'text-yellow-400 dark:text-yellow-300'
  },
  info: {
    icon: InformationCircleIcon,
    bgColor: 'bg-blue-50 dark:bg-blue-900',
    borderColor: 'border-blue-200 dark:border-blue-700',
    textColor: 'text-blue-800 dark:text-blue-200',
    iconColor: 'text-blue-400 dark:text-blue-300'
  }
};

let toastId = 0;
const toastCallbacks = new Set();

export function showToast(message, type = 'info', duration = 4000) {
  const id = ++toastId;
  const toast = { id, message, type, duration };
  
  toastCallbacks.forEach(callback => callback(toast));
  
  return id;
}

export function Toast({ toast, onRemove }) {
  const [isVisible, setIsVisible] = useState(false);
  const config = toastTypes[toast.type] || toastTypes.info;
  const IconComponent = config.icon;

  useEffect(() => {
    // Trigger animation
    setIsVisible(true);

    // Auto remove after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(toast.id), 300); // Wait for animation
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        max-w-sm w-full ${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg pointer-events-auto
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <IconComponent className={`h-5 w-5 ${config.iconColor}`} aria-hidden="true" />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className={`text-sm font-medium ${config.textColor}`}>
              {toast.message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleClose}
              className={`
                inline-flex ${config.textColor} hover:opacity-75 focus:outline-none 
                focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md
              `}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const callback = (toast) => {
      setToasts(prev => [...prev, toast]);
    };

    toastCallbacks.add(callback);
    return () => toastCallbacks.delete(callback);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50">
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </div>
  );
}