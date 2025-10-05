"use client";

import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MapPin, Filter, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApi } from "@/hooks/use-api";
import { useState, useMemo, useEffect } from "react";
import { SwipeableStockCard } from "@/components/SwipeableStockCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { InfiniteScrollContainer } from "@/components/InfiniteScrollContainer";
import { StockSummarySkeleton } from "@/components/SkeletonLoaders";
import { NoStocksEmpty } from "@/components/EmptyStates";

interface Project {
  id: number;
  name: string;
  location: string;
}

interface Stock {
  id: number;
  name: string;
  unit: string;
  initialStock: string;
  projectId: number;
  projectName: string;
  projectLocation: string;
  stockIn: number;
  stockOut: number;
  currentStock: number;
  totalCapacity: number;
}

const StocksPage = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const { data: projects } = useApi<Project[]>('/api/operations/projects');
  
  // Use infinite scroll for stocks
  const {
    items: stocks,
    loading,
    hasMore,
    error,
    loadingRef,
    refresh
  } = useInfiniteScroll<Stock>(
    `/api/operations/stocks${selectedProjectId && selectedProjectId !== 'all' ? `?projectId=${selectedProjectId}` : ''}`,
    {
      pageSize: 10 // Smaller page size for stocks
    }
  );

  // Refresh infinite scroll when project selection changes
  useEffect(() => {
    refresh();
  }, [selectedProjectId, refresh]);

  const stocksWithStatus = useMemo(() => {
    if (!stocks) return [];
    
    return stocks.map(stock => {
      const percentage = stock.totalCapacity > 0 ? (stock.currentStock / stock.totalCapacity) * 100 : 0;
      let status = "Aman";
      let statusColor = "success";
      
      if (percentage < 20) {
        status = "Kritis";
        statusColor = "danger";
      } else if (percentage < 50) {
        status = "Perlu dipesan";
        statusColor = "warning";
      }
      
      return {
        ...stock,
        percentage,
        status,
        statusColor,
      };
    });
  }, [stocks]);

  const handleEditStock = (stock: any) => {
    // TODO: Implement edit stock functionality
    console.log('Edit stock:', stock);
  };

  const handleStockSettings = (stock: any) => {
    // TODO: Implement stock settings functionality
    console.log('Stock settings:', stock);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Manajemen Stok" />

      <div className="max-w-md mx-auto px-4 py-6 space-y-4 sm:space-y-6">
        {/* Project Selector */}
        <Card className="p-4 shadow-md bg-gradient-to-br from-card to-primary-light/10 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-display font-bold text-foreground">Lokasi Proyek</span>
          </div>
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="h-12 sm:h-11 bg-background text-left">
              <SelectValue placeholder="Pilih proyek" />
            </SelectTrigger>
            <SelectContent className="bg-card max-h-60">
              <SelectItem value="all" className="py-3">
                <span className="font-medium">Semua Proyek</span>
              </SelectItem>
              {projects?.map(project => (
                <SelectItem key={project.id} value={project.id.toString()} className="py-3">
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-sm">{project.name}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[250px]">{project.location}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        {/* Stock Summary */}
        <Card className="p-4 sm:p-6 shadow-lg border-primary/10 animate-slide-up">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h3 className="font-display font-bold text-foreground text-base sm:text-lg">Ringkasan Stok</h3>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
              {stocksWithStatus.length} Material
            </Badge>
          </div>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
                    <div className="h-4 bg-muted animate-pulse rounded w-16"></div>
                  </div>
                  <div className="h-3 bg-muted animate-pulse rounded w-full"></div>
                  <div className="h-3 bg-muted animate-pulse rounded w-20"></div>
                </div>
              ))}
            </div>
          ) : stocksWithStatus.length > 0 ? (
            <div className="space-y-4 sm:space-y-5">
              {stocksWithStatus.slice(0, 3).map((stock) => (
                <div key={stock.id}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground font-medium truncate flex-1 mr-2">{stock.name}</span>
                    <span className="font-bold text-foreground text-right">
                      {stock.currentStock}/{stock.totalCapacity} {stock.unit}
                    </span>
                  </div>
                  <Progress value={stock.percentage} className="h-3 sm:h-2.5 bg-muted" />
                  <p className={`text-xs font-medium mt-2 sm:mt-1.5 flex items-center gap-1 ${
                    stock.statusColor === 'danger' ? 'text-danger' : 
                    stock.statusColor === 'warning' ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {stock.statusColor === 'danger' && <AlertTriangle className="h-3 w-3" />}
                    {stock.percentage.toFixed(1)}% kapasitas
                    {stock.statusColor === 'danger' && ' - Stok menipis!'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Tidak ada data stok</p>
          )}
        </Card>

        {/* Material List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-foreground text-base sm:text-lg">Daftar Material</h3>
            <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:text-primary hover:border-primary text-xs">
              <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Filter
            </Button>
          </div>

          <InfiniteScrollContainer
            items={stocksWithStatus}
            loading={loading}
            hasMore={hasMore}
            error={error}
            loadingRef={loadingRef}
            onRefresh={refresh}
            skeletonType="stock"
            skeletonCount={4}
            emptyComponent={<NoStocksEmpty onRefresh={refresh} />}
            renderItem={(stock, index) => (
              <SwipeableStockCard
                key={stock.id}
                stock={stock}
                index={index}
                onEdit={handleEditStock}
                onSettings={handleStockSettings}
              />
            )}
          />
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default StocksPage;