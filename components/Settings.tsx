import React from 'react';
import { SunIcon, MoonIcon } from './icons';

interface SettingsProps {
    theme: string;
    toggleTheme: () => void;
    onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ theme, toggleTheme, onLogout }) => {
    return (
        <div className="p-6 md:p-10 text-gray-800 dark:text-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <div className="mt-8 space-y-8 max-w-2xl">
                
                {/* Theme Settings */}
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

                {/* Account Settings */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Account</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Manage your session and personal access token.
                    </p>
                     <div className="mt-4 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="font-medium">Personal Access Token</span>
                             <span className="text-xs text-gray-500">Your token is stored securely in your browser's local storage.</span>
                        </div>
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                        >
                            Clear Token & Logout
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;
