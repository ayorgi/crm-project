'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { apiFetch, transformBackendCustomers } from '@/lib/api';

export default function DbInitializer() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/login' || pathname?.startsWith('/login')) return;
    const token = localStorage.getItem('sanctum_token');
    if (!token) return;

    apiFetch('/customers')
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success' && Array.isArray(result.data)) {
          const customers = transformBackendCustomers(result.data);
          localStorage.setItem('customersDB', JSON.stringify(customers));
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('customerProfileUpdated'));
        }
      })
      .catch(err => console.error('Failed to initialize DB from Laravel API:', err));
  }, [pathname]);

  return null;
}




