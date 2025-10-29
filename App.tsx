import React, { useState, useCallback, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { ToastProvider } from './hooks/useToasts';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('github-pat'));
  const [theme, setTheme] = useState(localStorage.getItem('autoflow-theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('autoflow-theme', theme);
  }, [theme]);

  const handleLogin = useCallback((pat: string) => {
    localStorage.setItem('github-pat', pat);
    setToken(pat);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('github-pat');
    setToken(null);
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        {token ? (
          <Dashboard token={token} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
        ) : (
          <Login onLogin={handleLogin} theme={theme} />
        )}
      </div>
    </ToastProvider>
  );
};

export default App;