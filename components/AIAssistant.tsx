
import React, { useState, useCallback } from 'react';
import { getAiSummary } from '../services/geminiService';
import { AttendanceRecord } from '../types';
import { IconSparkles, IconPaperAirplane } from './Icon';

interface AIAssistantProps {
    records: AttendanceRecord[];
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ records }) => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleQuery = useCallback(async () => {
        if (!query.trim()) return;
        setIsLoading(true);
        setResponse('');
        const aiResponse = await getAiSummary(query, records);
        setResponse(aiResponse);
        setIsLoading(false);
    }, [query, records]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleQuery();
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
                <IconSparkles className="h-6 w-6 text-indigo-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-800">AI Assistant</h3>
            </div>
            <div className="space-y-4">
                <p className="text-sm text-gray-600">
                    Ask questions about the attendance data.
                    E.g., "Who attended most this month?" or "Summarize attendance for Jane Doe."
                </p>
                <div className="relative">
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full p-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        placeholder="Your question..."
                        rows={3}
                    />
                     <button
                        onClick={handleQuery}
                        disabled={isLoading}
                        className="absolute top-2 right-2 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
                        aria-label="Send Query"
                    >
                        <IconPaperAirplane className="h-4 w-4" />
                    </button>
                </div>
                {(isLoading || response) && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[80px]">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{response}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
