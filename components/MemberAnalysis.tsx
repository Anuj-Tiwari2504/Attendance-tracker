
import React, { useState, useMemo } from 'react';
import { AttendanceRecord } from '../types';
import { exportMemberReport } from '../services/pdfGenerator';
import { IconDownload, IconUserCircle } from './Icon';

interface MemberAnalysisProps {
    records: AttendanceRecord[];
    memberNames: string[];
}

export const MemberAnalysis: React.FC<MemberAnalysisProps> = ({ records, memberNames }) => {
    const [selectedMember, setSelectedMember] = useState('');

    const memberRecords = useMemo(() => {
        if (!selectedMember) return [];
        return records.filter(r => r.name === selectedMember);
    }, [selectedMember, records]);
    
    const handleExport = () => {
        if (!selectedMember) return;
        exportMemberReport(selectedMember, memberRecords);
    };

    if (memberNames.length === 0) {
        return <p className="text-gray-500 text-center py-10">No members found. Add some attendance records first.</p>;
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <select
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="">-- Select a Member --</option>
                    {memberNames.sort().map(name => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
                <button
                    onClick={handleExport}
                    disabled={!selectedMember || memberRecords.length === 0}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
                >
                    <IconDownload className="h-4 w-4 mr-2" />
                    Export Member Data
                </button>
            </div>
            
            {selectedMember ? (
                memberRecords.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    <p className="font-semibold text-gray-700">Total attendance for {selectedMember}: {memberRecords.length}</p>
                     {memberRecords.map(record => (
                        <div key={record.id} className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                           <IconUserCircle className="h-6 w-6 text-gray-400 mr-3" />
                           <p className="text-sm text-gray-600">{new Date(record.date + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                     ))}
                </div>
                 ) : (
                    <p className="text-gray-500 text-center py-10">No records found for {selectedMember}.</p>
                 )
            ) : (
                <p className="text-gray-500 text-center py-10">Please select a member to view their attendance history.</p>
            )}
        </div>
    );
};
