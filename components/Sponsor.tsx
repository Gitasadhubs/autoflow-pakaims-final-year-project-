import React from 'react';
import { HeartIcon, ExternalLinkIcon } from './icons';

const Sponsor: React.FC = () => {
    return (
        <div className="p-6 md:p-10 text-gray-800 dark:text-gray-200 overflow-y-auto h-full flex items-center justify-center">
            <div className="max-w-2xl w-full text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-10 shadow-lg">
                <div className="flex justify-center mb-4">
                    <HeartIcon className="h-16 w-16 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Support AutoFlow</h1>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                    AutoFlow is an open-source project dedicated to making DevOps accessible for students and beginner developers. Your support helps us dedicate more time to development, add new features, and maintain the project for the community.
                </p>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    If you find AutoFlow useful, please consider sponsoring the project on GitHub or connecting with the creator on LinkedIn. Let's build the future of developer tools together!
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                     <a
                        href="https://github.com/Gitasadhubs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center space-x-2 w-full sm:w-auto px-6 py-3 bg-gray-900 dark:bg-gray-800 text-white text-lg font-semibold rounded-md hover:bg-black dark:hover:bg-gray-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-gray-500"
                    >
                        <span>GitHub</span>
                        <ExternalLinkIcon className="h-5 w-5 ml-1" />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/asadkhan-dev/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center space-x-2 w-full sm:w-auto px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-blue-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        <span>LinkedIn</span>
                        <ExternalLinkIcon className="h-5 w-5 ml-1" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Sponsor;