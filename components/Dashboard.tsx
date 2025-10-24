import React, { useState, useEffect, useCallback } from 'react';
import type { GitHubUser, Repository, Workflow } from '../types';
import * as githubService from '../services/githubService';
import RepoList from './RepoList';
import WorkflowList from './WorkflowList';
import WorkflowRunView from './WorkflowRunView';
import WorkflowGenerator from './WorkflowGenerator';
import Settings from './Settings';
import Documentation from './Documentation';
import WorkflowPreview from './WorkflowPreview';
import { JetIcon, LogoutIcon, PlusIcon, RepoIcon, BookOpenIcon, CogIcon, ClockIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ExternalLinkIcon } from './icons';
import LoadingScreen from './LoadingScreen';

interface DashboardProps {
  token: string;
  onLogout: () => void;
  theme: string;
  toggleTheme: () => void;
}

type Page = 'workflows' | 'documentation' | 'settings';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [userData, repoData] = await Promise.all([
          githubService.getAuthenticatedUser(token),
          githubService.getUserRepos(token)
        ]);
        setUser(userData);
        setRepos(repoData);
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
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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

  const handleWorkflowRun = useCallback(async (workflow: Workflow) => {
      if (!selectedRepo) return;
      setError(null);
      setWorkflowPreview(null);
      try {
          await githubService.triggerWorkflowDispatch(token, selectedRepo.owner.login, selectedRepo.name, workflow.id, 'main');
          
          setTimeout(async () => {
              try {
                  const { workflow_runs } = await githubService.getWorkflowRuns(token, selectedRepo.owner.login, selectedRepo.name, workflow.id);
                  if (workflow_runs.length > 0) {
                      setActiveRun({ repo: selectedRepo, runId: workflow_runs[0].id });
                  }
              } catch (err) {
                  console.error("Error fetching workflow runs:", err);
              }
          }, 2000);

      } catch (err) {
           if (err instanceof Error) {
              setError(`Failed to trigger workflow: ${err.message}`);
           }
      }
  }, [selectedRepo, token]);

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
            return <Settings theme={theme} toggleTheme={toggleTheme} onLogout={onLogout} />;
        case 'workflows':
        default:
            return (
                 <div className="flex-1 flex overflow-hidden">
                    <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-4 flex-shrink-0">
                            <h2 className="text-2xl font-bold truncate pr-4 text-gray-800 dark:text-white">{selectedRepo ? `Workflows for ${selectedRepo.name}` : 'Select a Repository'}</h2>
                            {selectedRepo && (
                                <button
                                    onClick={() => setGeneratorOpen(true)}
                                    className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-blue-500"
                                >
                                    <PlusIcon className="h-5 w-5" />
                                    <span>Generate</span>
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {selectedRepo ? (
                                <WorkflowList workflows={workflows} onWorkflowRun={handleWorkflowRun} />
                            ) : (
                                <div className="text-gray-500 dark:text-gray-500 text-center mt-10">
                                    <p>Select a repository from the list on the left to see its available GitHub Actions workflows.</p>
                                </div>
                            )}
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
            {user && (
                <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.login}</span>
                    <img src={user.avatar_url} alt={user.login} className="h-8 w-8 rounded-full" />
                </div>
            )}
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