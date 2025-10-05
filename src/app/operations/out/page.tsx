"use client";

import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Camera, MapPin, TrendingDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import materialsSteel from "@/assets/materials-steel.jpg";
import { useApi } from "@/hooks/use-api";
import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MaterialSelector } from "@/components/MaterialSelector";

interface Project {
  id: number;
  name: string;
  location: string;
}

interface Inventory {
  id: number;
  name: string;
  unit: string;
  projectId: number;
  projectName: string;
  initialStock?: string;
}

const MaterialOutPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    projectId: '',
    inventoryId: '',
    quantity: '',
    unit: '',
    notes: '',
  });

  const { data: projects, loading: projectsLoading } = useApi<Project[]>('/api/operations/projects');
  const { data: inventories, loading: inventoriesLoading } = useApi<Inventory[]>(
    formData.projectId ? `/api/operations/inventories?projectId=${formData.projectId}` : '',
    { autoFetch: !!formData.projectId }
  );
  const { data: stocksResponse, loading: stocksLoading } = useApi<{items: any[], pagination: any}>(
    formData.projectId ? `/api/operations/stocks?projectId=${formData.projectId}` : '',
    { autoFetch: !!formData.projectId }
  );
  
  // Extract stocks from the response
  const stocks = stocksResponse?.items;

  // Combine inventories with stock data and filter only available stock
  const availableMaterials = useMemo(() => {
    if (!inventories || !stocks) return [];
    
    return inventories
      .map(inventory => {
        const stock = stocks.find(s => s.id === inventory.id);
        const currentStock = stock?.currentStock ?? (inventory.initialStock ? parseInt(inventory.initialStock) : 0);
        return {
          ...inventory,
          currentStock
        };
      })
      .filter(material => material.currentStock > 0); // Only show materials with stock
  }, [inventories, stocks]);
  const { postData, loading } = useApi('/api/operations/transactions', { autoFetch: false });

  const getAvailableStock = (inventoryId: string) => {
    if (!stocks || !Array.isArray(stocks) || !inventoryId) return 0;
    const stock = stocks.find(s => s.id.toString() === inventoryId);
    return stock ? stock.currentStock : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Comprehensive validation for Material Keluar
    if (!formData.projectId || !formData.inventoryId || !formData.quantity) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    if (!user?.id) {
      toast.error("Sesi tidak valid, silakan login ulang");
      return;
    }

    // Get current available stock
    const availableStock = getAvailableStock(formData.inventoryId);
    const requestedQuantity = parseFloat(formData.quantity);
    
    // Strict validation rules for Material Keluar
    if (isNaN(requestedQuantity) || requestedQuantity <= 0) {
      toast.error("Jumlah harus berupa angka positif yang valid");
      return;
    }

    if (availableStock <= 0) {
      toast.error("Material tidak tersedia", {
        description: "Stok material ini sudah habis",
      });
      return;
    }

    if (requestedQuantity > availableStock) {
      toast.error("Jumlah melebihi stok yang tersedia", {
        description: `Maksimal yang dapat dikeluarkan: ${availableStock} ${formData.unit}`,
      });
      return;
    }

    // Additional validation: Check if material still exists and has stock
    const selectedMaterial = availableMaterials.find(m => m.id.toString() === formData.inventoryId);
    if (!selectedMaterial || selectedMaterial.currentStock <= 0) {
      toast.error("Material tidak valid atau stok sudah habis", {
        description: "Silakan pilih material lain atau refresh halaman",
      });
      return;
    }

    try {
      await postData({
        projectId: parseInt(formData.projectId),
        inventoryId: parseInt(formData.inventoryId),
        userId: user.id,
        type: 'out',
        quantity: formData.quantity,
        unit: formData.unit,
        notes: formData.notes,
      });

      toast.success("Material keluar berhasil dicatat!", {
        description: "Data telah tersimpan dalam sistem",
      });

      // Reset form
      setFormData({
        projectId: '',
        inventoryId: '',
        quantity: '',
        unit: '',
        notes: '',
      });
    } catch (error) {
      toast.error("Gagal menyimpan data", {
        description: "Silakan coba lagi",
      });
    }
  };

  // Show loading if auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner text="Memuat..." />
      </div>
    );
  }

  // Redirect if not authenticated (handled by useAuth)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Material Keluar" />
      
      <div className="max-w-md mx-auto px-4 py-6">
        <Link href="/operations" className="inline-flex items-center gap-2 text-primary mb-6 hover:underline group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Kembali ke Dashboard</span>
        </Link>

        <Card className="p-4 sm:p-6 shadow-lg border-danger/20 animate-fade-in">
          {/* Header Banner */}
          <div className="mb-4 -m-4 sm:-m-6 mb-4 sm:mb-6">
            <div className="relative h-28 sm:h-32 overflow-hidden rounded-t-lg">
              <Image 
                src={materialsSteel} 
                alt="Material Construction"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-danger via-danger/70 to-transparent flex items-end">
                <div className="p-3 sm:p-5 text-danger-foreground">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <div className="bg-danger-foreground/20 backdrop-blur-sm p-1.5 sm:p-2 rounded-lg">
                      <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <h2 className="font-display font-bold text-lg sm:text-xl">Laporan Material Keluar</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-danger-foreground/90">
                    Catat material yang keluar dari lokasi proyek
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <Label htmlFor="project" className="text-sm font-semibold">Lokasi Proyek *</Label>
              {projectsLoading ? (
                <div className="h-12 sm:h-11 flex items-center justify-center bg-background border rounded-md">
                  <LoadingSpinner size="sm" text="Memuat proyek..." />
                </div>
              ) : (
                <Select value={formData.projectId} onValueChange={(value) => setFormData(prev => ({ ...prev, projectId: value, inventoryId: '' }))}>
                  <SelectTrigger id="project" className="h-12 sm:h-11 bg-background text-left">
                    <SelectValue placeholder="Pilih lokasi proyek" />
                  </SelectTrigger>
                <SelectContent className="bg-card max-h-60">
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
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="material" className="text-sm font-semibold">Jenis Material *</Label>
              {formData.projectId && (inventoriesLoading || stocksLoading) ? (
                <div className="h-12 sm:h-11 flex items-center justify-center bg-background border rounded-md">
                  <LoadingSpinner size="sm" text="Memuat material..." />
                </div>
              ) : (
                <MaterialSelector
                  materials={availableMaterials}
                  value={formData.inventoryId}
                  onValueChange={(value) => {
                    const selectedInventory = availableMaterials.find(inv => inv.id.toString() === value);
                    setFormData(prev => ({ 
                      ...prev, 
                      inventoryId: value,
                      unit: selectedInventory?.unit || '',
                      quantity: '' // Reset quantity when material changes
                    }));
                  }}
                  placeholder={formData.projectId ? 
                    (availableMaterials.length === 0 ? "Tidak ada material dengan stok tersedia" : "Pilih jenis material") : 
                    "Pilih proyek terlebih dahulu"
                  }
                  disabled={!formData.projectId || availableMaterials.length === 0}
                  showStock={true}
                  allowDelete={false} // Disable delete functionality for Material Keluar
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-semibold">Jumlah *</Label>
                <Input 
                  id="quantity" 
                  type="number" 
                  placeholder="Masukkan jumlah" 
                  value={formData.quantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numValue = parseFloat(value);
                    const maxStock = getAvailableStock(formData.inventoryId);
                    
                    // Only allow valid positive numbers within stock limit
                    if (value === '' || (numValue > 0 && numValue <= maxStock)) {
                      setFormData(prev => ({ ...prev, quantity: value }));
                    }
                  }}
                  max={getAvailableStock(formData.inventoryId)}
                  min="0.01"
                  step="0.01"
                  className={`h-12 sm:h-11 bg-background text-base sm:text-sm ${
                    formData.quantity && parseFloat(formData.quantity) > getAvailableStock(formData.inventoryId) 
                      ? 'border-destructive focus:border-destructive' 
                      : ''
                  }`}
                  inputMode="decimal"
                  disabled={!formData.inventoryId || getAvailableStock(formData.inventoryId) <= 0}
                />
                {formData.inventoryId && (
                  <div className="space-y-1">
                    <p className={`text-xs p-2 rounded-md ${
                      getAvailableStock(formData.inventoryId) <= 0 
                        ? 'bg-destructive/10 text-destructive border border-destructive/20' 
                        : getAvailableStock(formData.inventoryId) < 10
                        ? 'bg-warning/10 text-warning border border-warning/20'
                        : 'bg-success/10 text-success border border-success/20'
                    }`}>
                      <span className="font-medium">
                        Stok tersedia: {getAvailableStock(formData.inventoryId)} {formData.unit}
                      </span>
                      {getAvailableStock(formData.inventoryId) <= 0 && (
                        <span className="block mt-1">⚠️ Stok habis - tidak dapat mengeluarkan material</span>
                      )}
                    </p>
                    {formData.quantity && parseFloat(formData.quantity) > getAvailableStock(formData.inventoryId) && (
                      <p className="text-xs text-destructive bg-destructive/10 p-2 rounded-md border border-destructive/20">
                        ❌ Jumlah melebihi stok yang tersedia
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit" className="text-sm font-semibold">Satuan *</Label>
                <Input 
                  id="unit" 
                  value={formData.unit}
                  readOnly
                  placeholder="Pilih material dulu"
                  className="h-12 sm:h-11 bg-background text-base sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination" className="text-sm font-semibold">Tujuan Penggunaan</Label>
              <Input 
                id="destination" 
                placeholder="Tujuan penggunaan (opsional)" 
                className="h-12 sm:h-11 bg-background text-base sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient" className="text-sm font-semibold">Penerima</Label>
              <Input 
                id="recipient" 
                placeholder="Nama penerima (opsional)" 
                className="h-12 sm:h-11 bg-background text-base sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-semibold">Catatan</Label>
              <Textarea 
                id="notes" 
                placeholder="Tambahkan catatan jika diperlukan"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="resize-none bg-background text-base sm:text-sm min-h-[80px]"
              />
            </div>

            <div className="space-y-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground font-medium">Dokumentasi</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-12 hover:bg-danger-light hover:border-danger hover:text-danger transition-colors text-sm"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Ambil Foto Material
                </Button>

                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-12 hover:bg-danger-light hover:border-danger hover:text-danger transition-colors text-sm"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Tandai Lokasi GPS
                </Button>
              </div>
            </div>

            <div className="pt-4 sm:pt-6">
              <Button 
                type="submit" 
                disabled={
                  loading || 
                  !formData.projectId || 
                  !formData.inventoryId || 
                  !formData.quantity || 
                  parseFloat(formData.quantity || '0') <= 0 ||
                  parseFloat(formData.quantity || '0') > getAvailableStock(formData.inventoryId) ||
                  getAvailableStock(formData.inventoryId) <= 0 ||
                  availableMaterials.length === 0
                }
                className="w-full h-14 sm:h-12 bg-gradient-danger text-base font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 touch-manipulation"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-danger-foreground/30 border-t-danger-foreground rounded-full animate-spin" />
                    Menyimpan...
                  </div>
                ) : (
                  'Simpan Laporan Material Keluar'
                )}
              </Button>
              
              {/* Validation Messages */}
              {!formData.projectId && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Pilih proyek terlebih dahulu
                </p>
              )}
              {formData.projectId && availableMaterials.length === 0 && (
                <p className="text-xs text-destructive text-center mt-2">
                  Tidak ada material dengan stok tersedia di proyek ini
                </p>
              )}
              {formData.inventoryId && getAvailableStock(formData.inventoryId) <= 0 && (
                <p className="text-xs text-destructive text-center mt-2">
                  Material yang dipilih tidak memiliki stok
                </p>
              )}
              {formData.quantity && parseFloat(formData.quantity) > getAvailableStock(formData.inventoryId) && (
                <p className="text-xs text-destructive text-center mt-2">
                  Jumlah melebihi stok yang tersedia
                </p>
              )}
            </div>
          </form>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default MaterialOutPage;