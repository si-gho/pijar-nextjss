"use client";

import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle, ArrowUpCircle, ChevronLeft, ChevronRight, Filter, Calendar } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { useMemo, useState } from "react";
import { ExportButton } from "@/components/ExportButton";
import { DateRangeSelector } from "@/components/DateRangeSelector";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

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

const HistoriesPage = () => {
  const { data: transactions, loading, error } = useApi<Transaction[]>('/api/operations/transactions');
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<{start: Date, end: Date, label: string}>({
    start: new Date(),
    end: new Date(),
    label: new Date().toLocaleDateString('id-ID', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta'
    }) + ' WIB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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
            <p className="text-sm text-destructive">Error: {error}</p>
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

          <TabsContent value="all" className="space-y-3 mt-4">
            {loading ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">Memuat data...</p>
              </Card>
            ) : filteredTransactions && filteredTransactions.length > 0 ? (
              filteredTransactions.map((item, index) => (
                <Card
                  key={item.id}
                  className={`p-4 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 animate-fade-in group cursor-pointer ${
                    item.type === "in" 
                      ? "border-l-success/60 hover:border-l-success bg-gradient-to-r from-success/5 to-transparent hover:from-success/10" 
                      : "border-l-danger/60 hover:border-l-danger bg-gradient-to-r from-danger/5 to-transparent hover:from-danger/10"
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex gap-4">
                    <div className={`p-3 rounded-xl h-fit shadow-sm transition-all group-hover:scale-105 ${
                      item.type === "in" ? "bg-success/10 group-hover:bg-success/20" : "bg-danger/10 group-hover:bg-danger/20"
                    }`}>
                      {item.type === "in" ? (
                        <ArrowDownCircle className="h-6 w-6 text-success" />
                      ) : (
                        <ArrowUpCircle className="h-6 w-6 text-danger" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-display font-bold text-foreground">
                            {item.material}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {item.quantity} {item.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-muted-foreground">{formatTime(item.createdAt)}</span>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDate(item.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <p className="text-sm text-muted-foreground">{item.project}</p>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10">
                          Detail
                        </Button>
                      </div>

                      {item.notes && (
                        <div className="mt-3 p-2 bg-muted/30 rounded-md border-l-2 border-muted-foreground/20">
                          <p className="text-xs text-muted-foreground italic leading-relaxed">
                            &ldquo;{item.notes}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : searchQuery ? (
              <Card className="p-6 text-center">
                <Search className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground font-medium">Tidak ditemukan</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Coba kata kunci lain atau hapus filter pencarian
                </p>
              </Card>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">Belum ada transaksi</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="in" className="space-y-3 mt-4">
            {filteredTransactions?.filter(h => h.type === "in").map((item, index) => (
              <Card
                key={item.id}
                className="p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-success animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex gap-4">
                  <div className="bg-success/10 p-3 rounded-xl h-fit shadow-sm">
                    <ArrowDownCircle className="h-6 w-6 text-success" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-display font-bold text-foreground">{item.material}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-muted-foreground">{formatTime(item.createdAt)}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{formatDate(item.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm text-muted-foreground">{item.project}</p>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10">
                        Detail
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="out" className="space-y-3 mt-4">
            {filteredTransactions?.filter(h => h.type === "out").map((item, index) => (
              <Card
                key={item.id}
                className="p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-danger animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex gap-4">
                  <div className="bg-danger/10 p-3 rounded-xl h-fit shadow-sm">
                    <ArrowUpCircle className="h-6 w-6 text-danger" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-display font-bold text-foreground">{item.material}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-muted-foreground">{formatTime(item.createdAt)}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{formatDate(item.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm text-muted-foreground">{item.project}</p>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10">
                        Detail
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default HistoriesPage;