import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Repository, WorkflowRun, Job, Workflow } from '../types';
import * as githubService from '../services/githubService';
import { Spinner, StatusIcon, EyeIcon, InformationCircleIcon, InfinityIcon } from './icons';
import WorkflowPreviewModal from './WorkflowPreviewModal';

interface WorkflowRunViewProps {
  token: string;
  repo: Repository;
  runId: number;
}

const usePolling = <T,>(
    fetcher: () => Promise<T>,
    interval: number,
    stopCondition: (data: T | null) => boolean
) => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [refetchCount, setRefetchCount] = useState(0);

    const refetch = useCallback(() => {
        setLoading(true);
        setRefetchCount(c => c + 1);
    }, []);

    useEffect(() => {
        let isMounted = true;
        let timeoutId: ReturnType<typeof setTimeout>;

        const poll = async () => {
            if (!isMounted) return;

            try {
                const result = await fetcher();
                if (isMounted) {
                    setError(null); // Clear error on success
                    setData(result);
                    if (stopCondition(result)) {
                        if (loading) setLoading(false);
                        return; // Stop polling
                    }
                }
            } catch (err) {
                 if (isMounted) {
                    if (err instanceof Error) setError(err.message);
                    else setError("An unknown polling error occurred");
                    // Do not return, allow polling to continue on error
                }
            } finally {
                // Ensure initial loading is always turned off after first attempt
                if (isMounted && loading) {
                    setLoading(false);
                }
            }
            
            if (isMounted && !stopCondition(data)) {
               timeoutId = setTimeout(poll, interval);
            }
        };

        poll();
        
        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetcher, interval, stopCondition, refetchCount]); // data is intentionally omitted to prevent inefficient re-polling

    return { data, error, loading, refetch };
};


