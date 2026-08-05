/**
 * Centralized API helper.
 * Automatically attaches the Sanctum Bearer token from localStorage
 * to every request, and redirects to /login on 401 Unauthorized.
 */
import { formatDDMMYYYY } from './dateUtils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('sanctum_token');
}

export function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(`${API_BASE}${path}`, { ...options, headers }).then((res) => {
    if (res.status === 401) {
      localStorage.removeItem('sanctum_token');
      localStorage.removeItem('currentUser');
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return res;
  });
}

import { getVehiclePrice } from '@/lib/utils';

export function computeDynamicStatus(status: string | null, transferDate: string | null, transferTime: string | null): string {
  const currentStatus = status || 'Confirmed';
  if (currentStatus === 'Cancelled' || currentStatus === 'Pending') {
    return currentStatus;
  }

  if (!transferDate) return currentStatus;

  try {
    let dateStr = transferDate.trim();
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        dateStr = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }

    const timeStr = (transferTime && transferTime.trim()) ? transferTime.trim() : '12:00';
    const dateTimeStr = `${dateStr}T${timeStr.length === 5 ? timeStr + ':00' : timeStr}`;
    const transferStart = new Date(dateTimeStr);

    if (isNaN(transferStart.getTime())) {
      return currentStatus;
    }

    const now = new Date();
    const transferEnd = new Date(transferStart.getTime() + 2 * 60 * 60 * 1000);

    if (now < transferStart) {
      return currentStatus === 'In Transit' || currentStatus === 'Completed' ? 'Confirmed' : currentStatus;
    } else if (now >= transferStart && now <= transferEnd) {
      return 'In Transit';
    } else {
      return 'Completed';
    }
  } catch (e) {
    return currentStatus;
  }
}

export function transformBackendCustomers(apiData: any[]): any[] {
  if (!Array.isArray(apiData)) return [];
  const result = apiData.flatMap((item: any) => {
    const reservations = item.reservations || [];
    if (reservations.length === 0) {
      return [{
        id: item.id.toString(),
        customerId: item.id.toString(),
        rawId: typeof item.id === 'number' ? item.id : parseInt(item.id) || 0,
        rawResId: 0,
        firstName: item.first_name || '',
        lastName: item.last_name || '',
        email: item.email || '',
        phone: item.phone || '',
        company: item.company || '',
        customerType: item.customer_type || 'Individual VIP',
        status: 'New',
        createdAt: item.created_at ? formatDDMMYYYY(item.created_at) : '',
      }];
    }
    return reservations.map((r: any) => ({
      id: `${item.id}-${r.id}`,
      customerId: item.id.toString(),
      reservationId: r.id?.toString(),
      rawId: typeof item.id === 'number' ? item.id : parseInt(item.id) || 0,
      rawResId: typeof r.id === 'number' ? r.id : parseInt(r.id) || 0,
      firstName: item.first_name || '',
      lastName: item.last_name || '',
      email: item.email || '',
      phone: item.phone || '',
      company: item.company || '',
      customerType: item.customer_type || 'Individual VIP',
      status: computeDynamicStatus(r.status, r.transfer_date, r.transfer_time),
      vehicleType: r.vehicle_type || '',
      transferType: r.transfer_type || '',
      pickupLocation: r.pickup_location || '',
      dropoffLocation: r.dropoff_location || '',
      transferDate: r.transfer_date || '',
      transferTime: r.transfer_time || '',
      flightNumber: r.flight_number || '',
      passengers: r.passengers || 1,
      notes: r.notes || '',
      price: (r.price !== undefined && r.price !== null && r.price !== '') ? r.price : getVehiclePrice(r.vehicle_type || ''),
      createdAt: (r.created_at || item.created_at) ? formatDDMMYYYY(r.created_at || item.created_at) : '',
    }));
  });

  // Always place newest reservation at the top, regardless of customer age
  return result.sort((a: any, b: any) => {
    if (b.rawResId !== a.rawResId) return b.rawResId - a.rawResId;
    return b.rawId - a.rawId;
  });
}
