import React from 'react';
import { SunIcon, MoonIcon, BellIcon, BellSlashIcon, CircleStackIcon, TrashIcon, InformationCircleIcon, JetIcon } from './icons';
import { useToasts } from '../hooks/useToasts';
import type { RateLimit } from '../types';

interface SettingsProps {
    token: string;
    theme: string;
    toggleTheme: () => void;
    onLogout: () => void;
    onRefreshData: () => Promise<void>;
    rateLimit: RateLimit | null;
    rateLimitError: string | null;
}

const ToggleSwitch: React.FC<{enabled: boolean, onChange: () => void}> = ({ enabled, onChange }) => (
  <button
    type="button"
    className={`${
      enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
    role="switch"
    aria-checked={enabled}
    onClick={onChange}
  >
    <span
      aria-hidden="true"
      className={`${
        enabled ? 'translate-x-5' : 'translate-x-0'
      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
    />
  </button>
);

const Settings: React.FC<SettingsProps> = ({ token, theme, toggleTheme, onLogout, onRefreshData, rateLimit, rateLimitError }) => {
    const { areNotificationsEnabled, toggleNotifications, addToast } = useToasts();
    
    const formatResetTime = (timestamp: number) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp * 1000).toLocaleTimeString();
    };

    const handleRefreshData = async () => {
        addToast({ type: 'info', message: 'Refreshing all application data...' });
        await onRefreshData();
    };


    return (
        <div className="p-6 md:p-10 text-gray-800 dark:text-gray-200 overflow-y-auto h-full">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
                
                {/* Column 1 */}
                <div className="space-y-8">
                    {/* Appearance Settings */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Choose how AutoFlow looks to you. Select a theme below.
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="font-medium">Theme</span>
                            <div className="flex items-center space-x-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <button
                                    onClick={() => theme !== 'light' && toggleTheme()}
                                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${theme === 'light' ? 'bg-white shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                >
                                    <SunIcon className="h-5 w-5 text-gray-700"/>
                                    <span>Light</span>
                                </button>
                                <button
                                    onClick={() => theme !== 'dark' && toggleTheme()}
                                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-gray-800 text-white shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                >
                                    <MoonIcon className="h-5 w-5 text-gray-300"/>
                                    <span>Dark</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Manage in-app toast notifications for workflow status updates.
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                {areNotificationsEnabled ? <BellIcon className="h-5 w-5"/> : <BellSlashIcon className="h-5 w-5"/>}
                                <span className="font-medium">Enable Notifications</span>
                            </div>
                            <ToggleSwitch enabled={areNotificationsEnabled} onChange={toggleNotifications} />
                        </div>
                    </div>

                     {/* About Section */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">About AutoFlow</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                           Information about the application and its source.
                        </p>
                        <div className="mt-4 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Version</span>
                                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">1.2.0</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">Source Code</span>
                                <a href="https://github.com/Gitasadhubs/autoflow-pakaims-final-year-project-" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 dark:text-blue-500 hover:underline inline-flex items-center gap-1.5">
                                    <JetIcon className="h-4 w-4" />
                                    <span>View on GitHub</span>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Column 2 */}
                <div className="space-y-8">
                    {/* Data & API Settings */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <div className="flex items-center space-x-3">
                            <CircleStackIcon className="h-6 w-6"/>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Data & API</h2>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Manage application data and view your current GitHub API usage.
                        </p>
                        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="font-medium">GitHub API Rate Limit</span>
                                    <span className="text-xs text-gray-500">The number of API requests you can make per hour.</span>
                                </div>
                                {rateLimit && (
                                    <div className="text-right">
                                        <p className="font-semibold text-lg">{rateLimit.remaining} <span className="text-sm text-gray-500">/ {rateLimit.limit}</span></p>
                                        <p className="text-xs text-gray-500">Resets at {formatResetTime(rateLimit.reset)}</p>
                                    </div>
                                )}
                            </div>
                             {rateLimitError && <p className="text-xs text-red-500 mt-2">{rateLimitError}</p>}
                        </div>
                        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                             <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="font-medium">Application Cache</span>
                                    <span className="text-xs text-gray-500">Force a full refresh of all repository and workflow data.</span>
                                </div>
                                <button
                                    onClick={handleRefreshData}
                                    className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                    <span>Clear & Refresh</span>
                                </button>
                            </div>
                        </div>
                    </div>


                    {/* Account Settings */}
                    <div className="bg-white dark:bg-gray-800 border border-red-300 dark:border-red-500/50 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">Danger Zone</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            These actions are irreversible. Please proceed with caution.
                        </p>
                        <div className="mt-4 flex items-center justify-between border-t border-red-200 dark:border-red-500/30 pt-4">
                            <div className="flex flex-col">
                                <span className="font-medium">Clear Token & Logout</span>
                                <span className="text-xs text-gray-500">This will remove your PAT from this browser and log you out.</span>
                            </div>
                            <button
                                onClick={onLogout}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;