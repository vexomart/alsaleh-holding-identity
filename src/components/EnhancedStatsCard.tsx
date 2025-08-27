import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface EnhancedStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  trend: string;
  trendIcon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  index: number;
}

export function EnhancedStatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendIcon: TrendIcon,
  color,
  bgColor,
  borderColor,
  index
}: EnhancedStatsCardProps) {
  return (
    <Card 
      className={`group relative overflow-hidden border-2 ${borderColor} ${bgColor} transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer animate-fade-in`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
        <div className={`w-full h-full bg-gradient-to-br ${color} rounded-full blur-3xl transform rotate-45 group-hover:scale-150 transition-transform duration-700`}></div>
      </div>
      
      <CardContent className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-foreground mb-1 group-hover:scale-110 transition-transform duration-300">
              {typeof value === 'number' && value > 999 ? 
                `${(value / 1000).toFixed(1)}K` : 
                value
              }
            </div>
            <div className="text-sm font-medium text-muted-foreground">{title}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendIcon className="w-4 h-4 text-success" />
            <span className="text-sm font-bold text-success">{trend}</span>
          </div>
          <span className="text-sm text-muted-foreground">{description}</span>
        </div>
        
        <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 group-hover:animate-pulse`}
            style={{ width: `${Math.min(Math.random() * 100 + 20, 100)}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
}