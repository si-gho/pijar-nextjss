"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useApi } from "@/hooks/use-api";

interface AddMaterialDialogProps {
  projectId: string;
  onMaterialAdded: (newMaterial: any) => void;
}

export function AddMaterialDialog({ projectId, onMaterialAdded }: AddMaterialDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    description: '',
    initialStock: '0'
  });

  const { postData, loading } = useApi('/api/operations/inventories', { autoFetch: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.unit.trim()) {
      toast.error("Nama material dan satuan wajib diisi");
      return;
    }

    try {
      const newMaterial = await postData({
        projectId: parseInt(projectId),
        name: formData.name.trim(),
        unit: formData.unit.trim(),
        description: formData.description.trim() || null,
        initialStock: formData.initialStock || '0'
      });

      toast.success("Material baru berhasil ditambahkan!", {
        description: `${formData.name} (${formData.unit}) telah tersimpan`,
      });

      // Reset form
      setFormData({
        name: '',
        unit: '',
        description: '',
        initialStock: '0'
      });

      // Close dialog
      setOpen(false);

      // Notify parent component
      onMaterialAdded(newMaterial);

    } catch (error) {
      toast.error("Gagal menambahkan material", {
        description: "Silakan coba lagi",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          type="button" 
          size="icon" 
          className="h-12 sm:h-11 w-12 sm:w-11 bg-success hover:bg-success/90 text-success-foreground flex-shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="bg-success/10 p-2 rounded-lg">
              <Plus className="h-4 w-4 text-success" />
            </div>
            Tambah Material Baru
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="materialName" className="text-sm font-semibold">
              Nama Material *
            </Label>
            <Input
              id="materialName"
              placeholder="Contoh: Semen Portland"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="h-11"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="materialUnit" className="text-sm font-semibold">
              Satuan *
            </Label>
            <Input
              id="materialUnit"
              placeholder="Contoh: Sak, Kg, M3"
              value={formData.unit}
              onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialStock" className="text-sm font-semibold">
              Stok Awal
            </Label>
            <Input
              id="initialStock"
              type="number"
              placeholder="0"
              value={formData.initialStock}
              onChange={(e) => setFormData(prev => ({ ...prev, initialStock: e.target.value }))}
              className="h-11"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="materialDescription" className="text-sm font-semibold">
              Deskripsi (Opsional)
            </Label>
            <Textarea
              id="materialDescription"
              placeholder="Deskripsi tambahan tentang material..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.name.trim() || !formData.unit.trim()}
              className="flex-1 bg-success hover:bg-success/90"
            >
              {loading ? 'Menyimpan...' : 'Simpan Material'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}