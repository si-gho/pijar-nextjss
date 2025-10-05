"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Calendar, Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface Transaction {
  id: number;
  type: 'in' | 'out';
  quantity: string;
  unit: string;
  notes: string;
  createdAt: string;
  material: string;
  project: string;
  userName: string;
}

interface ExportButtonProps {
  transactions: Transaction[];
}

export function ExportButton({ transactions }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exportType, setExportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [isExporting, setIsExporting] = useState(false);

  const generateReport = () => {
    if (!transactions || transactions.length === 0) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }

    setIsExporting(true);

    try {
      // Filter data berdasarkan periode
      const now = new Date();
      let filteredTransactions = transactions;
      let periodLabel = '';

      switch (exportType) {
        case 'daily':
          const today = now.toLocaleDateString('id-ID', { 
            timeZone: 'Asia/Jakarta',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
          filteredTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.createdAt).toLocaleDateString('id-ID', { 
              timeZone: 'Asia/Jakarta',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            });
            return transactionDate === today;
          });
          periodLabel = `Harian - ${now.toLocaleDateString('id-ID', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}`;
          break;

        case 'weekly':
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          weekStart.setHours(0, 0, 0, 0);
          
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          weekEnd.setHours(23, 59, 59, 999);

          filteredTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.createdAt);
            return transactionDate >= weekStart && transactionDate <= weekEnd;
          });
          periodLabel = `Mingguan - ${weekStart.toLocaleDateString('id-ID')} s/d ${weekEnd.toLocaleDateString('id-ID')}`;
          break;

        case 'monthly':
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

          filteredTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.createdAt);
            return transactionDate >= monthStart && transactionDate <= monthEnd;
          });
          periodLabel = `Bulanan - ${now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`;
          break;
      }

      if (filteredTransactions.length === 0) {
        toast.error(`Tidak ada data transaksi untuk periode ${exportType === 'daily' ? 'hari ini' : exportType === 'weekly' ? 'minggu ini' : 'bulan ini'}`);
        return;
      }

      // Generate HTML content
      const htmlContent = generateHTMLReport(filteredTransactions, periodLabel);
      
      // Create and download file
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Laporan-Transaksi-${exportType}-${now.toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Laporan berhasil diekspor!", {
        description: `${filteredTransactions.length} transaksi telah diekspor`
      });

      setIsOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Gagal mengekspor laporan");
    } finally {
      setIsExporting(false);
    }
  };

  const generateHTMLReport = (data: Transaction[], period: string) => {
    const inTransactions = data.filter(t => t.type === 'in');
    const outTransactions = data.filter(t => t.type === 'out');

    return `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Transaksi Material - ${period}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e5e5; padding-bottom: 20px; }
        .summary { display: flex; justify-content: space-around; margin: 20px 0; }
        .summary-card { text-align: center; padding: 15px; border-radius: 8px; }
        .summary-in { background-color: #f0f9f0; border: 1px solid #4ade80; }
        .summary-out { background-color: #fef2f2; border: 1px solid #f87171; }
        .summary-number { font-size: 24px; font-weight: bold; margin: 5px 0; }
        .in-color { color: #16a34a; }
        .out-color { color: #dc2626; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e5e5; }
        th { background-color: #f8f9fa; font-weight: bold; }
        .transaction-in { border-left: 4px solid #16a34a; }
        .transaction-out { border-left: 4px solid #dc2626; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Transaksi Material</h1>
        <h2>Pijar Pro Pantau</h2>
        <p><strong>Periode:</strong> ${period}</p>
        <p><strong>Digenerate:</strong> ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB</p>
    </div>

    <div class="summary">
        <div class="summary-card summary-in">
            <div class="summary-number in-color">${inTransactions.length}</div>
            <div>Material Masuk</div>
        </div>
        <div class="summary-card summary-out">
            <div class="summary-number out-color">${outTransactions.length}</div>
            <div>Material Keluar</div>
        </div>
    </div>

    <h3>Detail Transaksi</h3>
    <table>
        <thead>
            <tr>
                <th>Waktu</th>
                <th>Tipe</th>
                <th>Material</th>
                <th>Jumlah</th>
                <th>Proyek</th>
                <th>Operator</th>
                <th>Catatan</th>
            </tr>
        </thead>
        <tbody>
            ${data.map(t => `
                <tr class="transaction-${t.type}">
                    <td>${new Date(t.createdAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</td>
                    <td><span class="${t.type}-color">${t.type === 'in' ? 'Masuk' : 'Keluar'}</span></td>
                    <td><strong>${t.material}</strong></td>
                    <td>${t.quantity} ${t.unit}</td>
                    <td>${t.project}</td>
                    <td>${t.userName || '-'}</td>
                    <td>${t.notes || '-'}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="footer">
        <p>Laporan ini digenerate otomatis oleh sistem Pijar Pro Pantau</p>
        <p>© 2024 Pijar Pro Pantau - Sistem Pantau Material Konstruksi</p>
    </div>
</body>
</html>`;
  };

  if (!isOpen) {
    return (
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    );
  }

  return (
    <>
      {typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl w-full max-w-md">
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="font-display font-bold text-foreground text-lg">
                    Export Laporan Transaksi
                  </h2>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Periode Laporan</label>
                <Select value={exportType} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setExportType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Harian (Hari Ini)
                      </div>
                    </SelectItem>
                    <SelectItem value="weekly">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Mingguan (Minggu Ini)
                      </div>
                    </SelectItem>
                    <SelectItem value="monthly">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Bulanan (Bulan Ini)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isExporting}>
                  Batal
                </Button>
                <Button onClick={generateReport} disabled={isExporting}>
                  {isExporting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Mengekspor...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export HTML
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}