const WorkflowRunView: React.FC<WorkflowRunViewProps> = ({ token, repo, runId }) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [logs, setLogs] = useState<string>('');
    const [workflow, setWorkflow] = useState<Workflow | null>(null);
    const [workflowError, setWorkflowError] = useState<string | null>(null);
    const [isPreviewOpen, setPreviewOpen] = useState(false);
    const [previewContent, setPreviewContent] = useState<string | null>(null);
    const logContainerRef = useRef<HTMLDivElement>(null);
    
    const fetchRun = React.useCallback(() => githubService.getWorkflowRun(token, repo.owner.login, repo.name, runId), [token, repo, runId]);
    const stopRunPolling = (run: WorkflowRun | null) => run?.status === 'completed';
    const { data: run, error: runError, loading: runLoading, refetch: refetchRun } = usePolling<WorkflowRun>(fetchRun, 3000, stopRunPolling);

    useEffect(() => {
        if (run?.workflow_id && !workflow) {
            const fetchWorkflowDetails = async () => {
                try {
                    setWorkflowError(null);
                    const workflowData = await githubService.getWorkflow(token, repo.owner.login, repo.name, run.workflow_id);
                    setWorkflow(workflowData);
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'An unknown error occurred';
                    console.error("Failed to fetch workflow details:", err);
                    setWorkflowError(message);
                }
            };
            fetchWorkflowDetails();
        }
    }, [run, workflow, token, repo]);

    const fetchJobs = React.useCallback(async () => {
        if (!run) return jobs;
        const { jobs: jobData } = await githubService.getWorkflowRunJobs(token, repo.owner.login, repo.name, runId);
        if (JSON.stringify(jobData) !== JSON.stringify(jobs)) {
            setJobs(jobData);
        }
        return jobData;
    }, [run, jobs, token, repo, runId]);
    
    const stopJobsPolling = () => run?.status === 'completed' && jobs.length > 0 && jobs.every(j => j.status === 'completed');
    usePolling<Job[]>(fetchJobs, 5000, stopJobsPolling);


    const fetchLogs = React.useCallback(async () => {
        if (!jobs || jobs.length === 0) return '';
        const firstJob = jobs[0];
        if (!firstJob) return '';
        const logData = await githubService.getJobLogs(token, repo.owner.login, repo.name, firstJob.id);
        setLogs(logData);
        return logData;
    }, [jobs, token, repo]);

    const stopLogPolling = () => run?.status === 'completed' && jobs.length > 0 && jobs.every(j => j.status === 'completed');
    usePolling<string>(fetchLogs, 4000, stopLogPolling);
    
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    const handlePreviewClick = async () => {
        if (!workflow) return;
        setPreviewOpen(true);
        setPreviewContent(null); // Show loading state in modal
        try {
            const content = await githubService.getRepoFileContent(token, repo.owner.login, repo.name, workflow.path);
            setPreviewContent(content);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Could not load file content.';
            setPreviewContent(`Error fetching workflow file:\n\n${message}`);
        }
    };

    const handleRefresh = () => {
        refetchRun();
        // The other polling hooks will automatically update as they depend on the `run` data
    };


    if (runLoading && !run) { // Show initial loading screen only
        return <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400"><Spinner className="h-8 w-8 mr-2" /> Fetching run details...</div>
    }

    if (runError && !run) {
        return <div className="text-red-700 dark:text-red-400 p-4 bg-red-100 dark:bg-red-900/50 rounded-md">Error fetching run details: {runError}</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Workflow Run Details</h2>
                <button
                    onClick={handleRefresh}
                    disabled={runLoading}
                    className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Refresh pipeline status"
                >
                    <InfinityIcon className={`h-5 w-5 text-gray-600 dark:text-gray-400 ${runLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {runError && run && (
                <div className="text-green-800 dark:text-green-200 p-3 bg-green-50 dark:bg-green-900/40 border border-green-300 dark:border-green-600 rounded-md text-sm flex items-center space-x-3">
                    <Spinner className="h-4 w-4 text-green-600 dark:text-green-400"/>
                    <div>
                        <p className="font-semibold">Auto-reconnecting...</p>
                        <p className="text-xs">A temporary network issue occurred. We'll keep trying in the background.</p>
                    </div>
                </div>
            )}
            
            {run ? (
                <>
                    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                                <StatusIcon status={run?.status ?? null} conclusion={run?.conclusion ?? null} className="h-8 w-8" />
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{run?.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Triggered by {run?.actor?.login} on branch <code className="bg-gray-200 dark:bg-gray-700 text-xs p-1 rounded-md">{run?.head_branch}</code>
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                                <div className="flex items-center space-x-4 text-sm">
                                     {workflow && run && (
                                        <>
                                            <button 
                                                onClick={handlePreviewClick}
                                                className="text-blue-600 dark:text-blue-500 hover:underline flex items-center space-x-1"
                                                title="Preview workflow file content"
                                            >
                                                <EyeIcon className="h-4 w-4" />
                                                <span>Preview</span>
                                            </button>
                                            <a 
                                                href={`https://github.com/${repo.full_name}/blob/${run.head_branch}/${workflow.path}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-blue-600 dark:text-blue-500 hover:underline"
                                                title={`View ${workflow.path.split('/').pop()}`}
                                            >
                                                View File
                                            </a>
                                        </>
                                    )}
                                    <a href={run?.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-500 hover:underline">
                                        View Run
                                    </a>
                                </div>
                                {workflowError && (
                                    <p className="text-xs text-red-500 dark:text-red-400 text-right">
                                        Couldn't load workflow file links: {workflowError}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {run.status === 'completed' && run.conclusion === 'failure' && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/40 border border-red-300 dark:border-red-500 rounded-lg flex space-x-3">
                            <div className="flex-shrink-0">
                                <InformationCircleIcon className="h-5 w-5 text-red-500 dark:text-red-400" />
                            </div>
                            <div className="text-sm text-red-800 dark:text-red-200">
                                <h4 className="font-semibold mb-1">Workflow Failed</h4>
                                <p className="mb-2">
                                    The workflow completed with a 'failure' status. Please review the logs below for specific error messages that can help identify the cause.
                                </p>
                                <ul className="list-disc list-inside text-xs space-y-1">
                                    <li>Check for errors in build scripts or test commands.</li>
                                    <li>Verify that all required secrets and environment variables are correctly configured in your repository settings.</li>
                                    <li>Ensure the workflow has the necessary permissions to access resources.</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h4 className="p-4 text-md font-semibold border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">Live Logs</h4>
                        <div ref={logContainerRef} className="h-96 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 rounded-b-lg font-mono text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {logs ? logs : 'Waiting for job to start and produce logs...'}
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 pt-10">
                    <p>No run data available.</p>
                </div>
            )}
             <WorkflowPreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setPreviewOpen(false)}
                filename={workflow?.path.split('/').pop() ?? 'Workflow File'}
                content={previewContent}
            />
        </div>
    );
};

export default WorkflowRunView;