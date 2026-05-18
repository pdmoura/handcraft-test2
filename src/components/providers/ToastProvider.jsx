'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';

const ToastContext = createContext(undefined);

export function ToastProvider({  children  }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type= 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const typeStyles = {
    success: 'bg-success text-white',
    error: 'bg-error text-white',
    info: 'bg-accent text-white',
    warning: 'bg-warning text-white',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${typeStyles[toast.type]} animate-fade-in-up flex items-center gap-3 rounded-lg px-5 py-3 font-ui text-sm shadow-dropdown min-w-[280px] max-w-[420px]`}
            role="alert"
          >
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 rounded-full p-1 hover:bg-white/20 transition-colors"
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
