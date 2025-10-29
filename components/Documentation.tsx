import React from 'react';

const GraphicContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="my-6 flex justify-center items-center p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg not-prose">
        {children}
    </div>
);


const Documentation: React.FC = () => {
    return (
        <div className="p-6 md:p-10 text-gray-800 dark:text-gray-200 overflow-y-auto h-full">
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                    AutoFlow Documentation
                </h1>

                <section>
                    <h2 id="introduction">Introduction</h2>
                    <p>
                        Welcome to AutoFlow! This platform is designed to simplify the Continuous Integration and Continuous Deployment (CI/CD) process for student and beginner developers. By integrating directly with your GitHub account, AutoFlow allows you to discover, trigger, and even generate GitHub Actions workflows without writing complex configuration files.
                    </p>
                    <GraphicContainer>
                        <svg width="480" height="130" viewBox="0 0 480 130" className="text-gray-800 dark:text-gray-200">
                            <style>{`
                                .label { font-size: 11px; font-family: sans-serif; fill: currentColor; }
                                .title { font-size: 14px; font-weight: bold; font-family: sans-serif; fill: currentColor; }
                                .arrow-path { stroke: currentColor; stroke-width: 1.5; fill: none; marker-end: url(#arrowhead1); }
                                .box { fill: transparent; stroke: currentColor; stroke-width: 1.5; rx: 8; }
                            `}</style>
                            <defs>
                                <marker id="arrowhead1" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                                </marker>
                            </defs>
                            <text x="240" y="15" className="title" textAnchor="middle">High-Level Architecture</text>

                            {/* GitHub API */}
                            <g transform="translate(10, 35)">
                                <rect className="box" width="120" height="80" />
                                <text x="60" y="55" className="title" textAnchor="middle">GitHub API</text>
                                <path d="M40 70 h 40" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M45 78 h 30" stroke="currentColor" strokeWidth="1.5" />
                            </g>
                            
                            <path className="arrow-path" d="M140 75 h 50" />
                            <text x="165" y="65" className="label" textAnchor="middle">Data Flow</text>
                            
                            {/* AutoFlow Service */}
                            <g transform="translate(200, 35)">
                                <rect className="box" width="120" height="80" />
                                <text x="60" y="55" className="title" textAnchor="middle">AutoFlow Core</text>
                                <text x="60" y="75" className="label" textAnchor="middle">(API Service)</text>
                            </g>

                            <path className="arrow-path" d="M330 75 h 50" />
                            <text x="355" y="65" className="label" textAnchor="middle">State & Props</text>

                            {/* UI */}
                            <g transform="translate(390, 35)">
                                <rect className="box" width="120" height="80" />
                                <text x="60" y="55" className="title" textAnchor="middle">React UI</text>
                                <rect x="25" y="68" width="70" height="25" rx="3" fill="transparent" stroke="currentColor" strokeWidth="1" visibility="hidden" />
                                <text x="60" y="80" className="label" textAnchor="middle">Components</text>
                            </g>
                        </svg>
                    </GraphicContainer>
                </section>

                <section>
                    <h2 id="getting-started">Getting Started: GitHub Personal Access Token (PAT)</h2>
                    <p>
                        To use AutoFlow, you need to provide a GitHub Personal Access Token (PAT). This token is used to securely interact with the GitHub API on your behalf.
                    </p>
                    <GraphicContainer>
                        <svg width="400" height="180" viewBox="0 0 400 180" className="text-gray-800 dark:text-gray-200">
                            <style>{`
                                .label { font-size: 11px; font-family: sans-serif; fill: currentColor; text-anchor: middle; }
                                .title { font-size: 14px; font-weight: bold; font-family: sans-serif; fill: currentColor; text-anchor: middle; }
                                .arrow-path { stroke: currentColor; stroke-width: 1.5; fill: none; marker-end: url(#arrowhead2); }
                                .dashed-arrow { stroke: currentColor; stroke-width: 1.5; fill: none; marker-end: url(#arrowhead2); stroke-dasharray: 4, 4; }
                                .box { fill: transparent; stroke: currentColor; stroke-width: 1.5; rx: 8; }
                            `}</style>
                            <defs>
                                <marker id="arrowhead2" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="currentColor" /></marker>
                            </defs>

                            {/* User */}
                            <g transform="translate(20, 60)">
                                <circle cx="25" cy="25" r="20" className="box" />
                                <text x="25" y="30" className="title">👤</text>
                                <text x="25" y="60" className="label">Developer</text>
                            </g>

                            <path className="arrow-path" d="M70 85 h 30" />
                            <text x="85" y="75" className="label">Pastes PAT</text>

                            {/* Browser Box */}
                            <g transform="translate(110, 20)">
                                <rect className="box" width="180" height="140" />
                                <text x="200" y="15" className="label">Your Browser</text>
                                {/* AutoFlow UI */}
                                <rect x="20" y="30" width="140" height="40" rx="4" className="box" fill="currentColor" fillOpacity="0.05" />
                                <text x="90" y="55" className="title">AutoFlow UI</text>
                                {/* Local Storage */}
                                <path d="M90 75 v 20" className="dashed-arrow" />
                                <rect x="35" y="100" width="110" height="30" rx="4" className="box" />
                                <text x="90" y="120" className="label">Local Storage</text>
                                <text x="20" y="85" className="title" style={{fontSize: '24px'}}>🔒</text>
                            </g>
                            
                            <path className="arrow-path" d="M300 85 h 30" />
                            <text x="315" y="75" className="label">API Request</text>

                            {/* GitHub */}
                            <g transform="translate(340, 60)">
                                <circle cx="25" cy="25" r="20" className="box" />
                                <text x="25" y="30" className="title" style={{fontSize: '18px'}}>GH</text>
                                <text x="25" y="60" className="label">GitHub API</text>
                            </g>
                        </svg>
                    </GraphicContainer>
                    <p>
                        <strong>Important:</strong> Your token is stored exclusively in your browser's local storage and is never sent to any server other than GitHub's API.
                    </p>
                    <ol>
                        <li>
                            <strong>Create a new PAT:</strong> Go to the <a href="https://github.com/settings/tokens/new?scopes=repo,workflow&description=AutoFlow%20Access%20Token" target="_blank" rel="noopener noreferrer">New personal access token</a> page on GitHub. The required scopes will be pre-selected for you.
                        </li>
                        <li>
                            <strong>Verify required scopes:</strong> Ensure the following scopes are selected for AutoFlow to function correctly:
                            <ul>
                                <li>
                                    <code>repo</code>: This scope grants full control of private repositories. It's necessary for reading repository data, listing workflows, and creating new workflow files.
                                </li>
                                <li>
                                    <code>workflow</code>: This scope allows you to trigger workflow runs and manage them via the API.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>Generate and copy the token:</strong> After verifying the scopes, generate the token. GitHub will only show you the token once, so make sure to copy it to a safe place before navigating away.
                        </li>
                        <li>
                            <strong>Sign in to AutoFlow:</strong> Paste the copied token into the login screen on AutoFlow to get started.
                        </li>
                    </ol>
                </section>

                <section>
                    <h2 id="using-the-dashboard">Using the Dashboard</h2>
                    <p>
                        The main dashboard is divided into three parts: the repository list, the workflow list, and the workflow run view.
                    </p>
                    <GraphicContainer>
                        <svg width="350" height="250" viewBox="0 0 350 250" className="text-gray-800 dark:text-gray-200">
                            <style>{`
                                .label { font-size: 11px; font-family: sans-serif; fill: currentColor; text-anchor: middle; }
                                .title { font-size: 14px; font-weight: bold; font-family: sans-serif; fill: currentColor; text-anchor: middle; }
                                .arrow-path { stroke: currentColor; stroke-width: 1.5; fill: none; marker-end: url(#arrowhead3); }
                                .box { fill: transparent; stroke: currentColor; stroke-width: 1.5; rx: 8; }
                                .component { fill: transparent; stroke: currentColor; stroke-width: 1; rx: 4; stroke-dasharray: 3,3; }
                            `}</style>
                            <defs>
                                <marker id="arrowhead3" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="currentColor" /></marker>
                            </defs>

                            <rect className="box" x="5" y="5" width="340" height="240" />
                            <text x="175" y="25" className="title">Dashboard Component Architecture</text>

                            {/* Sidebar */}
                            <g transform="translate(20, 40)">
                                <rect className="component" width="120" height="190" />
                                <text x="60" y="20" className="title">Sidebar</text>
                                <rect x="10" y="40" width="100" height="130" className="box" fill="currentColor" fillOpacity="0.05" />
                                <text x="60" y="105" className="title">RepoList</text>
                            </g>
                            
                            <path className="arrow-path" d="M145 135 h 20" />
                            <text x="155" y="125" className="label" textAnchor="middle">Select Repo</text>
                            
                            {/* Main Content */}
                            <g transform="translate(170, 40)">
                                <rect className="component" width="160" height="190" />
                                <text x="80" y="20" className="title">Main Content</text>
                                
                                <rect x="10" y="40" width="140" height="60" className="box" fill="currentColor" fillOpacity="0.05" />
                                <text x="80" y="70" className="title">RepoSelection</text>
                                
                                <path d="M80 105 v 10" className="arrow-path" />
                                
                                <rect x="10" y="120" width="140" height="100" className="box" fill="currentColor" fillOpacity="0.05" />
                                <rect x="20" y="130" width="120" height="35" className="component" />
                                <text x="80" y="150" className="label">WorkflowList</text>
                                <rect x="20" y="175" width="120" height="35" className="component" />
                                <text x="80" y="195" className="label">WorkflowRunView</text>
                            </g>
                        </svg>
                    </GraphicContainer>
                    <ul>
                        <li><strong>Repository List:</strong> On the left, you'll see a list of your GitHub repositories. Select one to view its associated workflows.</li>
                        <li><strong>Workflow List:</strong> In the central panel, all active workflows for the selected repository are displayed. You can trigger any workflow that has the <code>workflow_dispatch</code> event.</li>
                        <li><strong>Generate Workflows:</strong> Click the "Generate" button to open a modal where you can create a new workflow file from a template.</li>
                        <li><strong>Workflow Run Details:</strong> When you run a workflow, the right-hand panel will come to life, showing you the real-time status and live logs of the job.</li>
                    </ul>
                </section>

                <section>
                    <h2 id="workflow-templates">Workflow Templates</h2>
                    <p>
                        AutoFlow provides production-ready CI/CD templates for popular platforms to accelerate your automation setup. These templates are designed for a typical Node.js project but can be easily adapted for other technology stacks.
                    </p>
                    <GraphicContainer>
                        <svg width="490" height="160" viewBox="0 0 490 160" className="text-gray-800 dark:text-gray-200">
                            <style>{`
                                .label { font-size: 11px; font-family: sans-serif; fill: currentColor; text-anchor: middle; }
                                .title { font-size: 14px; font-weight: bold; font-family: sans-serif; fill: currentColor; text-anchor: middle; }
                                .arrow-path { stroke: currentColor; stroke-width: 1.5; fill: none; marker-end: url(#arrowhead4); }
                                .box { fill: transparent; stroke: currentColor; stroke-width: 1.5; rx: 8; }
                                .code { font-family: monospace; font-size: 10px; }
                            `}</style>
                            <defs>
                                <marker id="arrowhead4" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="currentColor" /></marker>
                            </defs>
                            <text x="245" y="15" className="title" textAnchor="middle">Workflow Generation Process</text>
                            {/* User Action */}
                            <g transform="translate(10, 50)">
                                <rect className="box" width="130" height="60" />
                                <text x="65" y="70" className="title">User Action</text>
                                <text x="65" y="90" className="label">Selects Template</text>
                            </g>
                            
                            <path className="arrow-path" d="M150 80 h 40" />
                            
                            {/* AutoFlow Logic */}
                            <g transform="translate(200, 50)">
                                <rect className="box" width="130" height="60" />
                                <text x="65" y="70" className="title">AutoFlow Logic</text>
                                <text x="65" y="90" className="label">Generates .yml file</text>
                            </g>
                            
                            <path className="arrow-path" d="M340 80 h 40" />
                            <text x="360" y="70" className="label code">PUT /repos/.../contents/</text>

                            {/* GitHub Repo */}
                            <g transform="translate(390, 50)">
                                <rect className="box" width="130" height="60" />
                                <text x="65" y="70" className="title">GitHub Repo</text>
                                <text x="65" y="90" className="label code">.github/workflows/...</text>
                            </g>
                        </svg>
                    </GraphicContainer>
                    <p>
                        When you generate a workflow, AutoFlow creates a fully functional <code>.yml</code> file in your repository's <code>.github/workflows</code> directory. To complete the setup, you'll need to add the required API tokens and identifiers as secrets in your GitHub repository.
                    </p>
                    <h3 id="nodejs-pipeline">Node.js CI/CD Pipeline</h3>
                    <p>
                        The provided templates share a common foundation for building and testing a Node.js application. The <code>build-and-test</code> job will:
                    </p>
                    <ul>
                        <li>Check out your source code.</li>
                        <li>Set up a specific Node.js version (e.g., 20.x).</li>
                        <li>Install dependencies securely using <code>npm ci</code>.</li>
                        <li>Run your build script (<code>npm run build</code>) if it exists.</li>
                        <li>Execute your test suite with <code>npm test</code>.</li>
                    </ul>
                    <p>
                        Only after this job succeeds will the deployment job begin.
                    </p>
                    <h3 id="deployment-templates">Deployment Templates</h3>
                    <h4>Deploying to Vercel</h4>
                    <p>
                        The Vercel template uses the <code>amondnet/vercel-action@v20</code> action to deploy your project. To make it work, you must add the following secrets to your GitHub repository under <code className="text-sm">Settings &gt; Secrets and variables &gt; Actions</code>:
                    </p>
                     <ul>
                        <li><code>VERCEL_TOKEN</code>: Your Vercel account token.</li>
                        <li><code>VERCEL_ORG_ID</code>: The ID of your organization on Vercel.</li>
                        <li><code>VERCEL_PROJECT_ID</code>: The ID of the specific project you are deploying.</li>
                    </ul>

                    <h4>Deploying to Railway</h4>
                    <p>
                        The Railway template uses the <code>railwayapp/cli-action@v1</code> for deployment. You will need to add one secret to your GitHub repository:
                    </p>
                     <ul>
                        <li><code>RAILWAY_TOKEN</code>: Your Railway account token, which grants access to deploy to your projects.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default Documentation;