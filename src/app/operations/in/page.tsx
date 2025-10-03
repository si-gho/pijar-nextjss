"use client";

import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Camera, MapPin, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import materialsCement from "@/assets/materials-cement.jpg";
import { useApi } from "@/hooks/use-api";
import { useState } from "react";
import { AddMaterialDialog } from "@/components/AddMaterialDialog";
import { LoadingSpinner } from "@/components/LoadingSpinner";

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

const MaterialInPage = () => {
  const [formData, setFormData] = useState({
    projectId: '',
    inventoryId: '',
    quantity: '',
    unit: '',
    notes: '',
  });

  const { data: projects, loading: projectsLoading, error: projectsError, refetch: refetchProjects } = useApi<Project[]>('/api/operations/projects');
  const { data: inventories, loading: inventoriesLoading, error: inventoriesError, refetch: fetchInventories } = useApi<Inventory[]>(
    formData.projectId ? `/api/operations/inventories?projectId=${formData.projectId}` : '',
    { autoFetch: !!formData.projectId }
  );
  const { postData, loading } = useApi('/api/operations/transactions', { autoFetch: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi input
    if (!formData.projectId) {
      toast.error("Mohon pilih lokasi proyek");
      return;
    }

    if (!formData.inventoryId) {
      toast.error("Mohon pilih jenis material");
      return;
    }

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      toast.error("Mohon masukkan jumlah yang valid (lebih dari 0)");
      return;
    }

    if (!formData.unit) {
      toast.error("Satuan material tidak valid");
      return;
    }

    try {
      const result = await postData({
        projectId: parseInt(formData.projectId),
        inventoryId: parseInt(formData.inventoryId),
        userId: 'user-1', // TODO: Get from auth context
        type: 'in',
        quantity: formData.quantity,
        unit: formData.unit,
        notes: formData.notes.trim(),
      });

      if (result) {
        toast.success("Material masuk berhasil dicatat!", {
          description: `${formData.quantity} ${formData.unit} telah ditambahkan ke stok`,
        });

        // Reset form
        setFormData({
          projectId: '',
          inventoryId: '',
          quantity: '',
          unit: '',
          notes: '',
        });
      }
    } catch (error: any) {
      console.error('Error saving transaction:', error);
      
      if (error.message.includes('400')) {
        toast.error("Data tidak valid", {
          description: "Periksa kembali data yang dimasukkan",
        });
      } else if (error.message.includes('404')) {
        toast.error("Material atau proyek tidak ditemukan", {
          description: "Refresh halaman dan coba lagi",
        });
      } else {
        toast.error("Gagal menyimpan data", {
          description: "Periksa koneksi internet dan coba lagi",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Material Masuk" />

      <div className="max-w-md mx-auto px-4 py-6">
        <Link href="/operations" className="inline-flex items-center gap-2 text-primary mb-6 hover:underline group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Kembali ke Dashboard</span>
        </Link>

        <Card className="p-6 shadow-lg border-success/20 animate-fade-in">
          {/* Header Banner */}
          <div className="mb-6 -m-6 mb-6">
            <div className="relative h-32 overflow-hidden rounded-t-lg">
              <Image
                src={materialsCement}
                alt="Material Construction"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-success via-success/70 to-transparent flex items-end">
                <div className="p-5 text-success-foreground">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-success-foreground/20 backdrop-blur-sm p-2 rounded-lg">
                      <Package className="h-5 w-5" />
                    </div>
                    <h2 className="font-display font-bold text-xl">Laporan Material Masuk</h2>
                  </div>
                  <p className="text-sm text-success-foreground/90">
                    Catat material yang masuk ke lokasi proyek
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="project" className="text-sm font-semibold">Lokasi Proyek *</Label>
              {projectsLoading ? (
                <div className="h-11 flex items-center justify-center bg-background border rounded-md">
                  <LoadingSpinner size="sm" text="Memuat proyek..." />
                </div>
              ) : (
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
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="material" className="text-sm font-semibold">Jenis Material *</Label>
              <div className="flex gap-2">
                {formData.projectId && inventoriesLoading ? (
                  <div className="flex-1 h-11 flex items-center justify-center bg-background border rounded-md">
                    <LoadingSpinner size="sm" text="Memuat material..." />
                  </div>
                ) : (
                  <Select 
                    value={formData.inventoryId} 
                    onValueChange={(value) => {
                      const selectedInventory = inventories?.find(inv => inv.id.toString() === value);
                      setFormData(prev => ({
                        ...prev,
                        inventoryId: value,
                        unit: selectedInventory?.unit || ''
                      }));
                    }}
                    disabled={!formData.projectId}
                  >
                    <SelectTrigger id="material" className="h-11 bg-background flex-1">
                      <SelectValue placeholder={formData.projectId ? "Pilih jenis material" : "Pilih proyek terlebih dahulu"} />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      {inventories?.map(inventory => (
                        <SelectItem key={inventory.id} value={inventory.id.toString()}>
                          {inventory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {formData.projectId && !inventoriesLoading && (
                  <AddMaterialDialog 
                    projectId={formData.projectId}
                    onMaterialAdded={() => fetchInventories()}
                  />
                )}
              </div>
              
              {formData.projectId && !inventoriesLoading && !inventoriesError && inventories?.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Belum ada material untuk proyek ini. Klik tombol + untuk menambah material baru.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-semibold">Jumlah *</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="100"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  className="h-11 bg-background"
                />
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
              <Label htmlFor="supplier" className="text-sm font-semibold">Pemasok</Label>
              <Input
                id="supplier"
                placeholder="Nama pemasok (opsional)"
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
                className="w-full h-12 hover:bg-success-light hover:border-success hover:text-success transition-colors"
              >
                <Camera className="h-5 w-5 mr-2" />
                Ambil Foto Material
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 hover:bg-success-light hover:border-success hover:text-success transition-colors"
              >
                <MapPin className="h-5 w-5 mr-2" />
                Tandai Lokasi GPS
              </Button>
            </div>

            <div className="pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-success text-base font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : 'Simpan Laporan Material Masuk'}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default MaterialInPage;