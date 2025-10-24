import React from 'react';

interface WorkflowPreviewProps {
    filename: string;
    content: string;
    html_url: string;
}

const WorkflowPreview: React.FC<WorkflowPreviewProps> = ({ filename, content, html_url }) => {
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Generated Workflow Preview
                </h3>
                <a
                    href={html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                    View on GitHub
                </a>
            </div>
            <div className="p-4 overflow-y-auto">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Successfully created <code className="bg-gray-200 dark:bg-gray-700 text-xs p-1 rounded-md">{filename}</code>.
                </p>
                <div className="h-full">
                    <pre className="text-xs text-gray-800 dark:text-gray-300 whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-900 p-4 rounded-md h-full">
                        <code>{content}</code>
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default WorkflowPreview;
