export interface ScheduledReport {
  id: string;
  templateType: string;
  title: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  time: string; // HH:mm format
  recipients: string[];
  workCategory: string;
  isActive: boolean;
  lastRun?: Date;
  nextRun?: Date;
  createdAt: Date;
}

const STORAGE_KEY = 'gia_scheduled_reports';

export const getScheduledReports = (): ScheduledReport[] => {
  if (typeof window === 'undefined') return [];
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  
  const reports = JSON.parse(saved);
  return reports.map((r: any) => ({
    ...r,
    createdAt: new Date(r.createdAt),
    lastRun: r.lastRun ? new Date(r.lastRun) : undefined,
    nextRun: r.nextRun ? new Date(r.nextRun) : undefined,
  }));
};

export const saveScheduledReport = (report: ScheduledReport): void => {
  if (typeof window === 'undefined') return;
  
  const reports = getScheduledReports();
  const index = reports.findIndex((r) => r.id === report.id);
  
  if (index >= 0) {
    reports[index] = report;
  } else {
    reports.push(report);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
};

export const deleteScheduledReport = (id: string): void => {
  if (typeof window === 'undefined') return;
  
  const reports = getScheduledReports().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
};

export const calculateNextRun = (
  frequency: 'daily' | 'weekly' | 'monthly',
  time: string,
  dayOfWeek?: number,
  dayOfMonth?: number
): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const next = new Date();
  
  next.setHours(hours, minutes, 0, 0);
  
  if (frequency === 'daily') {
    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }
  } else if (frequency === 'weekly' && dayOfWeek !== undefined) {
    const currentDay = next.getDay();
    let daysToAdd = dayOfWeek - currentDay;
    
    if (daysToAdd < 0 || (daysToAdd === 0 && next <= now)) {
      daysToAdd += 7;
    }
    
    next.setDate(next.getDate() + daysToAdd);
  } else if (frequency === 'monthly' && dayOfMonth !== undefined) {
    next.setDate(dayOfMonth);
    
    if (next <= now) {
      next.setMonth(next.getMonth() + 1);
    }
    
    // Handle months with fewer days
    while (next.getDate() !== dayOfMonth) {
      next.setDate(dayOfMonth);
      next.setMonth(next.getMonth() + 1);
    }
  }
  
  return next;
};

export const checkDueReports = (): ScheduledReport[] => {
  const reports = getScheduledReports();
  const now = new Date();
  
  return reports.filter((report) => {
    if (!report.isActive || !report.nextRun) return false;
    return report.nextRun <= now;
  });
};
