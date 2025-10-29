import React, { useState, useEffect, useCallback } from 'react';
import type { GitHubUser, Repository, Workflow, RateLimit } from '../types';
import * as githubService from '../services/githubService';
import RepoList from './RepoList';
import WorkflowList from './WorkflowList';
import WorkflowRunView from './WorkflowRunView';
import WorkflowGenerator from './WorkflowGenerator';
import Settings from './Settings';
import Documentation from './Documentation';
import WorkflowPreview from './WorkflowPreview';
import Sponsor from './Sponsor';
import RepoSelection from './RepoSelection';
import Support from './Support';
import { JetIcon, LogoutIcon, PlusIcon, RepoIcon, BookOpenIcon, CogIcon, ClockIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, InfinityIcon, HeartIcon, ChevronLeftIcon, QuestionMarkCircleIcon, CircleStackIcon } from './icons';
import LoadingScreen from './LoadingScreen';
import { useToasts } from '../hooks/useToasts';

interface DashboardProps {
  token: string;
  onLogout: () => void;
  theme: string;
  toggleTheme: () => void;
}

type Page = 'workflows' | 'documentation' | 'settings' | 'sponsor' | 'support';

const Dashboard: React.FC<DashboardProps> = ({ token, onLogout, theme, toggleTheme }) => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [activeRun, setActiveRun] = useState<{ repo: Repository, runId: number } | null>(null);
  const [workflowPreview, setWorkflowPreview] = useState<{ filename: string; content: string; html_url: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratorOpen, setGeneratorOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('workflows');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { addToast } = useToasts();
  const [pendingRuns, setPendingRuns] = useState<Map<number, { repo: Repository; workflowName: string }>>(new Map());
  const [rateLimit, setRateLimit] = useState<RateLimit | null>(null);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Reset state to ensure a clean refresh
      setSelectedRepo(null);
      setWorkflows([]);
      setActiveRun(null);
      setWorkflowPreview(null);
      setRateLimit(null);
      setRateLimitError(null);
      
      const [userData, repoData, rateLimitData] = await Promise.all([
        githubService.getAuthenticatedUser(token),
        githubService.getUserRepos(token),
        githubService.getRateLimit(token),
      ]);
      setUser(userData);
      setRepos(repoData);
      setRateLimit(rateLimitData.resources.core);

    } catch (err) {
      if (err instanceof Error) {
          setError(err.message);
          if(err.message.includes("Bad credentials")) {
              onLogout();
          }
      } else {
          setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [token, onLogout]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Background polling for notifications
  useEffect(() => {
    if (pendingRuns.size === 0) {
        return;
    }

    const intervalId = setInterval(async () => {
        const completedRunIds: number[] = [];

        for (const [runId, { repo, workflowName }] of pendingRuns.entries()) {
            try {
                const run = await githubService.getWorkflowRun(token, repo.owner.login, repo.name, runId);

                if (run.status === 'completed') {
                    addToast({
                        type: run.conclusion === 'success' ? 'success' : 'error',
                        message: `Workflow "${workflowName}" in ${repo.name} finished with status: ${run.conclusion}.`,
                    });
                    completedRunIds.push(runId);
                }
            } catch (error) {
                console.error(`Error polling for run ${runId}:`, error);
                // If a run can't be found (e.g., deleted), stop polling for it.
                if (error instanceof Error && error.message.includes('Not Found')) {
                    completedRunIds.push(runId);
                }
            }
        }

        if (completedRunIds.length > 0) {
            setPendingRuns(prev => {
                const newMap = new Map(prev);
                completedRunIds.forEach(id => newMap.delete(id));
                return newMap;
            });
        }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId);
  }, [pendingRuns, token, addToast]);


  const handleRepoSelect = useCallback(async (repo: Repository) => {
    setSelectedRepo(repo);
    setWorkflows([]);
    setActiveRun(null);
    setWorkflowPreview(null);
    setError(null);
    try {
      const { workflows: fetchedWorkflows } = await githubService.getRepoWorkflows(token, repo.owner.login, repo.name);
      
      const workflowsWithRuns = await Promise.all(fetchedWorkflows.map(async (workflow) => {
        try {
          // Fetch only the most recent run
          const { workflow_runs } = await githubService.getWorkflowRuns(token, repo.owner.login, repo.name, workflow.id, 1);
          return {
            ...workflow,
            lastRun: workflow_runs.length > 0 ? workflow_runs[0] : null
          };
        } catch (error) {
          console.error(`Failed to fetch runs for workflow ${workflow.name}`, error);
          return { ...workflow, lastRun: null };
        }
      }));
      
      setWorkflows(workflowsWithRuns);

    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to fetch workflows for ${repo.name}: ${err.message}`);
      }
    }
  }, [token]);
  
  const handleBackToRepos = () => {
    setSelectedRepo(null);
    setWorkflows([]);
    setActiveRun(null);
    setWorkflowPreview(null);
    setError(null);
  };

  const handleWorkflowRun = useCallback(async (workflow: Workflow) => {
      if (!selectedRepo) return;
      setError(null);
      setWorkflowPreview(null);
      
      addToast({
          type: 'info',
          message: `Triggering workflow: "${workflow.name}"...`
      });

      try {
          await githubService.triggerWorkflowDispatch(token, selectedRepo.owner.login, selectedRepo.name, workflow.id, 'main');
          
          // Wait a bit for the run to be created on GitHub's side
          await new Promise(resolve => setTimeout(resolve, 3000));

          const { workflow_runs } = await githubService.getWorkflowRuns(token, selectedRepo.owner.login, selectedRepo.name, workflow.id, 1);
          if (workflow_runs.length > 0) {
              const newRun = workflow_runs[0];
              setActiveRun({ repo: selectedRepo, runId: newRun.id });

              // Add to pending runs for background polling
              setPendingRuns(prev => {
                  const newMap = new Map(prev);
                  newMap.set(newRun.id, { repo: selectedRepo, workflowName: workflow.name });
                  return newMap;
              });
          } else {
               throw new Error("Could not find the newly triggered workflow run.");
          }
      } catch (err) {
           if (err instanceof Error) {
              setError(`Workflow action failed: ${err.message}`);
              addToast({ type: 'error', message: `Workflow action failed: ${err.message}` });
           }
      }
  }, [selectedRepo, token, addToast]);

  const handleCreateWorkflow = async (filename: string, content: string) => {
    if (!selectedRepo) return;
    try {
        const response = await githubService.createWorkflowFile(
            token,
            selectedRepo.owner.login,
            selectedRepo.name,
            `.github/workflows/${filename}`,
            content,
            `feat: add ${filename} workflow via AutoFlow`
        );
        setGeneratorOpen(false);
        setWorkflowPreview({
            filename,
            content,
            html_url: response.content.html_url,
        });
        setActiveRun(null);
        await handleRepoSelect(selectedRepo);
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(`Failed to create workflow: ${err.message}`);
        }
        throw new Error('An unknown error occurred while creating the workflow.');
    }
  };
  
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const renderPage = () => {
    switch (currentPage) {
        case 'documentation':
            return <Documentation />;
        case 'settings':
            return <Settings token={token} theme={theme} toggleTheme={toggleTheme} onLogout={onLogout} onRefreshData={fetchData} rateLimit={rateLimit} rateLimitError={rateLimitError} />;
        case 'sponsor':
            return <Sponsor />;
        case 'support':
            return <Support />;
        case 'workflows':
        default:
            if (!selectedRepo) {
                return <RepoSelection repos={repos} onRepoSelect={handleRepoSelect} />;
            }
            return (
                 <div className="flex-1 flex overflow-hidden">
                    <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-4 flex-shrink-0">
                             <div className="flex items-center space-x-2 min-w-0">
                                <button
                                    onClick={handleBackToRepos}
                                    title="Back to repositories"
                                    className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                                >
                                    <ChevronLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-400"/>
                                </button>
                                <h2 className="text-2xl font-bold truncate pr-2 text-gray-800 dark:text-white" title={selectedRepo.name}>
                                    {selectedRepo.name}
                                </h2>
                            </div>
                            <button
                                onClick={() => setGeneratorOpen(true)}
                                className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-blue-500 flex-shrink-0"
                            >
                                <PlusIcon className="h-5 w-5" />
                                <span>Generate</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                           <WorkflowList workflows={workflows} onWorkflowRun={handleWorkflowRun} />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                       {workflowPreview ? (
                            <WorkflowPreview
                                filename={workflowPreview.filename}
                                content={workflowPreview.content}
                                html_url={workflowPreview.html_url}
                            />
                        ) : (
                             <>
                                {activeRun ? (
                                    <WorkflowRunView token={token} repo={activeRun.repo} runId={activeRun.runId} />
                                ) : (
                                    <div className="text-gray-500 dark:text-gray-500 text-center mt-10">
                                         <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Workflow Run Details</h2>
                                        <p>Trigger a workflow to see its status and logs here.</p>
                                        <p className="text-sm mt-2">Or, select another workflow from the list on the left.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )
    }
  }


  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <aside className={`flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-80' : 'w-20'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-2 overflow-hidden">
            <JetIcon className="h-8 w-8 text-gray-900 dark:text-white flex-shrink-0" />
            {isSidebarOpen && <span className="text-xl font-semibold text-gray-900 dark:text-white whitespace-nowrap">AutoFlow</span>}
          </div>
          {isSidebarOpen && (
              <button onClick={onLogout} title="Logout" className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <LogoutIcon className="h-5 w-5 text-gray-500 dark:text-gray-400"/>
              </button>
          )}
        </div>
        
        <div className="flex-1 flex flex-col overflow-y-hidden">
            <div className="flex-1 overflow-y-auto">
                <nav className="p-4 space-y-2 border-b border-gray-200 dark:border-gray-700">
                    <button onClick={() => setCurrentPage('workflows')} title="Workflows" className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md ${!isSidebarOpen && 'justify-center'} ${currentPage === 'workflows' ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                        <RepoIcon className="h-5 w-5 flex-shrink-0" />
                        {isSidebarOpen && <span className="truncate">Workflows</span>}
                    </button>
                    <button onClick={() => setCurrentPage('documentation')} title="Documentation" className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md ${!isSidebarOpen && 'justify-center'} ${currentPage === 'documentation' ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                        <BookOpenIcon className="h-5 w-5 flex-shrink-0" />
                        {isSidebarOpen && <span className="truncate">Documentation</span>}
                    </button>
                    <button onClick={() => setCurrentPage('support')} title="Support" className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md ${!isSidebarOpen && 'justify-center'} ${currentPage === 'support' ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                        <QuestionMarkCircleIcon className="h-5 w-5 flex-shrink-0" />
                        {isSidebarOpen && <span className="truncate">Support</span>}
                    </button>
                    <button onClick={() => setCurrentPage('sponsor')} title="Sponsor" className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md ${!isSidebarOpen && 'justify-center'} ${currentPage === 'sponsor' ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                        <HeartIcon className="h-5 w-5 flex-shrink-0" />
                        {isSidebarOpen && <span className="truncate">Sponsor Us</span>}
                    </button>
                    <button onClick={() => setCurrentPage('settings')} title="Settings" className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md ${!isSidebarOpen && 'justify-center'} ${currentPage === 'settings' ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                        <CogIcon className="h-5 w-5 flex-shrink-0" />
                        {isSidebarOpen && <span className="truncate">Settings</span>}
                    </button>
                </nav>
        
                <div className="flex-1 overflow-y-auto">
                    {isSidebarOpen && error && (
                        error.includes('API rate limit exceeded') ? (
                            <div className="p-4 m-2 bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-500 text-yellow-800 dark:text-yellow-200 rounded-md text-sm flex items-start space-x-3">
                                <ClockIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold">Rate Limit Reached</p>
                                    <p>{error}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 m-2 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-500 text-red-700 dark:text-red-300 rounded-md text-sm">{error}</div>
                        )
                    )}
                    <RepoList repos={repos} onRepoSelect={handleRepoSelect} selectedRepo={selectedRepo} isSidebarOpen={isSidebarOpen} />
                </div>
            </div>

            <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={toggleSidebar}
                    className={`w-full flex items-center p-4 text-sm font-medium rounded-none text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
                    title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                >
                    {isSidebarOpen 
                        ? <ChevronDoubleLeftIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                        : <ChevronDoubleRightIcon className="h-5 w-5 flex-shrink-0" />
                    }
                    {isSidebarOpen && <span className="truncate">Collapse</span>}
                </button>
            </div>
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-end px-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center space-x-4">
                 {rateLimit && (
                    <div
                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
                        title={`API requests remaining. Resets at ${new Date(rateLimit.reset * 1000).toLocaleTimeString()}`}
                    >
                        <CircleStackIcon className="h-5 w-5" />
                        <span className="font-mono">{rateLimit.remaining} / {rateLimit.limit}</span>
                    </div>
                )}
                 <button
                    onClick={fetchData}
                    disabled={loading}
                    title="Refresh application data"
                    className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <InfinityIcon className="h-5 w-5" />
                </button>
                {user && (
                    <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.login}</span>
                        <img src={user.avatar_url} alt={user.login} className="h-8 w-8 rounded-full" />
                    </div>
                )}
            </div>
        </header>

       {renderPage()}
      </main>

       {selectedRepo && (
        <WorkflowGenerator
            isOpen={isGeneratorOpen}
            onClose={() => setGeneratorOpen(false)}
            onSubmit={handleCreateWorkflow}
            repo={selectedRepo}
        />
      )}
    </div>
  );
};

export default Dashboard;