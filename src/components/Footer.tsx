import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-auto py-4 px-6 border-t border-gray-200 bg-gray-50">
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>
          © 2024 Pijar Inventory System
        </div>
        <div className="flex items-center gap-4">
          <span>Built with ❤️ by [Nama Kamu]</span>
          <span className="text-gray-300">|</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}