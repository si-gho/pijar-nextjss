"use client";

import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle, ArrowUpCircle, Filter } from "lucide-react";
import { useMemo, useState } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { InfiniteScrollContainer } from "@/components/InfiniteScrollContainer";
import { ExportButton } from "@/components/ExportButton";
import { DateRangeSelector } from "@/components/DateRangeSelector";
import { SwipeableTransactionCard } from "@/components/SwipeableTransactionCard";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { NoTransactionsEmpty, NoSearchResultsEmpty, NoInTransactionsEmpty, NoOutTransactionsEmpty } from "@/components/EmptyStates";

interface Transaction {
  id: number;
  type: 'in' | 'out';
  quantity: string;
  unit: string;
  notes: string;
  createdAt: string;
  material: string;
  materialUnit: string;
  project: string;
  projectLocation: string;
  userName: string;
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

const HistoriesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<{ start: Date, end: Date, label: string }>({
    start: new Date(),
    end: new Date(),
    label: new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  });

  // Use infinite scroll hook
  const {
    items: transactions,
    loading,
    hasMore,
    error,
    loadingRef,
    refresh
  } = useInfiniteScroll<Transaction>('/api/operations/transactions', {
    pageSize: 15 // Load 15 items at a time for smooth scrolling
  });

  // Filter transaksi berdasarkan pencarian dan tanggal
  const filteredTransactions = useMemo(() => {
    if (!transactions || !Array.isArray(transactions)) return [];

    // Filter berdasarkan date range
    let filtered = transactions.filter(t => {
      const transactionDate = new Date(t.createdAt);
      const startOfDay = new Date(dateRange.start);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dateRange.end);
      endOfDay.setHours(23, 59, 59, 999);

      return transactionDate >= startOfDay && transactionDate <= endOfDay;
    });

    // Filter berdasarkan search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(t =>
        t.material?.toLowerCase().includes(query) ||
        t.project?.toLowerCase().includes(query) ||
        t.notes?.toLowerCase().includes(query) ||
        t.userName?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [transactions, searchQuery, dateRange]);

  // Menghitung transaksi hari ini berdasarkan tanggal dan tipe
  // Menghitung transaksi berdasarkan periode yang dipilih
  const { inCount, outCount } = useMemo(() => {
    return {
      inCount: filteredTransactions.filter(t => t.type === 'in').length,
      outCount: filteredTransactions.filter(t => t.type === 'out').length,
    };
  }, [filteredTransactions]);

  const handleDateRangeChange = (start: Date, end: Date, label: string) => {
    setDateRange({ start, end, label });
  };

  const handleEditTransaction = (transaction: Transaction) => {
    // TODO: Implement edit functionality
    console.log('Edit transaction:', transaction);
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    // TODO: Implement delete functionality
    console.log('Delete transaction:', transaction);
  };



  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Riwayat Transaksi" />

      <div className="max-w-md mx-auto px-4 py-6 space-y-5">
        {/* Date Navigation */}
        <Card className="p-4 shadow-md bg-gradient-to-br from-card to-primary-light/10 animate-fade-in">
          <DateRangeSelector onDateRangeChange={handleDateRangeChange} />
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 animate-slide-up">
          <Card className="p-4 bg-gradient-to-br from-success-light to-success/5 border-success/20">
            <div className="flex items-center gap-2 mb-1">
              <ArrowDownCircle className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground font-medium">Masuk</span>
            </div>
            <p className="text-2xl font-display font-bold text-success">
              {loading ? '...' : error ? '!' : inCount}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {error ? 'Error' : 'Transaksi'}
            </p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-danger-light to-danger/5 border-danger/20">
            <div className="flex items-center gap-2 mb-1">
              <ArrowUpCircle className="h-4 w-4 text-danger" />
              <span className="text-xs text-muted-foreground font-medium">Keluar</span>
            </div>
            <p className="text-2xl font-display font-bold text-danger">
              {loading ? '...' : error ? '!' : outCount}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {error ? 'Error' : 'Transaksi'}
            </p>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="p-4 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari material, proyek, atau catatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-11 bg-background"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery("")}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {searchQuery && (
            <p className="text-xs text-muted-foreground mt-2">
              Ditemukan {filteredTransactions.length} dari {transactions?.length || 0} transaksi
            </p>
          )}
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="p-4 bg-destructive/10 border-destructive/20">
            <div className="flex items-start gap-3">
              <div className="bg-destructive/20 p-2 rounded-lg flex-shrink-0">
                <ArrowDownCircle className="h-4 w-4 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive mb-1">Gagal Memuat Data</p>
                <p className="text-xs text-destructive/80">{getErrorMessage(error)}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid grid-cols-3 h-11 bg-muted/50">
              <TabsTrigger value="all" className="font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Semua
              </TabsTrigger>
              <TabsTrigger value="in" className="font-semibold data-[state=active]:bg-success data-[state=active]:text-success-foreground">
                Masuk
              </TabsTrigger>
              <TabsTrigger value="out" className="font-semibold data-[state=active]:bg-danger data-[state=active]:text-danger-foreground">
                Keluar
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
              <ExportButton transactions={transactions || []} />
            </div>
          </div>

          <TabsContent value="all" className="mt-4">
            <InfiniteScrollContainer
              items={filteredTransactions}
              loading={loading}
              hasMore={hasMore}
              error={error}
              loadingRef={loadingRef}
              onRefresh={refresh}
              skeletonType="transaction"
              skeletonCount={5}
              emptyComponent={
                searchQuery ? (
                  <NoSearchResultsEmpty 
                    searchQuery={searchQuery} 
                    onClearSearch={() => setSearchQuery("")} 
                  />
                ) : (
                  <NoTransactionsEmpty onRefresh={refresh} />
                )
              }
              renderItem={(item, index) => (
                <SwipeableTransactionCard
                  key={item.id}
                  transaction={item}
                  index={index}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                />
              )}
            />
          </TabsContent>

          <TabsContent value="in" className="mt-4">
            <InfiniteScrollContainer
              items={filteredTransactions.filter(h => h.type === "in")}
              loading={loading}
              hasMore={hasMore}
              error={error}
              loadingRef={loadingRef}
              onRefresh={refresh}
              skeletonType="transaction"
              skeletonCount={5}
              emptyComponent={<NoInTransactionsEmpty onRefresh={refresh} />}
              renderItem={(item, index) => (
                <SwipeableTransactionCard
                  key={item.id}
                  transaction={item}
                  index={index}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                />
              )}
            />
          </TabsContent>

          <TabsContent value="out" className="mt-4">
            <InfiniteScrollContainer
              items={filteredTransactions.filter(h => h.type === "out")}
              loading={loading}
              hasMore={hasMore}
              error={error}
              loadingRef={loadingRef}
              onRefresh={refresh}
              skeletonType="transaction"
              skeletonCount={5}
              emptyComponent={<NoOutTransactionsEmpty onRefresh={refresh} />}
              renderItem={(item, index) => (
                <SwipeableTransactionCard
                  key={item.id}
                  transaction={item}
                  index={index}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                />
              )}
            />
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default HistoriesPage;