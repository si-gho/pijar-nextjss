"use client";

import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight, User, Key, Bell, HelpCircle, LogOut, Award, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/use-api";

const UsersPage = () => {
  const { data: userStats } = useApi<{
    currentMonth: {
      materialIn: number;
      materialOut: number;
      activeProjects: number;
    };
    overall: {
      totalTransactions: number;
      accuracy: number;
    };
  }>('/api/operations/user-stats');

  const stats = [
    { 
      label: "Material Masuk", 
      value: userStats?.currentMonth.materialIn || 0, 
      color: "success", 
      icon: "↓" 
    },
    { 
      label: "Material Keluar", 
      value: userStats?.currentMonth.materialOut || 0, 
      color: "danger", 
      icon: "↑" 
    },
    { 
      label: "Proyek Aktif", 
      value: userStats?.currentMonth.activeProjects || 0, 
      color: "primary", 
      icon: "📍" 
    },
  ];

  const menuItems = [
    { icon: User, label: "Data Diri", href: "#", description: "Kelola informasi pribadi" },
    { icon: Key, label: "Keamanan", href: "#", description: "Password & autentikasi" },
    { icon: Bell, label: "Notifikasi", href: "#", description: "Pengaturan pemberitahuan" },
    { icon: HelpCircle, label: "Bantuan", href: "#", description: "Pusat bantuan & FAQ" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Profil Saya" />
      
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <Card className="p-6 shadow-lg bg-gradient-to-br from-card to-primary-light/20 border-primary/10 animate-fade-in">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <Avatar className="h-28 w-28 border-4 border-primary/20 shadow-lg">
                <AvatarImage src="" alt="Operator" />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-3xl font-display font-bold">
                  OP
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-success text-success-foreground rounded-full p-2 shadow-md border-2 border-card">
                <Award className="h-4 w-4" />
              </div>
            </div>
            
            <h2 className="text-2xl font-display font-bold text-foreground">Operator Lapangan</h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium">Anggota Operasi Pijar</p>
            
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>Labuhanbatu Selatan</span>
            </div>

            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>Bergabung sejak Nov 2023</span>
            </div>
            
            <div className="flex gap-2 mt-4 flex-wrap justify-center">
              <Badge className="bg-primary/10 text-primary border-primary/20 font-semibold">
                Gedung Perkantoran
              </Badge>
              <Badge className="bg-secondary/10 text-secondary border-secondary/20 font-semibold">
                Jembatan Sungai
              </Badge>
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <Card className="p-6 shadow-md animate-slide-up">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-foreground text-lg">Statistik Anda</h3>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Bulan Ini
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="mb-2 mx-auto w-fit p-3 rounded-2xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: stat.color === "success" 
                      ? "linear-gradient(135deg, hsl(var(--success-light)), hsl(var(--success) / 0.1))"
                      : stat.color === "danger"
                      ? "linear-gradient(135deg, hsl(var(--danger-light)), hsl(var(--danger) / 0.1))"
                      : "linear-gradient(135deg, hsl(var(--primary-light)), hsl(var(--primary) / 0.1))"
                  }}
                >
                  <div className={`text-3xl font-display font-bold ${
                    stat.color === "success" ? "text-success" :
                    stat.color === "danger" ? "text-danger" : "text-primary"
                  }`}>
                    {stat.value}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground font-medium leading-tight px-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Menu Items */}
        <Card className="divide-y shadow-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {menuItems.map((item) => (
            <button
              key={item.label}
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-xl group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </Card>

        {/* Achievement Badge */}
        <Card className="p-5 shadow-md bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 p-4 rounded-2xl">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-display font-bold text-foreground">Operator Teladan</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Anda telah mencatat {userStats?.overall.totalTransactions || 0} transaksi dengan akurasi {userStats?.overall.accuracy || 98}%
              </p>
            </div>
          </div>
        </Card>

        {/* Logout Button */}
        <Button 
          variant="outline" 
          className="w-full h-12 border-danger/30 text-danger hover:bg-danger hover:text-danger-foreground transition-all duration-300 font-semibold"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Keluar dari Akun
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default UsersPage;