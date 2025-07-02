
import React, { useState } from 'react';

interface AttendanceFormProps {
    onAdd: (name: string, date: string) => void;
    memberNames: string[];
}

export const AttendanceForm: React.FC<AttendanceFormProps> = ({ onAdd, memberNames }) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setName(value);
        if (value) {
            setSuggestions(
                memberNames.filter(memberName =>
                    memberName.toLowerCase().includes(value.toLowerCase())
                ).slice(0, 5)
            );
        } else {
            setSuggestions([]);
        }
    };
    
    const handleSuggestionClick = (suggestion: string) => {
        setName(suggestion);
        setSuggestions([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(name, date);
        setName('');
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Log Attendance</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Member Name</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="e.g., John Doe"
                        autoComplete="off"
                    />
                    {suggestions.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-auto">
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-50"
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                    Add Record
                </button>
            </form>
        </div>
    );
};
