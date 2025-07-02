import React, { useState, useMemo, useCallback } from 'react';
import { useAttendance } from './hooks/useAttendance';
import { Header } from './components/Header';
import { AttendanceForm } from './components/AttendanceForm';
import { AIAssistant } from './components/AIAssistant';
import { AttendanceList } from './components/AttendanceList';
import { MonthlySummary } from './components/MonthlySummary';
import { MemberAnalysis } from './components/MemberAnalysis';
import { Tab, AttendanceRecord } from './types';

const App: React.FC = () => {
    const { records, addRecord, deleteRecord, loading, error } = useAttendance();
    const [activeTab, setActiveTab] = useState<Tab>(Tab.Dashboard);

    const uniqueMemberNames = useMemo(() => {
        const names = new Set(records.map(r => r.name));
        return Array.from(names);
    }, [records]);

    const renderContent = useCallback(() => {
        switch (activeTab) {
            case Tab.Dashboard:
                return <AttendanceList records={records} onDelete={deleteRecord} />;
            case Tab.MonthlySummary:
                return <MonthlySummary records={records} />;
            case Tab.MemberAnalysis:
                return <MemberAnalysis records={records} memberNames={uniqueMemberNames} />;
            default:
                return <AttendanceList records={records} onDelete={deleteRecord} />;
        }
    }, [activeTab, records, deleteRecord, uniqueMemberNames]);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <Header />
            <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
                {loading && <div className="text-center p-4">Loading data...</div>}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-1 space-y-8">
                        <AttendanceForm onAdd={addRecord} memberNames={uniqueMemberNames} />
                        <AIAssistant records={records} />
                    </div>
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                           <div className="p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-800">Attendance Records</h2>
                                <p className="text-sm text-gray-500 mt-1">View, analyze, and manage attendance.</p>
                                <div className="mt-4 border-b border-gray-200">
                                    <nav className="-mb-px flex space-x-6">
                                        {(Object.keys(Tab) as Array<keyof typeof Tab>).map((key) => (
                                            <button
                                                key={key}
                                                onClick={() => setActiveTab(Tab[key])}
                                                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                                    activeTab === Tab[key]
                                                        ? 'border-indigo-500 text-indigo-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                            >
                                                {Tab[key]}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                           </div>
                           <div className="p-6 bg-gray-50/50">
                            {renderContent()}
                           </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;