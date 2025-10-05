"use client";

import { useState } from "react";
import { useDrag } from "@use-gesture/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle, ArrowUpCircle, Trash2, Edit3, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

interface Transaction {
  id: number;
  type: 'in' | 'out';
  quantity: string;
  unit: string;
  notes: string;
  createdAt: string;
  material: string;
  materialUnit: string;
  project: string;
  projectLocation: string;
  userName: string;
}

interface SwipeableTransactionCardProps {
  transaction: Transaction;
  index: number;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

export function SwipeableTransactionCard({ 
  transaction, 
  index, 
  onEdit, 
  onDelete 
}: SwipeableTransactionCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [dragX, setDragX] = useState(0);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Asia/Jakarta'
    }) + ' WIB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleEdit = () => {
    setIsRevealed(false);
    setDragX(0);
    if (onEdit) {
      onEdit(transaction);
    } else {
      toast.info("Fitur edit akan segera tersedia");
    }
  };

  const handleDelete = () => {
    setIsRevealed(false);
    setDragX(0);
    if (onDelete) {
      onDelete(transaction);
    } else {
      toast.error("Fitur hapus akan segera tersedia");
    }
  };

  const bind = useDrag(
    ({ down, movement: [mx], direction: [xDir], velocity: [vx], swipe: [swipeX] }) => {
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
      <div className="absolute inset-y-0 right-0 flex items-center bg-gradient-to-l from-destructive/20 to-warning/20 rounded-lg">
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
            onClick={handleDelete}
            className="h-10 w-10 p-0 hover:bg-destructive/20 text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Card */}
      <Card
        {...bind()}
        className={`relative z-10 p-4 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 animate-fade-in group cursor-pointer select-none ${
          transaction.type === "in" 
            ? "border-l-success/60 hover:border-l-success bg-gradient-to-r from-success/5 to-transparent hover:from-success/10" 
            : "border-l-danger/60 hover:border-l-danger bg-gradient-to-r from-danger/5 to-transparent hover:from-danger/10"
        }`}
        style={{ 
          animationDelay: `${index * 0.05}s`,
          transform: `translateX(${dragX}px)`,
          transition: bind().onPointerDown ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        <div className="flex gap-4">
          <div className={`p-3 rounded-xl h-fit shadow-sm transition-all group-hover:scale-105 ${
            transaction.type === "in" ? "bg-success/10 group-hover:bg-success/20" : "bg-danger/10 group-hover:bg-danger/20"
          }`}>
            {transaction.type === "in" ? (
              <ArrowDownCircle className="h-6 w-6 text-success" />
            ) : (
              <ArrowUpCircle className="h-6 w-6 text-danger" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-display font-bold text-foreground">
                  {transaction.material}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {transaction.quantity} {transaction.unit}
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-muted-foreground">
                  {formatTime(transaction.createdAt)}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDate(transaction.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <p className="text-sm text-muted-foreground">{transaction.project}</p>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10">
                  Detail
                </Button>
                {!isRevealed && (
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground/50" />
                )}
              </div>
            </div>
            
            {transaction.notes && (
              <div className="mt-3 p-2 bg-muted/30 rounded-md border-l-2 border-muted-foreground/20">
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  &ldquo;{transaction.notes}&rdquo;
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