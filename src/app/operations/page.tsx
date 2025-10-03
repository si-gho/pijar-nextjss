"use client";

import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, User, TrendingUp, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import constructionSite1 from "@/assets/construction-site-1.jpg";
import constructionSite2 from "@/assets/construction-site-2.jpg";
import { useApi } from "@/hooks/use-api";
import { useEffect, useState } from "react";

interface Project {
  id: number;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
}

interface Transaction {
  id: number;
  type: 'in' | 'out';
  createdAt: string;
}

const OperationsPage = () => {
  const { data: projects } = useApi<Project[]>('/api/operations/projects');
  const { data: transactions } = useApi<Transaction[]>('/api/operations/transactions?limit=100');
  
  const [todayStats, setTodayStats] = useState({ totalTransactions: 0, activeProjects: 0 });

  useEffect(() => {
    if (transactions && projects) {
      const today = new Date().toDateString();
      const todayTransactions = transactions.filter(t => 
        new Date(t.createdAt).toDateString() === today
      );
      
      setTodayStats({
        totalTransactions: todayTransactions.length,
        activeProjects: projects.length,
      });
    }
  }, [transactions, projects]);
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Greeting Section */}
        <Card className="p-5 bg-gradient-to-br from-card to-primary-light/30 shadow-md border-primary/10 animate-fade-in">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground font-medium">Selamat datang,</p>
              <h2 className="text-2xl font-display font-bold text-foreground mt-1 mb-2">
                Operator Lapangan
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Apa yang ingin Anda lakukan hari ini?
              </p>
              
              {/* Quick Stats */}
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="bg-success/10 p-1.5 rounded">
                    <TrendingUp className="h-3.5 w-3.5 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Hari Ini</p>
                    <p className="text-sm font-semibold text-foreground">{todayStats.totalTransactions} Transaksi</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-1.5 rounded">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Aktif</p>
                    <p className="text-sm font-semibold text-foreground">{todayStats.activeProjects} Proyek</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-primary p-4 rounded-2xl shadow-md">
              <User className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
        </Card>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-2 gap-4 animate-slide-up">
          <Link href="/operations/in" className="block group">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-br from-success-light to-success/5 border-success/20 hover:scale-[1.02] hover:-translate-y-1">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="bg-success/20 p-5 rounded-3xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <ArrowDownCircle className="h-9 w-9 text-success stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground text-base">Lapor Masuk</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Material masuk proyek
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/operations/out" className="block group">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-br from-danger-light to-danger/5 border-danger/20 hover:scale-[1.02] hover:-translate-y-1">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="bg-danger/20 p-5 rounded-3xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <ArrowUpCircle className="h-9 w-9 text-danger stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground text-base">Lapor Keluar</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Material keluar proyek
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Active Projects Section */}
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-foreground text-lg">Proyek Aktif</h3>
            <Link href="/operations/histories" className="text-sm text-primary hover:underline font-semibold">
              Lihat Semua →
            </Link>
          </div>

          <div className="space-y-4">
            {projects && projects.length > 0 ? (
              projects.map((project, index) => (
                <Card key={project.id} className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-0 group">
                  <div className="relative h-40 overflow-hidden">
                    <Image 
                      src={index === 0 ? constructionSite1 : constructionSite2} 
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                    <div className="absolute inset-0 p-5 flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div className="bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <p className="text-xs text-primary-foreground font-semibold">{project.name}</p>
                        </div>
                        <div className="bg-success/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <p className="text-xs text-success-foreground font-bold">Aktif</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-white text-lg mb-1">
                          {project.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-white/90">
                          <MapPin className="h-3.5 w-3.5" />
                          <p className="text-sm font-medium">{project.location}</p>
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                          <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full font-medium">
                            Material Aktif
                          </span>
                          <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full font-medium">
                            Transaksi
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">Tidak ada proyek aktif</p>
              </Card>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default OperationsPage;