import React, { useState, useContext, createContext, useCallback } from 'react';
import ToastContainer from '../components/ToastContainer';
import { Toast } from '../types';

type ToastContextType = {
    addToast: (toast: Omit<Toast, 'id'>) => void;
    areNotificationsEnabled: boolean;
    toggleNotifications: () => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [areNotificationsEnabled, setAreNotificationsEnabled] = useState<boolean>(() => {
        const saved = localStorage.getItem('autoflow-notifications-enabled');
        return saved !== null ? JSON.parse(saved) : true;
    });

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        if (!areNotificationsEnabled) return;

        const id = Date.now();
        setToasts(prev => [...prev, { ...toast, id }]);
        setTimeout(() => {
            removeToast(id);
        }, 6000); // Auto-dismiss after 6 seconds
    }, [areNotificationsEnabled]);

    const toggleNotifications = useCallback(() => {
        setAreNotificationsEnabled(prev => {
            const newState = !prev;
            localStorage.setItem('autoflow-notifications-enabled', JSON.stringify(newState));
            return newState;
        });
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, areNotificationsEnabled, toggleNotifications }}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={removeToast} />
        </ToastContext.Provider>
    );
};

export const useToasts = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToasts must be used within a ToastProvider');
    }
    return context;
};