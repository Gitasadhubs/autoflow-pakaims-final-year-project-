import React, { useState } from 'react';
import { JetIcon } from './icons';
import LoginBackground from './LoginBackground';

interface LoginProps {
  onLogin: (token: string) => void;
  theme: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, theme }) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onLogin(token.trim());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoginBackground theme={theme} />
      <div className="w-full max-w-md p-8 space-y-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl">
        <div className="flex flex-col items-center">
            <JetIcon className="text-gray-900 dark:text-white h-16 w-16" />
            <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900 dark:text-white">
                AutoFlow
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                Sign in with your GitHub Personal Access Token
            </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="token" className="sr-only">
                Personal Access Token
              </label>
              <input
                id="token"
                name="token"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 placeholder-gray-500 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="ghp_..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </div>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-500">
            AutoFlow requires a PAT with <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded-md text-gray-700 dark:text-gray-300">repo</code> and <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded-md text-gray-700 dark:text-gray-300">workflow</code> scopes. 
            <a href="https://github.com/settings/tokens/new?scopes=repo,workflow&description=AutoFlow%20Access%20Token" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400"> Create one here.</a>
            <p className="mt-2">This token is stored only in your browser's local storage.</p>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;