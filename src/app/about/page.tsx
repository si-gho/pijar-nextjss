import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tentang - PIJAR PRO',
  description: 'Informasi tentang PIJAR PRO - Sistem Pantau Material Konstruksi yang dikembangkan untuk memudahkan manajemen inventori proyek konstruksi.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tentang Pijar Inventory System
          </h1>
          <p className="text-gray-600">
            Solusi manajemen inventori yang mudah dan efisien
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Fitur Utama</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Manajemen stok real-time</li>
                <li>Tracking barang masuk & keluar</li>
                <li>Laporan dan analitik</li>
                <li>Interface yang user-friendly</li>
                <li>Export data ke PDF</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Teknologi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-600 space-y-1">
                <p>• Next.js 14 dengan App Router</p>
                <p>• TypeScript untuk type safety</p>
                <p>• Tailwind CSS untuk styling</p>
                <p>• Modern React patterns</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informasi Aplikasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-900">Versi</p>
                <p className="text-gray-600">1.0.0</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Release</p>
                <p className="text-gray-600">Oktober 2024</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Dikembangkan dengan dedikasi untuk memudahkan manajemen inventori konstruksi
              </p>
              <p className="text-xs text-gray-400 text-center mt-2">
                Built with ❤️ by [Nama Kamu]
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}