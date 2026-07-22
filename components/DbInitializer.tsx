'use client';
import { useEffect } from 'react';

export default function DbInitializer() {
  useEffect(() => {
    const existing = localStorage.getItem('customersDB');
    if (!existing || JSON.parse(existing).length === 0) {
      fetch('/fixed_db.json')
        .then(res => res.json())
        .then(data => {
          localStorage.setItem('customersDB', JSON.stringify(data));
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('customerProfileUpdated'));
        })
        .catch(err => console.error('Failed to initialize DB:', err));
    }
  }, []);

  return null;
}
