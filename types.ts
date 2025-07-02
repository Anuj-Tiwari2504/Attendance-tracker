
export interface AttendanceRecord {
    id: string;
    name: string;
    date: string; // YYYY-MM-DD format
}

export enum Tab {
    Dashboard = "Dashboard",
    MonthlySummary = "Monthly Summary",
    MemberAnalysis = "Member Analysis",
}
