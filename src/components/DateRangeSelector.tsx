"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, addDays, addWeeks, addMonths, subWeeks, subMonths } from "date-fns";
import { id } from "date-fns/locale";

interface DateRangeSelectorProps {
  onDateRangeChange: (startDate: Date, endDate: Date, label: string) => void;
}

type DateRangeType = 'today' | 'week' | 'month' | 'custom';

export function DateRangeSelector({ onDateRangeChange }: DateRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<DateRangeType>('today');

  const getDateRange = (type: DateRangeType, date: Date) => {
    switch (type) {
      case 'today':
        return {
          start: date,
          end: date,
          label: format(date, "EEEE, d MMMM yyyy", { locale: id })
        };
      case 'week':
        const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
        const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
        return {
          start: weekStart,
          end: weekEnd,
          label: `${format(weekStart, "d MMM", { locale: id })} - ${format(weekEnd, "d MMM yyyy", { locale: id })}`
        };
      case 'month':
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);
        return {
          start: monthStart,
          end: monthEnd,
          label: format(date, "MMMM yyyy", { locale: id })
        };
      default:
        return {
          start: date,
          end: date,
          label: format(date, "d MMMM yyyy", { locale: id })
        };
    }
  };

  const handleRangeSelect = (type: DateRangeType) => {
    setSelectedRange(type);
    const range = getDateRange(type, currentDate);
    onDateRangeChange(range.start, range.end, range.label);
    setIsOpen(false);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    let newDate: Date;
    
    switch (selectedRange) {
      case 'today':
        newDate = direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1);
        break;
      case 'week':
        newDate = direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1);
        break;
      case 'month':
        newDate = direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1);
        break;
      default:
        newDate = direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1);
    }
    
    setCurrentDate(newDate);
    const range = getDateRange(selectedRange, newDate);
    onDateRangeChange(range.start, range.end, range.label);
  };

  const currentRange = getDateRange(selectedRange, currentDate);

  return (
    <>
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigateDate('prev')} className="hover:bg-primary/10">
          <ChevronLeft className="h-5 w-5 text-primary" />
        </Button>
        
        <Button variant="ghost" onClick={() => setIsOpen(true)} className="flex items-center gap-2 hover:bg-primary/10">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="font-display font-bold text-foreground">
            {currentRange.label}
          </span>
        </Button>
        
        <Button variant="ghost" size="icon" onClick={() => navigateDate('next')} className="hover:bg-primary/10">
          <ChevronRight className="h-5 w-5 text-primary" />
        </Button>
      </div>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl w-full max-w-sm">
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-foreground">Pilih Periode</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Options */}
            <div className="p-4 space-y-2">
              <Button
                variant={selectedRange === 'today' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => handleRangeSelect('today')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Hari Ini
              </Button>
              
              <Button
                variant={selectedRange === 'week' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => handleRangeSelect('week')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Minggu Ini
              </Button>
              
              <Button
                variant={selectedRange === 'month' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => handleRangeSelect('month')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Bulan Ini
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}