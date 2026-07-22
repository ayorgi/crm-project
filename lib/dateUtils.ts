/**
 * Unified Date Utility Module for DD/MM/YYYY Format
 */

export const parseDate = (dStr: string): Date => {
  if (!dStr) return new Date(0);
  const trimmed = dStr.trim();
  
  if (trimmed.includes('/')) {
    const parts = trimmed.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) return d;
    }
  }

  if (trimmed.includes('-')) {
    const parts = trimmed.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) return d;
    }
  }

  const fallback = new Date(trimmed);
  return isNaN(fallback.getTime()) ? new Date(0) : fallback;
};

export const getTimestamp = (dStr: string): number => {
  return parseDate(dStr).getTime();
};

export const formatDDMMYYYY = (dStr: string | Date): string => {
  if (!dStr) return '';
  if (dStr instanceof Date) {
    if (isNaN(dStr.getTime())) return '';
    const day = String(dStr.getDate()).padStart(2, '0');
    const month = String(dStr.getMonth() + 1).padStart(2, '0');
    const year = dStr.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  const d = parseDate(dStr);
  if (d.getTime() === 0) return dStr;
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatDateBadge = (dStr: string): { day: string; month: string } => {
  const d = parseDate(dStr);
  if (d.getTime() === 0) return { day: '--', month: '---' };
  
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = String(d.getDate()).padStart(2, '0');
  return { day, month };
};
