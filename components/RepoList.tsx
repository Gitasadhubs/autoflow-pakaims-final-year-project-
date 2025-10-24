import React from 'react';
import type { Repository } from '../types';
import { RepoIcon } from './icons';

interface RepoListProps {
  repos: Repository[];
  onRepoSelect: (repo: Repository) => void;
  selectedRepo: Repository | null;
  isSidebarOpen: boolean;
}

const RepoList: React.FC<RepoListProps> = ({ repos, onRepoSelect, selectedRepo, isSidebarOpen }) => {
  return (
    <div className="p-2">
      {isSidebarOpen && <h3 className="px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Repositories</h3>}
      <ul className="mt-2 space-y-1">
        {repos.map((repo) => (
          <li key={repo.id}>
            <button
              onClick={() => onRepoSelect(repo)}
              title={!isSidebarOpen ? repo.name : undefined}
              className={`w-full text-left flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${!isSidebarOpen && 'justify-center'} ${
                selectedRepo?.id === repo.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <RepoIcon className={`h-4 w-4 fill-current flex-shrink-0 ${isSidebarOpen ? 'mr-3' : ''}`}/>
              {isSidebarOpen && <span className="truncate">{repo.name}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RepoList;