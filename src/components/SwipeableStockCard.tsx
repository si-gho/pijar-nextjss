"use client";

import { useState } from "react";
import { useDrag } from "@use-gesture/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Package, Edit3, Settings, MoreHorizontal, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Stock {
  id: number;
  name: string;
  unit: string;
  initialStock: string;
  projectId: number;
  projectName: string;
  projectLocation: string;
  stockIn: number;
  stockOut: number;
  currentStock: number;
  totalCapacity: number;
  percentage: number;
  status: string;
  statusColor: string;
}

interface SwipeableStockCardProps {
  stock: Stock;
  index: number;
  onEdit?: (stock: Stock) => void;
  onSettings?: (stock: Stock) => void;
}

export function SwipeableStockCard({ 
  stock, 
  index, 
  onEdit, 
  onSettings 
}: SwipeableStockCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [dragX, setDragX] = useState(0);

  const handleEdit = () => {
    setIsRevealed(false);
    setDragX(0);
    if (onEdit) {
      onEdit(stock);
    } else {
      toast.info("Fitur edit stok akan segera tersedia");
    }
  };

  const handleSettings = () => {
    setIsRevealed(false);
    setDragX(0);
    if (onSettings) {
      onSettings(stock);
    } else {
      toast.info("Fitur pengaturan stok akan segera tersedia");
    }
  };

  const getStatusColor = () => {
    if (stock.statusColor === "danger") return "bg-danger/10 text-danger border-danger/20";
    if (stock.statusColor === "warning") return "bg-primary/10 text-primary border-primary/20";
    return "bg-success/10 text-success border-success/20";
  };

  const bind = useDrag(
    ({ down, movement: [mx], velocity: [vx], swipe: [swipeX] }) => {
      // Swipe threshold
      const swipeThreshold = 100;
      const velocityThreshold = 0.5;
      
      if (down) {
        // While dragging, constrain movement
        const constrainedX = Math.max(-150, Math.min(0, mx));
        setDragX(constrainedX);
      } else {
        // On release, determine final state
        if (swipeX === -1 || (mx < -swipeThreshold && vx > velocityThreshold)) {
          // Swipe left - reveal actions
          setIsRevealed(true);
          setDragX(-120);
        } else if (swipeX === 1 || mx > 50) {
          // Swipe right - hide actions
          setIsRevealed(false);
          setDragX(0);
        } else {
          // Snap back based on current position
          if (mx < -60) {
            setIsRevealed(true);
            setDragX(-120);
          } else {
            setIsRevealed(false);
            setDragX(0);
          }
        }
      }
    },
    {
      axis: 'x',
      swipe: {
        distance: 50,
        velocity: 0.3
      },
      rubberband: true
    }
  );

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Action Buttons Background */}
      <div className="absolute inset-y-0 right-0 flex items-center bg-gradient-to-l from-primary/20 to-warning/20 rounded-lg">
        <div className="flex items-center gap-2 px-4">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleEdit}
            className="h-10 w-10 p-0 hover:bg-warning/20 text-warning-foreground"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSettings}
            className="h-10 w-10 p-0 hover:bg-primary/20 text-primary"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Card */}
      <Card
        {...bind()}
        className="relative z-10 p-4 sm:p-5 shadow-md hover:shadow-lg transition-all duration-300 group animate-fade-in cursor-pointer select-none"
        style={{ 
          animationDelay: `${index * 0.1}s`,
          transform: `translateX(${dragX}px)`,
          transition: bind().onPointerDown ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        <div className="flex gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-3 sm:p-4 rounded-2xl h-fit group-hover:scale-110 transition-transform duration-300">
            <Package className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0 mr-3">
                <h4 className="font-display font-bold text-foreground text-sm sm:text-base truncate">{stock.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{stock.unit}</p>
                <p className="text-xs text-muted-foreground truncate">{stock.projectName}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="font-display font-bold text-foreground text-base sm:text-lg">
                  {stock.currentStock}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  / {stock.totalCapacity}
                </span>
              </div>
            </div>

            <div className="mb-3">
              <Progress value={stock.percentage} className="h-2.5 sm:h-2 bg-muted" />
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-xs font-semibold ${getStatusColor()}`}>
                  {stock.statusColor === 'danger' && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {stock.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="link" className="h-auto p-0 text-xs text-primary font-semibold hover:underline">
                  Detail →
                </Button>
                {!isRevealed && (
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground/50" />
                )}
              </div>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Masuk: {stock.stockIn}</span>
              <span>Keluar: {stock.stockOut}</span>
            </div>

            {/* Status indicator for critical stock */}
            {stock.statusColor === 'danger' && (
              <div className="mt-3 p-2 bg-danger/10 rounded-md border-l-2 border-danger/50">
                <p className="text-xs text-danger font-medium">
                  ⚠️ Stok menipis! Perlu segera diisi ulang
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Swipe Hint */}
        {!isRevealed && dragX === 0 && (
          <div className="absolute top-2 right-2 opacity-30">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>←</span>
              <span className="hidden sm:inline">Geser</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}