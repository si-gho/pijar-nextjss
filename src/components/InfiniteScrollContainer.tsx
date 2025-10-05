"use client";

import { ReactNode, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TransactionCardSkeleton, StockCardSkeleton } from '@/components/SkeletonLoaders';
import { EmptyState, ErrorEmpty } from '@/components/EmptyStates';

interface InfiniteScrollContainerProps<T> {
  items: T[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  loadingRef: React.RefObject<HTMLDivElement>;
  onRefresh: () => void;
  renderItem: (item: T, index: number) => ReactNode;
  emptyMessage?: string;
  loadingMessage?: string;
  className?: string;
  skeletonType?: 'transaction' | 'stock';
  skeletonCount?: number;
  emptyComponent?: ReactNode;
}

// Helper function to get user-friendly error messages
const getErrorMessage = (error: string) => {
  if (!error) return '';
  
  const errorLower = error.toLowerCase();
  
  if (errorLower.includes('network') || errorLower.includes('fetch')) {
    return 'Koneksi internet bermasalah. Periksa koneksi Anda dan coba lagi.';
  }
  
  if (errorLower.includes('timeout')) {
    return 'Permintaan memakan waktu terlalu lama. Coba lagi dalam beberapa saat.';
  }
  
  if (errorLower.includes('500') || errorLower.includes('internal server')) {
    return 'Terjadi gangguan pada server. Tim teknis sedang menangani masalah ini.';
  }
  
  if (errorLower.includes('404') || errorLower.includes('not found')) {
    return 'Data tidak ditemukan. Silakan refresh halaman atau hubungi admin.';
  }
  
  if (errorLower.includes('401') || errorLower.includes('unauthorized')) {
    return 'Sesi Anda telah berakhir. Silakan login kembali.';
  }
  
  if (errorLower.includes('403') || errorLower.includes('forbidden')) {
    return 'Anda tidak memiliki akses untuk melihat data ini.';
  }
  
  // Default fallback message
  return 'Terjadi kesalahan saat memuat data. Silakan coba lagi atau hubungi admin jika masalah berlanjut.';
};

export function InfiniteScrollContainer<T>({
  items,
  loading,
  hasMore,
  error,
  loadingRef,
  onRefresh,
  renderItem,
  emptyMessage = "Tidak ada data",
  loadingMessage = "Memuat data...",
  className = "",
  skeletonType = 'transaction',
  skeletonCount = 3,
  emptyComponent
}: InfiniteScrollContainerProps<T>) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    onRefresh();
    // Reset refreshing state after a short delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Show initial loading state with skeletons
  if (loading && items.length === 0) {
    const SkeletonComponent = skeletonType === 'stock' ? StockCardSkeleton : TransactionCardSkeleton;
    
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <SkeletonComponent key={index} />
        ))}
      </div>
    );
  }

  // Show error state
  if (error && items.length === 0) {
    return (
      <ErrorEmpty
        title="Gagal Memuat Data"
        description={getErrorMessage(error)}
        onRetry={handleRefresh}
      />
    );
  }

  // Show empty state
  if (!loading && items.length === 0) {
    if (emptyComponent) {
      return <>{emptyComponent}</>;
    }
    
    return (
      <EmptyState
        icon={<span className="text-2xl">📋</span>}
        title="Tidak Ada Data"
        description={emptyMessage}
        action={{
          label: "Refresh",
          onClick: handleRefresh,
          variant: "outline"
        }}
      />
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Render items */}
      {items.map((item, index) => renderItem(item, index))}

      {/* Loading indicator for more items */}
      {hasMore && (
        <div ref={loadingRef} className="py-4">
          {loading && (
            <Card className="p-4 text-center">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Memuat lebih banyak...</p>
            </Card>
          )}
        </div>
      )}

      {/* End of data indicator */}
      {!hasMore && items.length > 0 && (
        <Card className="p-4 text-center bg-muted/30">
          <p className="text-sm text-muted-foreground">
            ✨ Semua data telah dimuat ({items.length} item)
          </p>
        </Card>
      )}

      {/* Error indicator for additional loads */}
      {error && items.length > 0 && (
        <Card className="p-4 text-center bg-destructive/10 border-destructive/20">
          <AlertCircle className="h-4 w-4 inline mr-2 text-destructive" />
          <span className="text-sm text-destructive">{error}</span>
          <Button 
            onClick={handleRefresh} 
            variant="ghost" 
            size="sm" 
            className="ml-2 h-auto p-1 text-destructive hover:text-destructive"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </Card>
      )}
    </div>
  );
}