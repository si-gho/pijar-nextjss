"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { AlertTriangle, Trash2, Package, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { useApi } from "@/hooks/use-api";

interface Material {
  id: number;
  name: string;
  unit: string;
  currentStock?: number;
  initialStock?: string;
}

interface DeleteMaterialConfirmationProps {
  materialId: string;
  materialName: string;
  materialData?: Material;
  isOpen: boolean;
  onClose: () => void;
  onMaterialDeleted: () => void;
}

export function DeleteMaterialConfirmation({ 
  materialId, 
  materialName, 
  materialData,
  isOpen, 
  onClose, 
  onMaterialDeleted 
}: DeleteMaterialConfirmationProps) {
  const { deleteData, loading } = useApi(`/api/operations/inventories/${materialId}`, { autoFetch: false });
  
  // Fetch related transaction data when dialog opens
  const { data: relatedData, loading: loadingRelated } = useApi<{
    transactionCount: number;
    totalIn: number;
    totalOut: number;
    lastTransaction?: { date: string; type: string; quantity: number };
  }>(
    isOpen && materialId ? `/api/operations/inventories/${materialId}/related` : '',
    { autoFetch: isOpen && !!materialId }
  );

  const handleDelete = async () => {
    try {
      await deleteData();
      
      toast.success("Material berhasil dihapus", {
        description: `${materialName} telah dihapus dari sistem`,
      });

      onClose();
      onMaterialDeleted();

    } catch (error) {
      toast.error("Gagal menghapus material", {
        description: "Material mungkin masih digunakan dalam transaksi",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="bg-destructive/10 p-2.5 rounded-lg">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <div className="text-lg font-semibold">Hapus Material</div>
              <div className="text-sm font-normal text-muted-foreground mt-1">
                Konfirmasi penghapusan material
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="text-left pt-2">
            <div className="space-y-4">
              <p>
                Apakah Anda yakin ingin menghapus material{" "}
                <span className="font-semibold text-foreground">&ldquo;{materialName}&rdquo;</span>?
              </p>

              {/* Material Information */}
              {materialData && (
                <div className="bg-muted/30 border rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Package className="h-4 w-4 text-primary" />
                    Informasi Material
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Satuan:</span>
                      <span className="ml-2 font-medium">{materialData.unit}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Stok Saat Ini:</span>
                      <span className="ml-2 font-medium">
                        {materialData.currentStock ?? (materialData.initialStock ? parseInt(materialData.initialStock) : 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Related Data */}
              {loadingRelated ? (
                <div className="bg-muted/30 border rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
                    Memuat data terkait...
                  </div>
                </div>
              ) : relatedData && relatedData.transactionCount > 0 ? (
                <div className="bg-warning/5 border border-warning/20 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-warning">
                    <AlertTriangle className="h-4 w-4" />
                    Data Terkait Ditemukan
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <TrendingDown className="h-3 w-3 text-success" />
                      <span className="text-muted-foreground">Total Masuk:</span>
                      <span className="font-medium text-success">{relatedData.totalIn}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-destructive" />
                      <span className="text-muted-foreground">Total Keluar:</span>
                      <span className="font-medium text-destructive">{relatedData.totalOut}</span>
                    </div>
                  </div>
                  <div className="text-xs text-warning/80">
                    {relatedData.transactionCount} transaksi akan ikut terhapus
                  </div>
                </div>
              ) : (
                <div className="bg-success/5 border border-success/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm text-success">
                    <Package className="h-4 w-4" />
                    Material ini belum memiliki transaksi
                  </div>
                </div>
              )}

              {/* Warning */}
              <div className="bg-destructive/5 border border-destructive/20 rounded-md p-3 text-sm">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-destructive">Peringatan:</div>
                    <div className="text-destructive/80 mt-1">
                      Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait material ini.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" />
                Menghapus...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Ya, Hapus
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}