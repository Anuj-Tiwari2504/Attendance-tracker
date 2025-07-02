
import React from 'react';
import { IconBook } from './Icon';

export const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center space-x-3">
                <IconBook className="h-8 w-8 text-indigo-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                    Colonel Library & Study Circle
                </h1>
            </div>
        </header>
    );
};
