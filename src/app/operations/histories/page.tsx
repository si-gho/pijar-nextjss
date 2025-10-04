"use client";

import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle, ArrowUpCircle, ChevronLeft, ChevronRight, Filter, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/use-api";
import { useMemo } from "react";

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
  const { data: transactions, loading } = useApi<Transaction[]>('/api/operations/transactions');

  const { todayTransactions, inCount, outCount } = useMemo(() => {
    if (!transactions) return { todayTransactions: [], inCount: 0, outCount: 0 };
    
    const today = new Date().toDateString();
    const todayTrans = transactions.filter(t => 
      new Date(t.createdAt).toDateString() === today
    );
    
    return {
      todayTransactions: todayTrans,
      inCount: todayTrans.filter(t => t.type === 'in').length,
      outCount: todayTrans.filter(t => t.type === 'out').length,
    };
  }, [transactions]);

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
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <ChevronLeft className="h-5 w-5 text-primary" />
            </Button>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-display font-bold text-foreground">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
            </div>
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <ChevronRight className="h-5 w-5 text-primary" />
            </Button>
          </div>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 animate-slide-up">
          <Card className="p-4 bg-gradient-to-br from-success-light to-success/5 border-success/20">
            <div className="flex items-center gap-2 mb-1">
              <ArrowDownCircle className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground font-medium">Masuk</span>
            </div>
            <p className="text-2xl font-display font-bold text-success">{inCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Transaksi</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-danger-light to-danger/5 border-danger/20">
            <div className="flex items-center gap-2 mb-1">
              <ArrowUpCircle className="h-4 w-4 text-danger" />
              <span className="text-xs text-muted-foreground font-medium">Keluar</span>
            </div>
            <p className="text-2xl font-display font-bold text-danger">{outCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Transaksi</p>
          </Card>
        </div>

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
            <Button variant="outline" size="sm" className="ml-2">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <TabsContent value="all" className="space-y-3 mt-4">
            {loading ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">Memuat data...</p>
              </Card>
            ) : transactions && transactions.length > 0 ? (
              transactions.map((item, index) => (
                <Card 
                  key={item.id} 
                  className="p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 animate-fade-in" 
                  style={{ 
                    borderLeftColor: item.type === "in" ? "hsl(var(--success))" : "hsl(var(--danger))",
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div className="flex gap-4">
                    <div className={`p-3 rounded-xl h-fit shadow-sm ${
                      item.type === "in" ? "bg-success/10" : "bg-danger/10"
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
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">Belum ada transaksi</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="in" className="space-y-3 mt-4">
            {transactions?.filter(h => h.type === "in").map((item, index) => (
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
            {transactions?.filter(h => h.type === "out").map((item, index) => (
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