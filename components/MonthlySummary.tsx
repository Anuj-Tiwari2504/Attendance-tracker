
import React, { useMemo, useState } from 'react';
import { AttendanceRecord } from '../types';
import { exportMonthlyReport } from '../services/pdfGenerator';
import { IconDownload } from './Icon';

interface MonthlySummaryProps {
    records: AttendanceRecord[];
}

export const MonthlySummary: React.FC<MonthlySummaryProps> = ({ records }) => {
    const monthlyData = useMemo(() => {
        const data: { [key: string]: { [name: string]: number } } = {};
        records.forEach(record => {
            const month = record.date.substring(0, 7); // YYYY-MM
            if (!data[month]) {
                data[month] = {};
            }
            data[month][record.name] = (data[month][record.name] || 0) + 1;
        });
        return data;
    }, [records]);

    const sortedMonths = Object.keys(monthlyData).sort().reverse();
    const [selectedMonth, setSelectedMonth] = useState(sortedMonths[0] || '');

    const handleExport = () => {
        if (!selectedMonth) return;
        const dataToExport = Object.entries(monthlyData[selectedMonth])
            .map(([name, count]) => ({ name, count }))
            .sort((a,b) => b.count - a.count);
        const monthName = new Date(selectedMonth + '-02').toLocaleString('default', { month: 'long', year: 'numeric' });
        exportMonthlyReport(monthName, dataToExport);
    };
    
    if (sortedMonths.length === 0) {
        return <p className="text-gray-500 text-center py-10">No data available for monthly summary.</p>;
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    {sortedMonths.map(month => (
                        <option key={month} value={month}>
                            {new Date(month + '-02').toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleExport}
                    disabled={!selectedMonth}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
                >
                    <IconDownload className="h-4 w-4 mr-2" />
                    Export Month
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white divide-y divide-gray-200 rounded-lg shadow-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance Count</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {selectedMonth && monthlyData[selectedMonth] &&
                            Object.entries(monthlyData[selectedMonth])
                                .sort(([, countA], [, countB]) => countB - countA)
                                .map(([name, count]) => (
                                    <tr key={name}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{count}</td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
