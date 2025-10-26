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
                        AutoFlow provides starter CI/CD templates to help you get started with automating your projects. You can generate a workflow file that establishes a typical build, test, and deploy process.
                    </p>
                    <p>
                        The provided template is a starting point. You will need to customize the jobs with the specific commands and secrets required by your project and hosting provider (like Vercel, Railway, Firebase, etc.).
                    </p>
                    <h3 id="generic-pipeline">Generic CI/CD Pipeline</h3>
                    <p>
                        The templates generate a foundational pipeline that establishes a standard CI/CD process. It includes three sequential jobs:
                    </p>
                    <ul>
                        <li><strong>Build:</strong> Contains initial steps for checking out code and building the project.</li>
                        <li><strong>Test:</strong> Runs after a successful build, providing a stage for your testing commands.</li>
                        <li><strong>Deploy:</strong> Executes after tests pass, outlining the steps for a production deployment.</li>
                    </ul>
                    <p>
                        Each job includes placeholder commands (e.g., <code>echo "Building project..."</code>) that you will replace with your project's specific scripts for building, testing, and deploying.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Documentation;