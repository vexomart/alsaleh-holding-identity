/**
 * HeaderDropdown - Premium Mega Menu Component
 * Enterprise-grade dropdown with animations and modern design
 */

import * as React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronLeft, ArrowLeft, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavItem } from './types';

interface HeaderDropdownProps {
  label: string;
  items: NavItem[];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  variant?: 'default' | 'mega';
}

export function HeaderDropdown({ 
  label, 
  items, 
  isOpen, 
  onOpen, 
  onClose,
  variant = 'default' 
}: HeaderDropdownProps) {
  const location = useLocation();
  const hideTimeoutRef = React.useRef<number>();

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    onOpen();
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = window.setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleTriggerClick = () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  const isActive = items.some(item => {
    if (item.href === '/') return location.pathname === '/';
    return location.pathname.startsWith(item.href);
  });

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <motion.button 
        onClick={handleTriggerClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300',
          isActive || isOpen
            ? 'text-primary bg-primary/10 shadow-sm' 
            : 'text-foreground hover:text-primary hover:bg-muted/80'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              'absolute top-full start-0 mt-3 bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50 z-50 overflow-hidden',
              variant === 'mega' ? 'min-w-[480px]' : 'min-w-[300px]'
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Top Gradient Border */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-l from-primary via-accent to-secondary" />
            
            <div className="p-3">
              {/* Header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">{label}</span>
                </div>
                <span className="text-xs text-muted-foreground">{items.length} خيارات</span>
              </div>

              {variant === 'mega' ? (
                <div className="grid grid-cols-2 gap-2">
                  {items.map((item, index) => (
                    <DropdownMegaItem key={index} item={item} onNavigate={onClose} index={index} />
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {items.map((item, index) => (
                    <DropdownItem key={index} item={item} onNavigate={onClose} index={index} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Standard Dropdown Item
function DropdownItem({ item, onNavigate, index }: { item: NavItem; onNavigate: () => void; index: number }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = item.href === '/' 
    ? location.pathname === '/' 
    : location.pathname.startsWith(item.href);
  const Icon = item.icon;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onNavigate();
    navigate(item.href);
  };

  return (
    <motion.a
      href={item.href}
      onClick={handleClick}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 group cursor-pointer',
        isActive 
          ? 'bg-primary/10 text-primary font-medium shadow-sm' 
          : 'text-foreground hover:bg-muted hover:text-primary'
      )}
    >
      {Icon && (
        <div className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300',
          isActive 
            ? 'bg-primary text-white shadow-lg shadow-primary/30' 
            : 'bg-muted group-hover:bg-primary/10 group-hover:text-primary'
        )}>
          <Icon className="w-4 h-4" />
        </div>
      )}
      <span className="flex-1 font-medium">{item.name}</span>
      <ArrowLeft className={cn(
        'w-4 h-4 opacity-0 translate-x-2 transition-all duration-300',
        'group-hover:opacity-100 group-hover:translate-x-0',
        isActive && 'text-primary'
      )} />
    </motion.a>
  );
}

// Mega Menu Item with Description
function DropdownMegaItem({ item, onNavigate, index }: { item: NavItem; onNavigate: () => void; index: number }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = item.href === '/' 
    ? location.pathname === '/' 
    : location.pathname.startsWith(item.href);
  const Icon = item.icon;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onNavigate();
    navigate(item.href);
  };

  return (
    <motion.a
      href={item.href}
      onClick={handleClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        'flex items-start gap-3 p-3 rounded-xl text-sm transition-all duration-300 group cursor-pointer relative overflow-hidden',
        isActive 
          ? 'bg-primary/10 shadow-sm' 
          : 'hover:bg-muted/80'
      )}
    >
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {Icon && (
        <div className={cn(
          'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 relative z-10',
          isActive 
            ? 'bg-primary text-white shadow-lg shadow-primary/30' 
            : 'bg-muted group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/20'
        )}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className="flex-1 min-w-0 relative z-10">
        <span className={cn(
          'block font-bold mb-0.5 transition-colors duration-300',
          isActive ? 'text-primary' : 'text-foreground group-hover:text-primary'
        )}>
          {item.name}
        </span>
        {item.description && (
          <span className="block text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {item.description}
          </span>
        )}
      </div>
      <ChevronLeft className={cn(
        'w-4 h-4 mt-1.5 opacity-0 -translate-x-2 transition-all duration-300 relative z-10',
        'group-hover:opacity-100 group-hover:translate-x-0',
        isActive ? 'text-primary' : 'text-muted-foreground'
      )} />
    </motion.a>
  );
}
