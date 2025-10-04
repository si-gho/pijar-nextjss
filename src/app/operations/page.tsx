"use client";

import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, User, TrendingUp, Clock, Users, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import constructionSite1 from "@/assets/construction-site-1.jpg";
import constructionSite2 from "@/assets/construction-site-2.jpg";
import { useApi } from "@/hooks/use-api";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface Project {
  id: number;
  name: string;
  location: string;
  status: string;
  createdAt: string;
}

interface Transaction {
  id: number;
  type: string;
  createdAt: string;
}

export default function OperationsPage() {
  const { user, isLoading } = useAuth();
  const { data: projects } = useApi<Project[]>("/api/operations/projects");
  const { data: transactions } = useApi<Transaction[]>("/api/operations/transactions");
  
  const [todayStats, setTodayStats] = useState({
    totalTransactions: 0,
    activeProjects: 0,
  });

  const isAdmin = user?.role === "admin";

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

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
                {user?.name || "Pengguna"}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isAdmin ? "Administrator" : "Operator"} - Apa yang ingin Anda lakukan hari ini?
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

        {/* Admin Features */}
        {isAdmin && (
          <div className="animate-fade-in" style={{ animationDelay: '0.05s' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-foreground text-lg">Fitur Administrator</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Link href="/operations/users" className="block group">
                <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-br from-info-light to-info/5 border-info/20 hover:scale-[1.02] hover:-translate-y-1">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="bg-info/20 p-5 rounded-3xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <Users className="h-9 w-9 text-info stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground text-base">Kelola User</h3>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        Manajemen pengguna
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/operations/stocks" className="block group">
                <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-br from-warning-light to-warning/5 border-warning/20 hover:scale-[1.02] hover:-translate-y-1">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="bg-warning/20 p-5 rounded-3xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <Settings className="h-9 w-9 text-warning stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground text-base">Kelola Stok</h3>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        Manajemen inventori
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        )}

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
                      <div className="flex justify-between items-start">
                        <span className="bg-success/90 text-success-foreground px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm">
                          {project.status}
                        </span>
                      </div>
                      <div className="text-white">
                        <h4 className="font-display font-bold text-lg mb-2 leading-tight">{project.name}</h4>
                        <p className="text-white/90 text-sm flex items-center gap-2">
                          <span className="w-1 h-1 bg-white/60 rounded-full"></span>
                          {project.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <div className="text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Belum ada proyek aktif</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}