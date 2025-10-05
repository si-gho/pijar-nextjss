"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Material {
  id: number;
  name: string;
  unit: string;
  currentStock?: number;
  initialStock?: string;
}

interface MaterialSelectorProps {
  materials: Material[];
  value: string;
  onValueChange: (value: string) => void;
  onDeleteMaterial?: (materialId: string, materialName: string, materialData: Material) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showStock?: boolean;
  allowDelete?: boolean;
}

export function MaterialSelector({
  materials,
  value,
  onValueChange,
  onDeleteMaterial,
  placeholder = "Pilih material",
  disabled = false,
  className = "",
  showStock = false,
  allowDelete = true
}: MaterialSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedMaterial = materials.find(m => m.id.toString() === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeleteClick = (e: React.MouseEvent, material: Material) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDeleteMaterial && allowDelete) {
      onDeleteMaterial(material.id.toString(), material.name, material);
      setIsOpen(false);
    }
  };

  const handleItemClick = (materialId: string) => {
    onValueChange(materialId);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full h-12 sm:h-11 justify-between bg-background text-left font-normal",
          !selectedMaterial && "text-muted-foreground"
        )}
      >
        <div className="flex flex-col items-start">
          {selectedMaterial ? (
            <>
              <span className="font-medium text-sm">{selectedMaterial.name}</span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Satuan: {selectedMaterial.unit}</span>
                {showStock && (
                  <>
                    <span>•</span>
                    <span className="font-medium">
                      Stok: {selectedMaterial.currentStock ?? (selectedMaterial.initialStock ? parseInt(selectedMaterial.initialStock) : 0)}
                    </span>
                  </>
                )}
              </div>
            </>
          ) : (
            <span className="text-sm">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </Button>

      {/* Dropdown Content */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto shadow-lg border bg-card">
          {materials.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Tidak ada material tersedia
            </div>
          ) : (
            <div className="p-1">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className={cn(
                    "relative flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    value === material.id.toString() && "bg-accent text-accent-foreground",
                    hoveredItem === material.id.toString() && "bg-accent/50"
                  )}
                  onMouseEnter={() => setHoveredItem(material.id.toString())}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => handleItemClick(material.id.toString())}
                >
                  <div className="flex flex-col items-start flex-1 min-w-0">
                    <span className="font-medium text-sm truncate w-full">{material.name}</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Satuan: {material.unit}</span>
                      {showStock && (
                        <>
                          <span>•</span>
                          <span className={`font-medium px-1.5 py-0.5 rounded text-xs ${
                            (material.currentStock ?? (material.initialStock ? parseInt(material.initialStock) : 0)) === 0 
                              ? 'bg-destructive/10 text-destructive' 
                              : (material.currentStock ?? (material.initialStock ? parseInt(material.initialStock) : 0)) < 10
                              ? 'bg-warning/10 text-warning'
                              : 'bg-success/10 text-success'
                          }`}>
                            Stok: {material.currentStock ?? (material.initialStock ? parseInt(material.initialStock) : 0)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Delete Button - Only show if allowed */}
                  {allowDelete && onDeleteMaterial && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDeleteClick(e, material)}
                      className={cn(
                        "h-6 w-6 ml-2 flex-shrink-0 opacity-70 transition-all",
                        "hover:bg-destructive/10 hover:text-destructive hover:opacity-100",
                        "active:scale-95 touch-manipulation"
                      )}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}