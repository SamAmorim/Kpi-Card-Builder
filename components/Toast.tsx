import React, { useEffect, useState } from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage, removeToast: (id: string) => void }> = ({ toast, removeToast }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => removeToast(toast.id), 300); // Wait for animation
        }, 3000);
        return () => clearTimeout(timer);
    }, [toast.id, removeToast]);

    const bg = toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-slate-800';
    const icon = toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info';

    return (
        <div className={`${bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center transform transition-all duration-300 ${isExiting ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'} animate-in slide-in-from-bottom-2`}>
            <span className="material-symbols-outlined text-sm mr-2">{icon}</span>
            <span className="text-sm font-medium">{toast.message}</span>
        </div>
    );
};

export default Toast;