"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Package } from "lucide-react";
import { toast } from "sonner";
import { useApi } from "@/hooks/use-api";

interface AddMaterialDialogProps {
  projectId: string;
  onMaterialAdded: () => void;
}

export function AddMaterialDialog({ projectId, onMaterialAdded }: AddMaterialDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    initialStock: '',
    description: '',
  });

  const { postData, loading } = useApi('/api/operations/inventories', { autoFetch: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi input
    if (!formData.name.trim()) {
      toast.error("Nama material wajib diisi");
      return;
    }
    
    if (!formData.unit.trim()) {
      toast.error("Satuan material wajib diisi");
      return;
    }

    // Validasi stok awal jika diisi
    if (formData.initialStock && (isNaN(Number(formData.initialStock)) || Number(formData.initialStock) < 0)) {
      toast.error("Stok awal harus berupa angka positif");
      return;
    }

    try {
      const result = await postData({
        projectId: parseInt(projectId),
        name: formData.name.trim(),
        unit: formData.unit.trim(),
        initialStock: formData.initialStock || '0',
        description: formData.description.trim(),
      });

      if (result) {
        toast.success("Material baru berhasil ditambahkan!", {
          description: `${formData.name} telah ditambahkan ke daftar material`,
        });

        // Reset form and close dialog
        setFormData({ name: '', unit: '', initialStock: '', description: '' });
        setIsOpen(false);
        
        // Refresh material list
        onMaterialAdded();
      }
    } catch (error: any) {
      console.error('Error adding material:', error);
      
      // Handle specific error cases
      if (error.message.includes('409')) {
        toast.error("Material dengan nama yang sama sudah ada", {
          description: "Gunakan nama yang berbeda atau edit material yang sudah ada",
        });
      } else if (error.message.includes('400')) {
        toast.error("Data tidak valid", {
          description: "Periksa kembali data yang dimasukkan",
        });
      } else {
        toast.error("Gagal menambahkan material", {
          description: "Periksa koneksi internet dan coba lagi",
        });
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData({ name: '', unit: '', initialStock: '', description: '' });
  };

  if (!isOpen) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="h-11 px-3 hover:bg-success-light hover:border-success hover:text-success transition-colors"
      >
        <Plus className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <>
      {/* Portal to render outside of parent form */}
      {typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="bg-success/10 p-2 rounded-lg">
                  <Package className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-foreground text-lg">
                    Tambah Material Baru
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Tambahkan material yang belum ada di daftar
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="materialName" className="text-sm font-semibold">
              Nama Material *
            </Label>
            <Input
              id="materialName"
              placeholder="Contoh: Semen Portland, Besi Beton 12mm"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="h-11 bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="materialUnit" className="text-sm font-semibold">
              Satuan *
            </Label>
            <Input
              id="materialUnit"
              placeholder="Contoh: Sak (50kg), Batang (12m), M³, Dus"
              value={formData.unit}
              onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
              className="h-11 bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialStock" className="text-sm font-semibold">
              Stok Awal (Opsional)
            </Label>
            <Input
              id="initialStock"
              type="number"
              placeholder="0"
              value={formData.initialStock}
              onChange={(e) => setFormData(prev => ({ ...prev, initialStock: e.target.value }))}
              className="h-11 bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Deskripsi (Opsional)
            </Label>
            <Textarea
              id="description"
              placeholder="Deskripsi tambahan tentang material"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="resize-none bg-background"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-11"
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.name.trim() || !formData.unit.trim()}
              className="flex-1 h-11 bg-gradient-success text-base font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menyimpan...
                </div>
              ) : (
                'Tambah Material'
              )}
            </Button>
          </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}