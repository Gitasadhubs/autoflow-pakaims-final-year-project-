import React from 'react';
import { Spinner } from './icons';

interface WorkflowPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    filename: string;
    content: string | null;
}

const WorkflowPreviewModal: React.FC<WorkflowPreviewModalProps> = ({ isOpen, onClose, filename, content }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 transition-opacity" aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl border border-gray-200 dark:border-gray-700 transform transition-all flex flex-col" style={{maxHeight: '90vh'}}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Preview: {filename}</h3>
                     <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">&times;</button>
                </div>

                <div className="p-4 overflow-y-auto">
                    {content === null ? (
                        <div className="flex items-center justify-center h-48">
                            <Spinner className="h-8 w-8 text-blue-500" />
                        </div>
                    ) : (
                         <pre className="text-xs text-gray-800 dark:text-gray-300 whitespace-pre-wrap font-mono">
                            <code>{content}</code>
                        </pre>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end rounded-b-lg flex-shrink-0">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkflowPreviewModal;
