import React from 'react';
import { MapPinIcon, EnvelopeIcon, PhoneIcon } from './icons';
import ContactForm from './ContactForm';

const Support: React.FC = () => {
    const contactInfo = [
        {
            icon: <MapPinIcon className="h-10 w-10 text-blue-500" />,
            title: "Our Office",
            details: "Lahore, Pakistan",
            isLink: false,
        },
        {
            icon: <EnvelopeIcon className="h-10 w-10 text-blue-500" />,
            title: "Email Us",
            details: "gasadmail@gmail.com",
            href: "mailto:gasadmail@gmail.com",
            isLink: true,
        },
        {
            icon: <PhoneIcon className="h-10 w-10 text-blue-500" />,
            title: "Call Us",
            details: "+92 3044463268",
            href: "tel:+923044463268",
            isLink: true,
        },
    ];

    return (
        <div className="p-6 md:p-10 text-gray-800 dark:text-gray-200 overflow-y-auto h-full">
            <div className="max-w-4xl w-full mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Get In Touch</h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                        We're here to help and answer any question you might have. We look forward to hearing from you!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {contactInfo.map((item, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center flex flex-col items-center">
                            <div className="mb-4">
                                {item.icon}
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h2>
                            {item.isLink ? (
                                <a href={item.href} className="text-blue-600 dark:text-blue-400 hover:underline break-all">
                                    {item.details}
                                </a>
                            ) : (
                                <p className="text-gray-600 dark:text-gray-400">{item.details}</p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="max-w-2xl mx-auto">
                     <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Or Send Us a Message Directly</h2>
                     <ContactForm />
                </div>
            </div>
        </div>
    );
};

export default Support;