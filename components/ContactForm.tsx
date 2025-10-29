import React, { useState } from 'react';
import { Spinner, EnvelopeIcon, CheckCircleIcon, XCircleIcon } from './icons';

const ContactForm: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<{ submitting: boolean; error: string | null; success: boolean }>({
        submitting: false,
        error: null,
        success: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ submitting: true, error: null, success: false });

        // Simulate an API call
        setTimeout(() => {
            // Simulate a random success/failure
            if (Math.random() > 0.1) { // 90% success rate
                setStatus({ submitting: false, error: null, success: true });
                setName('');
                setEmail('');
                setMessage('');
            } else {
                setStatus({
                    submitting: false,
                    error: 'An unexpected error occurred. Please try again later.',
                    success: false,
                });
            }
        }, 1500);
    };

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
                {status.success && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/40 border border-green-300 dark:border-green-600 rounded-lg flex items-center space-x-3 text-green-800 dark:text-green-200">
                        <CheckCircleIcon className="h-6 w-6" />
                        <div>
                            <h4 className="font-semibold">Message Sent!</h4>
                            <p className="text-sm">Thanks for reaching out. We'll get back to you shortly.</p>
                        </div>
                    </div>
                )}
                 {status.error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/40 border border-red-300 dark:border-red-500 rounded-lg flex items-center space-x-3 text-red-800 dark:text-red-200">
                        <XCircleIcon className="h-6 w-6" />
                        <div>
                             <h4 className="font-semibold">Submission Failed</h4>
                             <p className="text-sm">{status.error}</p>
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 placeholder-gray-500 text-gray-900 dark:text-gray-200 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 placeholder-gray-500 text-gray-900 dark:text-gray-200 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Message
                    </label>
                    <textarea
                        name="message"
                        id="message"
                        rows={5}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 placeholder-gray-500 text-gray-900 dark:text-gray-200 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="How can we help you?"
                    ></textarea>
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={status.submitting}
                        className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 dark:disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors"
                    >
                        {status.submitting ? (
                            <>
                                <Spinner className="h-5 w-5" />
                                <span>Submitting...</span>
                            </>
                        ) : (
                             <>
                                <EnvelopeIcon className="h-5 w-5" />
                                <span>Send Message</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;
