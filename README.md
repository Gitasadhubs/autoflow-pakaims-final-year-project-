
# AutoFlow: 

**Simplify your CI/CD pipeline with a developer-friendly dashboard for GitHub Actions.**

AutoFlow provides a robust web interface to connect with your GitHub account, manage repositories, and interact with GitHub Actions workflows. Go from code to deployment with powerful automation tools, live feedback, and an intuitive user experience.

---

## ✨ Core Features

*   **Secure GitHub Integration**: Authenticate securely using a GitHub Personal Access Token (PAT) with `repo` and `workflow` scopes. Your token is stored exclusively in your browser.
*   **Real-time Repository Fetching**: Instantly view and filter through all your public and private repositories.
*   **Dynamic Workflow Management**: Automatically discover all active workflows (`.yml` files) within your selected repository.
*   **One-Click Workflow Triggering**: Manually run any workflow configured with a `workflow_dispatch` event directly from the UI.
*   **Live Log Streaming**: Monitor your workflow runs in real-time with a live-updating log viewer that streams output directly from the GitHub API.
*   **Intelligent Workflow Generation**: Create complete, production-ready CI/CD pipelines for Vercel and Railway with a single click using pre-built templates.
*   **Modern & Responsive UI**: Enjoy a clean, GitHub-inspired interface with a collapsible sidebar, light/dark modes, and a focus on usability.
*   **Detailed Run Views**: Get comprehensive details for each workflow run, including status, conclusion, trigger information, and links to GitHub.

## 🚀 Tech Stack

AutoFlow is built with modern, industry-standard frontend technologies.

| Technology      | Description                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------- |
| **React**       | A JavaScript library for building user interfaces, used for its component-based architecture and performance.     |
| **TypeScript**  | A typed superset of JavaScript that enhances code quality and maintainability.                                  |
| **Tailwind CSS**| A utility-first CSS framework for rapidly building custom, responsive designs.                                  |
| **GitHub API**  | Powers all core functionality, including authentication, data fetching, and workflow interactions.              |

## 🏁 Getting Started

Follow these steps to set up and run AutoFlow on your local machine.

### Prerequisites

*   **Node.js**: Version 16.x or later.
*   **npm** or **yarn**: A package manager for Node.js.
*   **A GitHub Account**

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/autoflow.git
cd autoflow
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Create a GitHub Personal Access Token (PAT)

AutoFlow requires a PAT to communicate with the GitHub API.

1.  Navigate to the **[New Personal Access Token](https://github.com/settings/tokens/new)** page on GitHub.
2.  Give your token a descriptive name (e.g., "AutoFlow Access").
3.  Set an expiration date.
4.  Ensure the following scopes are selected:
    *   ✅ **`repo`**: Grants full control of private repositories. Required for reading repo data and creating workflow files.
    *   ✅ **`workflow`**: Grants permission to add and modify GitHub Actions workflows. Required for triggering workflow runs.
5.  Click **"Generate token"** and copy the token. **You will not be able to see it again.**

### 4. Run the Application

```bash
npm run start # Assumes a start script is defined in package.json
```

Open your browser to `http://localhost:3000`. Paste your GitHub PAT into the login field to begin using AutoFlow.

## 🛠️ How It Works

AutoFlow is a client-side application that interacts directly with the GitHub API. There is no backend server or database; all data is fetched in real-time and your token is stored securely in your browser's local storage.

*   **Authentication**: Upon login, the PAT is stored in `localStorage`. Every subsequent API request includes this token in the `Authorization` header.
*   **Data Fetching (`services/githubService.ts`)**: A dedicated service module handles all communication with the GitHub API endpoints for fetching user data, repositories, and workflows.
*   **State Management (`components/*.tsx`)**: React's component state and hooks (`useState`, `useEffect`, `useCallback`) are used to manage the application's state, including the current user, selected repository, and active workflow run.
*   **Workflow Generation (`components/WorkflowGenerator.tsx`)**: When you generate a workflow, the app makes a `PUT` request to the GitHub API's `contents` endpoint to create a new `.yml` file in the `.github/workflows/` directory of your chosen repository.
*   **Live Updates (`components/WorkflowRunView.tsx`)**: The application uses a custom polling hook to periodically fetch the status of a workflow run and its associated job logs until the run is complete, providing a near real-time view of the process.

## 📄 License

This project is licensed under the MIT License.
