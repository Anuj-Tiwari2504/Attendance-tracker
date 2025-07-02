
import { useState, useEffect, useCallback } from 'react';
import { AttendanceRecord } from '../types';

const STORAGE_KEY = 'attendanceRecords';

export const useAttendance = () => {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const storedRecords = localStorage.getItem(STORAGE_KEY);
            if (storedRecords) {
                setRecords(JSON.parse(storedRecords));
            }
        } catch (err) {
            setError('Failed to load data from storage.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        } catch (err) {
            setError('Failed to save data. Changes may not persist.');
            console.error(err);
        }
    }, [records]);

    const addRecord = useCallback((name: string, date: string) => {
        if (!name.trim() || !date) {
            setError('Name and date cannot be empty.');
            return;
        }
        const newRecord: AttendanceRecord = {
            id: new Date().toISOString() + Math.random(),
            name: name.trim(),
            date,
        };
        setRecords(prevRecords => [...prevRecords, newRecord].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setError(null);
    }, []);

    const deleteRecord = useCallback((id: string) => {
        setRecords(prevRecords => prevRecords.filter(record => record.id !== id));
    }, []);

    return { records, addRecord, deleteRecord, loading, error };
};
