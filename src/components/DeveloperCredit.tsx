"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Code, Github, Linkedin, Mail, Calendar, MapPin } from 'lucide-react';

export const DeveloperCredit = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isExpanded]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isExpanded && componentRef.current && !componentRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div ref={componentRef} className="relative">
      {/* Collapsed State - Foundation Bar */}
      <div
        className={`
          transition-all duration-700 ease-out cursor-pointer
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Foundation base */}
        <div className="relative">
          {/* Main foundation bar */}
          <div
            className={`
              h-6 bg-gradient-to-r from-blue-400/80 via-indigo-500/80 to-purple-500/80 rounded-lg
              transition-all duration-500 ease-out relative overflow-hidden
              border border-white/20 shadow-lg backdrop-blur-sm
              ${isHovered ? 'h-7 shadow-xl shadow-indigo-500/25 scale-[1.02]' : 'h-6'}
              ${isVisible ? 'animate-pulse' : ''}
            `}
            style={{
              animationDuration: isVisible ? '3s' : undefined,
              animationTimingFunction: 'ease-in-out'
            }}
          >
            {/* Foundation texture */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10"></div>
            
            {/* Code pattern overlay */}
            <div className="absolute inset-0 opacity-15">
              <div className="h-full w-full bg-repeat-x" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 3h2v2H3V3zm4 0h2v2H7V3zm4 0h2v2h-2V3zm4 0h2v2h-2V3zM3 7h2v2H3V7zm4 0h2v2H7V7zm4 0h2v2h-2V7zm4 0h2v2h-2V7z' fill='%23ffffff' fill-opacity='0.4'/%3E%3C/svg%3E")`,
                backgroundSize: '24px 24px'
              }}></div>
            </div>
            
            {/* Animated code flow */}
            <div
              className={`
                absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                transition-transform duration-1500 ease-out
                ${isHovered ? 'translate-x-full' : '-translate-x-full'}
              `}
            />
            
            {/* Text overlay */}
            <div
              className={`
                absolute inset-0 flex items-center justify-center
                transition-all duration-300 ease-out
                ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
              `}
            >
              <span className="text-sm font-bold text-white drop-shadow-lg px-3 tracking-wide">
                🏗️ Built by Gho
              </span>
            </div>
          </div>
          
          {/* Foundation support pillars */}
          <div className="flex justify-between mt-1">
            <div className="w-1.5 h-1.5 bg-indigo-400/60 rounded-full shadow-sm"></div>
            <div className="w-1.5 h-1.5 bg-indigo-400/60 rounded-full shadow-sm"></div>
            <div className="w-1.5 h-1.5 bg-indigo-400/60 rounded-full shadow-sm"></div>
          </div>
        </div>
      </div>

      {/* Expanded State - Foundation Blueprint */}
      <div
        className={`
          absolute inset-0 z-50 transition-all duration-700 ease-out
          ${isExpanded ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'}
        `}
      >
        <Card className="p-6 shadow-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50 border-slate-300/60 relative overflow-hidden">
          {/* Blueprint grid background */}
          <div className="absolute inset-0 opacity-5">
            <div className="h-full w-full" style={{
              backgroundImage: `
                linear-gradient(rgba(71, 85, 105, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(71, 85, 105, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}></div>
          </div>

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 text-slate-400 hover:text-slate-600 z-10"
            onClick={handleToggle}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Foundation corner markers */}
          <div className="absolute top-4 left-4 w-3 h-3 border-l-2 border-t-2 border-slate-400/50"></div>
          <div className="absolute top-4 right-4 w-3 h-3 border-r-2 border-t-2 border-slate-400/50"></div>
          <div className="absolute bottom-4 left-4 w-3 h-3 border-l-2 border-b-2 border-slate-400/50"></div>
          <div className="absolute bottom-4 right-4 w-3 h-3 border-r-2 border-b-2 border-slate-400/50"></div>

          <div className="relative z-10 space-y-4">
            {/* Header - Foundation Title */}
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 p-3 rounded-xl shadow-lg border border-slate-500/20">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-800 text-lg">Application Foundation</h3>
                <p className="text-sm text-slate-600">PIJAR PRO - Sistem Pantau Material Konstruksi</p>
              </div>
              <Badge className="ml-auto bg-slate-100 text-slate-700 border-slate-300 font-mono">
                v1.0.0
              </Badge>
            </div>
            
            {/* Foundation motto */}
            <div className="text-center py-2 mb-3 border-y border-slate-200/50 bg-slate-50/30">
              <p className="text-xs text-slate-600 italic font-medium">
                Every great application is built on solid code foundation
              </p>
            </div>

            {/* Building Blocks */}
            <div className="grid grid-cols-3 gap-3 py-3 mb-3">
              <div className="text-center p-2 bg-slate-50 rounded-lg border border-slate-200/50">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
                  <span className="text-xs font-semibold text-slate-700">Next.js</span>
                </div>
                <p className="text-xs text-slate-500">Framework</p>
              </div>
              <div className="text-center p-2 bg-slate-50 rounded-lg border border-slate-200/50">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-3 h-3 bg-indigo-600 rounded-sm"></div>
                  <span className="text-xs font-semibold text-slate-700">TypeScript</span>
                </div>
                <p className="text-xs text-slate-500">Type Safety</p>
              </div>
              <div className="text-center p-2 bg-slate-50 rounded-lg border border-slate-200/50">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-3 h-3 bg-slate-600 rounded-sm"></div>
                  <span className="text-xs font-semibold text-slate-700">Tailwind</span>
                </div>
                <p className="text-xs text-slate-500">Styling</p>
              </div>
            </div>

            {/* Architect Info */}
            <div className="space-y-3 bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-lg border border-slate-200/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center shadow-lg border border-slate-500/20">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Gho</h4>
                  <p className="text-sm text-slate-600">Software Architect & Developer</p>
                  <p className="text-xs text-slate-500">Foundation Builder</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 pt-2 border-t border-slate-200/50">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  <span>Indonesia</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  <span>Oktober 2024</span>
                </div>
              </div>

              {/* Contact Links */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                  <Github className="h-3 w-3 mr-1" />
                  GitHub
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                  <Linkedin className="h-3 w-3 mr-1" />
                  LinkedIn
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                  <Mail className="h-3 w-3 mr-1" />
                  Email
                </Button>
              </div>
            </div>

            {/* Foundation Statement */}
            <div className="text-center pt-3 border-t border-slate-200/50 bg-slate-50/50 -mx-4 -mb-4 px-4 pb-4 mt-4">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Setiap baris kode adalah fondasi yang menopang aplikasi ini
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Dikembangkan dengan dedikasi untuk memudahkan manajemen inventori konstruksi
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};