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
import { useState } from "react";

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
}

const MaterialOutPage = () => {
  const [formData, setFormData] = useState({
    projectId: '',
    inventoryId: '',
    quantity: '',
    unit: '',
    notes: '',
  });

  const { data: projects } = useApi<Project[]>('/api/operations/projects');
  const { data: inventories } = useApi<Inventory[]>(
    formData.projectId ? `/api/operations/inventories?projectId=${formData.projectId}` : '',
    { autoFetch: !!formData.projectId }
  );
  const { data: stocks } = useApi<any[]>(
    formData.projectId ? `/api/operations/stocks?projectId=${formData.projectId}` : '',
    { autoFetch: !!formData.projectId }
  );
  const { postData, loading } = useApi('/api/operations/transactions', { autoFetch: false });

  const getAvailableStock = (inventoryId: string) => {
    if (!stocks || !inventoryId) return 0;
    const stock = stocks.find(s => s.id.toString() === inventoryId);
    return stock ? stock.currentStock : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectId || !formData.inventoryId || !formData.quantity) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    // Validate stock availability
    const availableStock = getAvailableStock(formData.inventoryId);
    const requestedQuantity = parseFloat(formData.quantity);
    
    if (requestedQuantity > availableStock) {
      toast.error("Jumlah melebihi stok yang tersedia", {
        description: `Stok tersedia: ${availableStock} ${formData.unit}`,
      });
      return;
    }

    if (requestedQuantity <= 0) {
      toast.error("Jumlah harus lebih dari 0");
      return;
    }

    try {
      await postData({
        projectId: parseInt(formData.projectId),
        inventoryId: parseInt(formData.inventoryId),
        userId: 'user-1', // TODO: Get from auth context
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

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Material Keluar" />
      
      <div className="max-w-md mx-auto px-4 py-6">
        <Link href="/operations" className="inline-flex items-center gap-2 text-primary mb-6 hover:underline group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Kembali ke Dashboard</span>
        </Link>

        <Card className="p-6 shadow-lg border-danger/20 animate-fade-in">
          {/* Header Banner */}
          <div className="mb-6 -m-6 mb-6">
            <div className="relative h-32 overflow-hidden rounded-t-lg">
              <Image 
                src={materialsSteel} 
                alt="Material Construction"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-danger via-danger/70 to-transparent flex items-end">
                <div className="p-5 text-danger-foreground">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-danger-foreground/20 backdrop-blur-sm p-2 rounded-lg">
                      <TrendingDown className="h-5 w-5" />
                    </div>
                    <h2 className="font-display font-bold text-xl">Laporan Material Keluar</h2>
                  </div>
                  <p className="text-sm text-danger-foreground/90">
                    Catat material yang keluar dari lokasi proyek
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="project" className="text-sm font-semibold">Lokasi Proyek *</Label>
              <Select value={formData.projectId} onValueChange={(value) => setFormData(prev => ({ ...prev, projectId: value, inventoryId: '' }))}>
                <SelectTrigger id="project" className="h-11 bg-background">
                  <SelectValue placeholder="Pilih lokasi proyek" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {projects?.map(project => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name} - {project.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="material" className="text-sm font-semibold">Jenis Material *</Label>
              <Select value={formData.inventoryId} onValueChange={(value) => {
                const selectedInventory = inventories?.find(inv => inv.id.toString() === value);
                setFormData(prev => ({ 
                  ...prev, 
                  inventoryId: value,
                  unit: selectedInventory?.unit || ''
                }));
              }}>
                <SelectTrigger id="material" className="h-11 bg-background">
                  <SelectValue placeholder="Pilih jenis material" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {inventories?.filter(inventory => {
                    const stock = getAvailableStock(inventory.id.toString());
                    return stock > 0;
                  }).map(inventory => (
                    <SelectItem key={inventory.id} value={inventory.id.toString()}>
                      {inventory.name} (Stok: {getAvailableStock(inventory.id.toString())})
                    </SelectItem>
                  ))}
                  {inventories?.filter(inventory => getAvailableStock(inventory.id.toString()) > 0).length === 0 && (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      Tidak ada material dengan stok tersedia
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-semibold">Jumlah *</Label>
                <Input 
                  id="quantity" 
                  type="number" 
                  placeholder="50" 
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  max={getAvailableStock(formData.inventoryId)}
                  className="h-11 bg-background"
                />
                {formData.inventoryId && (
                  <p className="text-xs text-muted-foreground">
                    Stok tersedia: {getAvailableStock(formData.inventoryId)} {formData.unit}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit" className="text-sm font-semibold">Satuan *</Label>
                <Input 
                  id="unit" 
                  value={formData.unit}
                  readOnly
                  placeholder="Pilih material dulu"
                  className="h-11 bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination" className="text-sm font-semibold">Tujuan Penggunaan</Label>
              <Input 
                id="destination" 
                placeholder="Tujuan penggunaan (opsional)" 
                className="h-11 bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient" className="text-sm font-semibold">Penerima</Label>
              <Input 
                id="recipient" 
                placeholder="Nama penerima (opsional)" 
                className="h-11 bg-background"
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
                className="resize-none bg-background"
              />
            </div>

            <div className="space-y-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground font-medium">Dokumentasi</p>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-12 hover:bg-danger-light hover:border-danger hover:text-danger transition-colors"
              >
                <Camera className="h-5 w-5 mr-2" />
                Ambil Foto Material
              </Button>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-12 hover:bg-danger-light hover:border-danger hover:text-danger transition-colors"
              >
                <MapPin className="h-5 w-5 mr-2" />
                Tandai Lokasi GPS
              </Button>
            </div>

            <div className="pt-6">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-gradient-danger text-base font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : 'Simpan Laporan Material Keluar'}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default MaterialOutPage;