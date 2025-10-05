"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search, Package, History, AlertCircle } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary";
  };
  className?: string;
}

export function EmptyState({ title, description, icon, action, className = "" }: EmptyStateProps) {
  return (
    <Card className={`p-8 text-center ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        {icon && (
          <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
            {icon}
          </div>
        )}
        <div className="space-y-2">
          <h3 className="font-display font-semibold text-foreground text-lg">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
            {description}
          </p>
        </div>
        {action && (
          <Button 
            onClick={action.onClick} 
            variant={action.variant || "outline"} 
            size="sm"
            className="mt-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {action.label}
          </Button>
        )}
      </div>
    </Card>
  );
}

export function NoTransactionsEmpty({ onRefresh }: { onRefresh: () => void }) {
  return (
    <EmptyState
      icon={<History className="h-8 w-8 text-muted-foreground" />}
      title="Belum Ada Transaksi"
      description="Belum ada aktivitas material yang tercatat. Mulai dengan melaporkan material masuk atau keluar proyek."
      action={{
        label: "Refresh",
        onClick: onRefresh,
        variant: "outline"
      }}
    />
  );
}

export function NoSearchResultsEmpty({ searchQuery, onClearSearch }: { 
  searchQuery: string; 
  onClearSearch: () => void; 
}) {
  return (
    <EmptyState
      icon={<Search className="h-8 w-8 text-muted-foreground" />}
      title="Tidak Ditemukan"
      description={`Tidak ada hasil untuk "${searchQuery}". Coba gunakan kata kunci yang berbeda atau periksa ejaan.`}
      action={{
        label: "Hapus Pencarian",
        onClick: onClearSearch,
        variant: "outline"
      }}
    />
  );
}

export function NoStocksEmpty({ onRefresh }: { onRefresh: () => void }) {
  return (
    <EmptyState
      icon={<Package className="h-8 w-8 text-muted-foreground" />}
      title="Belum Ada Data Stok"
      description="Belum ada material yang terdaftar dalam sistem. Tambahkan material baru untuk mulai mengelola inventori proyek."
      action={{
        label: "Refresh",
        onClick: onRefresh,
        variant: "outline"
      }}
    />
  );
}

export function NoProjectsEmpty({ onRefresh }: { onRefresh: () => void }) {
  return (
    <EmptyState
      icon={
        <div className="text-4xl">🏗️</div>
      }
      title="Belum Ada Proyek"
      description="Belum ada proyek yang terdaftar dalam sistem. Hubungi administrator untuk menambahkan proyek baru."
      action={{
        label: "Refresh",
        onClick: onRefresh,
        variant: "outline"
      }}
    />
  );
}

export function ErrorEmpty({ 
  title = "Terjadi Kesalahan", 
  description, 
  onRetry 
}: { 
  title?: string;
  description: string; 
  onRetry: () => void; 
}) {
  return (
    <EmptyState
      icon={<AlertCircle className="h-8 w-8 text-destructive" />}
      title={title}
      description={description}
      action={{
        label: "Coba Lagi",
        onClick: onRetry,
        variant: "outline"
      }}
      className="border-destructive/20 bg-destructive/5"
    />
  );
}

export function NoInTransactionsEmpty({ onRefresh }: { onRefresh: () => void }) {
  return (
    <EmptyState
      icon={
        <div className="text-4xl">📥</div>
      }
      title="Belum Ada Material Masuk"
      description="Belum ada laporan material masuk yang tercatat. Mulai dengan melaporkan material yang baru diterima proyek."
      action={{
        label: "Refresh",
        onClick: onRefresh,
        variant: "outline"
      }}
    />
  );
}

export function NoOutTransactionsEmpty({ onRefresh }: { onRefresh: () => void }) {
  return (
    <EmptyState
      icon={
        <div className="text-4xl">📤</div>
      }
      title="Belum Ada Material Keluar"
      description="Belum ada laporan material keluar yang tercatat. Catat penggunaan material untuk tracking yang lebih baik."
      action={{
        label: "Refresh",
        onClick: onRefresh,
        variant: "outline"
      }}
    />
  );
}