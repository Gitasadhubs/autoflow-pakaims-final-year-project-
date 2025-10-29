import React from 'react';
import ToastComponent from './Toast';
import { Toast } from '../types';

interface ToastContainerProps {
    toasts: Toast[];
    onDismiss: (id: number) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
    return (
        <div className="fixed top-20 right-4 z-50 w-full max-w-sm space-y-3">
            {toasts.map(toast => (
                <ToastComponent key={toast.id} {...toast} onDismiss={() => onDismiss(toast.id)} />
            ))}
        </div>
    );
};

export default ToastContainer;
