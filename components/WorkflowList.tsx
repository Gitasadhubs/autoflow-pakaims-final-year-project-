import React from 'react';
import type { Workflow } from '../types';
import { PlayIcon, StatusIcon, ExternalLinkIcon } from './icons';

interface WorkflowListProps {
  workflows: Workflow[];
  onWorkflowRun: (workflow: Workflow) => void;
}

const timeAgo = (date: string | null): string => {
    if (!date) return '';
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 0) return 'just now';
    
    let interval = seconds / 31536000;
    if (interval > 1) {
        const years = Math.floor(interval);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        const months = Math.floor(interval);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 86400;
    if (interval > 1) {
        const days = Math.floor(interval);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 3600;
    if (interval > 1) {
        const hours = Math.floor(interval);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 60;
    if (interval > 1) {
        const minutes = Math.floor(interval);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    return `${Math.floor(seconds)} second${seconds !== 1 ? 's' : ''} ago`;
};


const WorkflowList: React.FC<WorkflowListProps> = ({ workflows, onWorkflowRun }) => {
  if (workflows.length === 0) {
    return <div className="text-gray-500 dark:text-gray-400">No workflows found for this repository. Ensure they are in the `.github/workflows` directory.</div>;
  }

  return (
    <ul className="space-y-3">
      {workflows.filter(w => w.state === 'active').map((workflow) => {
        const lastRun = workflow.lastRun;
        const tooltipText = lastRun
          ? `Last run: ${lastRun.conclusion || lastRun.status} by ${lastRun.actor.login} on "${lastRun.head_branch}" branch, ${timeAgo(lastRun.created_at)}`
          : 'No recent runs found.';

        return (
          <li key={workflow.id} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between space-x-4">
            <div className="flex-1 min-w-0 flex items-center space-x-3">
                <div title={tooltipText} className="flex-shrink-0">
                    <StatusIcon
                        status={lastRun?.status ?? null}
                        conclusion={lastRun?.conclusion ?? null}
                        className="h-6 w-6"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 dark:text-white truncate" title={workflow.name}>{workflow.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={workflow.path.split('/').pop()}>{workflow.path.split('/').pop()}</p>
                </div>
            </div>

            <div className="flex-shrink-0 flex items-center space-x-2">
              <a
                href={workflow.html_url}
                target="_blank"
                rel="noopener noreferrer"
                title="View workflow file on GitHub"
                className="p-2 text-gray-500 dark:text-gray-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-blue-500"
              >
                  <span className="sr-only">View file on GitHub</span>
                  <ExternalLinkIcon className="h-5 w-5" />
              </a>
              <button
                onClick={() => onWorkflowRun(workflow)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-blue-500"
              >
                <PlayIcon className="h-5 w-5" />
                <span>Run</span>
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  );
};

export default WorkflowList;