import type { GitHubUser, Repository, Workflow, WorkflowRun, Job, RateLimitResponse } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

interface FileContent {
    content: string; // base64 encoded
    encoding: string;
}

const apiFetch = async <T,>(endpoint: string, token: string, options: RequestInit = {}): Promise<T> => {
    let response: Response;
    try {
        response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });
    } catch (error) {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            throw new Error('A network error occurred. Please check your internet connection and try again.');
        }
        // Re-throw other fetch-related errors
        throw error;
    }


    if (response.status === 204) {
        // Successful request with no content to return
        return null as T;
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response from GitHub API.' }));
        
        // Specific handling for rate limit errors
        if (response.status === 403 && errorData.message && errorData.message.includes('API rate limit exceeded')) {
            const resetTimestamp = response.headers.get('X-RateLimit-Reset');
            if (resetTimestamp) {
                const resetTime = new Date(parseInt(resetTimestamp, 10) * 1000);
                const timeString = resetTime.toLocaleTimeString();
                throw new Error(`You've hit the GitHub API rate limit. Please wait until ${timeString} before trying again.`);
            }
            throw new Error('You\'ve hit the GitHub API rate limit. Please wait a moment before trying again.');
        }

        throw new Error(errorData.message || `GitHub API error: ${response.status}`);
    }

    // Handle raw text responses (for logs)
    if (options.headers && (options.headers as any).Accept === 'application/vnd.github.v3.raw') {
        return response.text() as unknown as T;
    }
    
    // For successful responses with a body (e.g., 200, 201)
    return response.json();
};


export const getAuthenticatedUser = (token: string): Promise<GitHubUser> => {
  return apiFetch<GitHubUser>('/user', token);
};

export const getUserRepos = (token: string): Promise<Repository[]> => {
  return apiFetch<Repository[]>('/user/repos?sort=updated&per_page=100', token);
};

export const getRepoWorkflows = (token: string, owner: string, repo: string): Promise<{ workflows: Workflow[] }> => {
  return apiFetch<{ workflows: Workflow[] }>(`/repos/${owner}/${repo}/actions/workflows`, token);
};

export const getWorkflow = (token: string, owner: string, repo: string, workflowId: number): Promise<Workflow> => {
    return apiFetch<Workflow>(`/repos/${owner}/${repo}/actions/workflows/${workflowId}`, token);
};

export const triggerWorkflowDispatch = (token: string, owner: string, repo: string, workflowId: number, branch: string): Promise<void> => {
  return apiFetch<void>(`/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`, token, {
    method: 'POST',
    body: JSON.stringify({ ref: branch }),
  });
};

export const getWorkflowRuns = (token: string, owner: string, repo: string, workflowId: number, perPage?: number): Promise<{ workflow_runs: WorkflowRun[] }> => {
    const url = `/repos/${owner}/${repo}/actions/workflows/${workflowId}/runs${perPage ? `?per_page=${perPage}` : ''}`;
    return apiFetch<{ workflow_runs: WorkflowRun[] }>(url, token);
};

export const getWorkflowRun = (token: string, owner: string, repo: string, runId: number): Promise<WorkflowRun> => {
    return apiFetch<WorkflowRun>(`/repos/${owner}/${repo}/actions/runs/${runId}`, token);
};

export const getWorkflowRunJobs = (token: string, owner: string, repo: string, runId: number): Promise<{ jobs: Job[] }> => {
    return apiFetch<{ jobs: Job[] }>(`/repos/${owner}/${repo}/actions/runs/${runId}/jobs`, token);
};

export const getJobLogs = (token: string, owner: string, repo: string, jobId: number): Promise<string> => {
    return apiFetch<string>(`/repos/${owner}/${repo}/actions/jobs/${jobId}/logs`, token, {
        headers: { 'Accept': 'application/vnd.github.v3.raw' }
    });
};

export const getRepoFileContent = async (token: string, owner: string, repo: string, path: string): Promise<string> => {
    const response = await apiFetch<FileContent>(`/repos/${owner}/${repo}/contents/${path}`, token);
    if (response.encoding === 'base64') {
        return atob(response.content);
    }
    return response.content;
};

export const createWorkflowFile = async (
    token: string,
    owner: string,
    repo: string,
    path: string,
    content: string,
    commitMessage: string
): Promise<{ content: { html_url: string } }> => {
    try {
        const encodedContent = btoa(content);
        return await apiFetch<{ content: { html_url: string } }>(`/repos/${owner}/${repo}/contents/${path}`, token, {
            method: 'PUT',
            body: JSON.stringify({
                message: commitMessage,
                content: encodedContent,
            }),
        });
    } catch (error) {
        if (error instanceof Error && error.message.includes('"sha" wasn\'t supplied')) {
            throw new Error(`A workflow with this filename already exists. Please choose a different name.`);
        }
        throw error; // re-throw other errors
    }
};

export const getRateLimit = (token: string): Promise<RateLimitResponse> => {
    return apiFetch<RateLimitResponse>('/rate_limit', token);
};