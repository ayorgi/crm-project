'use client';
import React from 'react';

interface ConfirmDeleteModalProps {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({ name, onConfirm, onCancel }: ConfirmDeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Remove Booking</h3>
        <p className="text-sm text-gray-500 mb-6">
          You are about to permanently remove <span className="font-semibold text-gray-800">{name}</span> from the system. This cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
