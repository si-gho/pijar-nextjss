"use client";

import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, Filter, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApi } from "@/hooks/use-api";
import { useState, useMemo } from "react";

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
  const { data: stocks, loading } = useApi<Stock[]>(
    `/api/operations/stocks${selectedProjectId && selectedProjectId !== 'all' ? `?projectId=${selectedProjectId}` : ''}`
  );

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
            <p className="text-center text-muted-foreground py-8">Memuat data...</p>
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

          <div className="space-y-3">
            {loading ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">Memuat data...</p>
              </Card>
            ) : stocksWithStatus.length > 0 ? (
              stocksWithStatus.map((stock, index) => {
                const getStatusColor = () => {
                  if (stock.statusColor === "danger") return "bg-danger/10 text-danger border-danger/20";
                  if (stock.statusColor === "warning") return "bg-primary/10 text-primary border-primary/20";
                  return "bg-success/10 text-success border-success/20";
                };

                return (
                  <Card
                    key={stock.id}
                    className="p-4 sm:p-5 shadow-md hover:shadow-lg transition-all duration-300 group animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex gap-3 sm:gap-4">
                      <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-3 sm:p-4 rounded-2xl h-fit group-hover:scale-110 transition-transform duration-300">
                        <Package className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0 mr-3">
                            <h4 className="font-display font-bold text-foreground text-sm sm:text-base truncate">{stock.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{stock.unit}</p>
                            <p className="text-xs text-muted-foreground truncate">{stock.projectName}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="font-display font-bold text-foreground text-base sm:text-lg">
                              {stock.currentStock}
                            </span>
                            <span className="text-xs text-muted-foreground ml-1">
                              / {stock.totalCapacity}
                            </span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <Progress value={stock.percentage} className="h-2.5 sm:h-2 bg-muted" />
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`text-xs font-semibold ${getStatusColor()}`}>
                              {stock.status}
                            </Badge>
                          </div>
                          <Button variant="link" className="h-auto p-0 text-xs text-primary font-semibold hover:underline">
                            Detail →
                          </Button>
                        </div>

                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Masuk: {stock.stockIn}</span>
                          <span>Keluar: {stock.stockOut}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">Tidak ada data stok</p>
              </Card>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default StocksPage;