import React from 'react';

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
                </section>

                <section>
                    <h2 id="getting-started">Getting Started: GitHub Personal Access Token (PAT)</h2>
                    <p>
                        To use AutoFlow, you need to provide a GitHub Personal Access Token (PAT). This token is used to securely interact with the GitHub API on your behalf.
                    </p>
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
                        AutoFlow provides pre-configured CI/CD templates to help you deploy your applications quickly. The templates follow a standard Build &rarr; Test &rarr; Deploy pipeline structure.
                    </p>
                    <p>
                        For any of these templates to work, you must configure secrets in your GitHub repository settings under <strong>"Settings" &gt; "Secrets and variables" &gt; "Actions"</strong>.
                    </p>
                    
                    <h3 id="vercel-deploy">Deploy to Vercel</h3>
                    <p>
                        This template automates deployment of your project to Vercel's production environment. It triggers on every push to the <code>main</code> branch or when manually dispatched.
                    </p>
                    <h4>Required Secrets:</h4>
                    <ul>
                        <li>
                            <code>VERCEL_TOKEN</code>: Your Vercel account access token. You can generate one from your <a href="https://vercel.com/account/tokens" target="_blank" rel="noopener noreferrer">Vercel Account Settings</a>.
                        </li>
                        <li>
                            <code>VERCEL_ORG_ID</code>: Your Vercel organization/team ID. You can find this in the URL of your dashboard (<code>vercel.com/YOUR_ORG_ID</code>) or in your Vercel team settings under "General".
                        </li>
                        <li>
                           <code>VERCEL_PROJECT_ID</code>: The ID of the Vercel project you want to deploy to. This is found in your Vercel project's settings page under the "General" tab.
                        </li>
                    </ul>

                    <h3 id="railway-deploy">Deploy to Railway</h3>
                    <p>
                        This template automates deployment to a Railway project. It triggers on every push to the <code>main</code> branch or when manually dispatched.
                    </p>
                    <h4>Required Secrets:</h4>
                    <ul>
                        <li>
                            <code>RAILWAY_TOKEN</code>: Your Railway account token. You can generate one from your <a href="https://railway.app/account/tokens" target="_blank" rel="noopener noreferrer">Railway Account Tokens</a> page.
                        </li>
                         <li>
                           <code>RAILWAY_PROJECT_ID</code>: The ID of the Railway project you want to deploy to. You can find this in your project's settings page under "Variables".
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default Documentation;