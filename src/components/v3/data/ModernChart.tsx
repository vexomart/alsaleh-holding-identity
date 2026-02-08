/**
 * Modern Chart Components
 * Stripe/Notion Inspired Data Visualizations
 * Clean, Minimal, Interactive
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import '@/styles/v3/modern-theme.css';

/* =========================================
   Chart Wrapper
   ========================================= */

interface ModernChartCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const ModernChartCard: React.FC<ModernChartCardProps> = ({
  title,
  description,
  action,
  children,
  className,
}) => {
  return (
    <div className={cn('modern-card', className)}>
      <div className="modern-card-header">
        <div>
          <h3 className="modern-card-title">{title}</h3>
          {description && (
            <p className="modern-card-description">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className="modern-card-content">
        {children}
      </div>
    </div>
  );
};

/* =========================================
   Color Palette
   ========================================= */

export const CHART_COLORS = {
  primary: 'hsl(217 91% 60%)',
  secondary: 'hsl(165 82% 51%)',
  accent: 'hsl(262 83% 58%)',
  success: 'hsl(152 69% 41%)',
  warning: 'hsl(38 92% 50%)',
  error: 'hsl(0 72% 51%)',
  muted: 'hsl(220 9% 46%)',
};

export const CHART_PALETTE = [
  'hsl(217 91% 60%)',
  'hsl(165 82% 51%)',
  'hsl(262 83% 58%)',
  'hsl(38 92% 50%)',
  'hsl(0 72% 51%)',
  'hsl(199 89% 48%)',
];

/* =========================================
   Custom Tooltip
   ========================================= */

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  formatter?: (value: any) => string;
  labelFormatter?: (label: string) => string;
}

export const ModernTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  formatter = (v) => String(v),
  labelFormatter = (l) => l,
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="modern-chart-tooltip">
      <p className="modern-chart-tooltip-label">{labelFormatter(label || '')}</p>
      {payload.map((entry, index) => (
        <div key={index} className="modern-chart-tooltip-item">
          <span 
            className="modern-chart-tooltip-dot"
            style={{ background: entry.color }}
          />
          <span className="modern-chart-tooltip-name">{entry.name}</span>
          <span className="modern-chart-tooltip-value">{formatter(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

/* =========================================
   Area Chart
   ========================================= */

interface AreaChartData {
  name: string;
  [key: string]: any;
}

interface ModernAreaChartProps {
  data: AreaChartData[];
  dataKey: string;
  xAxisKey?: string;
  color?: string;
  gradientId?: string;
  height?: number;
  showGrid?: boolean;
  showAxis?: boolean;
  formatter?: (value: any) => string;
  className?: string;
}

export const ModernAreaChart: React.FC<ModernAreaChartProps> = ({
  data,
  dataKey,
  xAxisKey = 'name',
  color = CHART_COLORS.primary,
  gradientId = 'areaGradient',
  height = 300,
  showGrid = true,
  showAxis = true,
  formatter = (v) => String(v),
  className,
}) => {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--modern-border-light))"
              vertical={false}
            />
          )}
          
          {showAxis && (
            <>
              <XAxis 
                dataKey={xAxisKey}
                tick={{ fill: 'hsl(var(--modern-text-muted))', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--modern-text-muted))', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
            </>
          )}
          
          <Tooltip content={<ModernTooltip formatter={formatter} />} />
          
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

/* =========================================
   Bar Chart
   ========================================= */

interface ModernBarChartProps {
  data: any[];
  dataKey: string;
  xAxisKey?: string;
  color?: string;
  height?: number;
  showGrid?: boolean;
  horizontal?: boolean;
  formatter?: (value: any) => string;
  className?: string;
}

export const ModernBarChart: React.FC<ModernBarChartProps> = ({
  data,
  dataKey,
  xAxisKey = 'name',
  color = CHART_COLORS.primary,
  height = 300,
  showGrid = true,
  horizontal = false,
  formatter = (v) => String(v),
  className,
}) => {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout={horizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--modern-border-light))"
              vertical={!horizontal}
              horizontal={horizontal}
            />
          )}
          
          <XAxis 
            dataKey={horizontal ? undefined : xAxisKey}
            type={horizontal ? 'number' : 'category'}
            tick={{ fill: 'hsl(var(--modern-text-muted))', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            dataKey={horizontal ? xAxisKey : undefined}
            type={horizontal ? 'category' : 'number'}
            tick={{ fill: 'hsl(var(--modern-text-muted))', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={horizontal ? 80 : 40}
          />
          
          <Tooltip content={<ModernTooltip formatter={formatter} />} />
          
          <Bar 
            dataKey={dataKey} 
            fill={color}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/* =========================================
   Pie/Donut Chart
   ========================================= */

interface PieChartData {
  name: string;
  value: number;
  color?: string;
}

interface ModernPieChartProps {
  data: PieChartData[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  showLabels?: boolean;
  formatter?: (value: any) => string;
  className?: string;
}

export const ModernPieChart: React.FC<ModernPieChartProps> = ({
  data,
  height = 300,
  innerRadius = 60,
  outerRadius = 100,
  showLegend = true,
  showLabels = false,
  formatter = (v) => String(v),
  className,
}) => {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            label={showLabels ? ({ name, percent }) => 
              `${name} ${(percent * 100).toFixed(0)}%` 
            : undefined}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || CHART_PALETTE[index % CHART_PALETTE.length]}
              />
            ))}
          </Pie>
          
          <Tooltip content={<ModernTooltip formatter={formatter} />} />
          
          {showLegend && (
            <Legend 
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span style={{ color: 'hsl(var(--modern-text-secondary))', fontSize: 12 }}>
                  {value}
                </span>
              )}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

/* =========================================
   Mini Sparkline
   ========================================= */

interface ModernSparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  showDot?: boolean;
  className?: string;
}

export const ModernSparkline: React.FC<ModernSparklineProps> = ({
  data,
  color = CHART_COLORS.primary,
  height = 40,
  width = 120,
  showDot = true,
  className,
}) => {
  const chartData = data.map((value, index) => ({ value, index }));
  const lastValue = data[data.length - 1];
  const firstValue = data[0];
  const isPositive = lastValue >= firstValue;
  const actualColor = color || (isPositive ? CHART_COLORS.success : CHART_COLORS.error);

  return (
    <div className={cn('inline-block', className)} style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={actualColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={actualColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={actualColor}
            strokeWidth={1.5}
            fill="url(#sparklineGradient)"
            dot={false}
            activeDot={showDot ? { r: 3, fill: actualColor } : false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

/* =========================================
   Progress Ring
   ========================================= */

interface ModernProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showValue?: boolean;
  label?: string;
  className?: string;
}

export const ModernProgressRing: React.FC<ModernProgressRingProps> = ({
  value,
  max = 100,
  size = 80,
  strokeWidth = 6,
  color = CHART_COLORS.primary,
  showValue = true,
  label,
  className,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = Math.min((value / max) * 100, 100);
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--modern-border-light))"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      
      {showValue && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            fontSize: size * 0.2,
            fontWeight: 600,
            color: 'hsl(var(--modern-text-primary))'
          }}
        >
          {Math.round(percent)}%
        </div>
      )}
      
      {label && (
        <span 
          className="mt-2 text-xs"
          style={{ color: 'hsl(var(--modern-text-muted))' }}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default ModernChartCard;
