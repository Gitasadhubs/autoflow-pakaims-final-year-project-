import React, { useState, useEffect, useMemo } from 'react';
import type { Repository } from '../types';
import { Spinner } from './icons';

interface WorkflowGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (filename: string, content: string) => Promise<void>;
    repo: Repository;
}

const vercelWorkflowContent = `name: Deploy to Vercel

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
      - name: Install Dependencies
        run: npm ci
      - name: Build
        run: npm run build --if-present
      - name: Test
        run: npm test

  deploy:
    runs-on: ubuntu-latest
    needs: build-and-test
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Deploy to Vercel
        # See documentation for required secrets: https://github.com/amondnet/vercel-action
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}`;

const railwayWorkflowContent = `name: Deploy to Railway

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
      - name: Install Dependencies
        run: npm ci
      - name: Build
        run: npm run build --if-present
      - name: Test
        run: npm test

  deploy:
    runs-on: ubuntu-latest
    needs: build-and-test
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Deploy to Railway
        # See documentation for required secrets: https://github.com/railwayapp/cli-action
        uses: railwayapp/cli-action@v1
        with:
          railway_token: \${{ secrets.RAILWAY_TOKEN }}`;


const templates = {
  'vercel-deploy': {
    name: 'Deploy to Vercel',
    filename: 'deploy-vercel.yml',
    content: vercelWorkflowContent
  },
  'railway-deploy': {
    name: 'Deploy to Railway',
    filename: 'deploy-railway.yml',
    content: railwayWorkflowContent
  }
};


const WorkflowGenerator: React.FC<WorkflowGeneratorProps> = ({ isOpen, onClose, onSubmit, repo }) => {
    const [selectedTemplate, setSelectedTemplate] = useState<string>(Object.keys(templates)[0]);
    const [filename, setFilename] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const activeTemplate = useMemo(() => templates[selectedTemplate as keyof typeof templates], [selectedTemplate]);

    useEffect(() => {
        if (isOpen) {
            const firstTemplateKey = Object.keys(templates)[0];
            const firstTemplate = templates[firstTemplateKey as keyof typeof templates];
            setSelectedTemplate(firstTemplateKey);
            setFilename(firstTemplate.filename);
            setError(null);
            setIsLoading(false);
        }
    }, [isOpen]);
    
    useEffect(() => {
        if (activeTemplate) {
            setFilename(activeTemplate.filename);
        }
    }, [activeTemplate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await onSubmit(filename, activeTemplate.content);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 transition-opacity" aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 transform transition-all">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Generate Workflow for <span className="font-bold text-blue-500 dark:text-blue-400">{repo.name}</span></h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Select a template and a filename for your new workflow.</p>
                    </div>

                    <div className="p-6 space-y-4">
                        {error && <div className="p-3 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-500 text-red-700 dark:text-red-300 rounded-md text-sm">{error}</div>}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Template</label>
                            <div className="flex space-x-2 flex-wrap gap-2">
                                {Object.entries(templates).map(([key, template]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setSelectedTemplate(key)}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${selectedTemplate === key ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                                    >
                                        {template.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="filename" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filename</label>
                            <input
                                id="filename"
                                type="text"
                                value={filename}
                                onChange={(e) => setFilename(e.target.value)}
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 placeholder-gray-500 text-gray-900 dark:text-gray-200 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">This file will be created in <code className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1 py-0.5 rounded-md">.github/workflows/</code></p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content Preview</label>
                            <div className="h-64 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-300 dark:border-gray-700">
                                <pre className="text-xs text-gray-800 dark:text-gray-300 whitespace-pre-wrap font-mono">
                                    <code>{activeTemplate.content}</code>
                                </pre>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3 rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-500 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center transition-colors">
                            {isLoading && <Spinner className="h-4 w-4 mr-2" />}
                            {isLoading ? 'Creating...' : 'Create Workflow'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WorkflowGenerator;