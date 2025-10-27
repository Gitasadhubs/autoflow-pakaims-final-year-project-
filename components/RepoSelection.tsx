import React from 'react';
import type { Repository } from '../types';
import { RepoIcon } from './icons';

interface RepoSelectionProps {
  repos: Repository[];
  onRepoSelect: (repo: Repository) => void;
}

const timeAgo = (date: string | null): string => {
    if (!date) return 'N/A';
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

const LanguageColor = ({ language }: { language: string | null }) => {
    const colors: { [key: string]: string } = {
        'TypeScript': 'bg-blue-500',
        'JavaScript': 'bg-yellow-400',
        'HTML': 'bg-red-500',
        'CSS': 'bg-purple-500',
        'Python': 'bg-green-500',
        'Java': 'bg-orange-500',
        'Go': 'bg-cyan-500',
        'C#': 'bg-indigo-500',
        'Ruby': 'bg-red-700',
        'PHP': 'bg-purple-400',
    };
    const color = colors[language || ''] || 'bg-gray-500';
    return <span className={`w-3 h-3 rounded-full inline-block mr-2 ${color}`}></span>;
};

const RepoSelection: React.FC<RepoSelectionProps> = ({ repos, onRepoSelect }) => {
  return (
    <div className="p-6 md:p-10 text-gray-800 dark:text-gray-200 overflow-y-auto h-full">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Select a Repository</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map(repo => (
                <button
                    key={repo.id}
                    onClick={() => onRepoSelect(repo)}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-left hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-200 flex flex-col"
                >
                    <div className="flex items-center mb-3">
                        <RepoIcon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 truncate">{repo.name}</h2>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow mb-4 h-10 overflow-hidden">
                        {repo.description || 'No description provided.'}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-500 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                        {repo.language && (
                            <div className="flex items-center mr-4">
                                <LanguageColor language={repo.language} />
                                <span>{repo.language}</span>
                            </div>
                        )}
                        <span>Updated {timeAgo(repo.updated_at)}</span>
                    </div>
                </button>
            ))}
        </div>
    </div>
  );
};

export default RepoSelection;