
import React from 'react';
import { AttendanceRecord } from '../types';
import { exportFullReport } from '../services/pdfGenerator';
import { IconTrash, IconDownload, IconUserCircle } from './Icon';

interface AttendanceListProps {
    records: AttendanceRecord[];
    onDelete: (id: string) => void;
}

export const AttendanceList: React.FC<AttendanceListProps> = ({ records, onDelete }) => {
    if (records.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500">No attendance records yet.</p>
                <p className="text-sm text-gray-400">Add a record using the form to get started.</p>
            </div>
        );
    }
    
    return (
        <div>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => exportFullReport(records)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    <IconDownload className="h-4 w-4 mr-2" />
                    Export All to PDF
                </button>
            </div>
            <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {records.map(record => (
                    <li key={record.id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center transition-transform hover:scale-[1.02]">
                        <div className="flex items-center">
                             <IconUserCircle className="h-8 w-8 text-gray-400 mr-4" />
                             <div>
                                <p className="font-semibold text-gray-800">{record.name}</p>
                                <p className="text-sm text-gray-500">{new Date(record.date + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                             </div>
                        </div>
                        <button onClick={() => onDelete(record.id)} className="p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors">
                            <IconTrash className="h-5 w-5" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
