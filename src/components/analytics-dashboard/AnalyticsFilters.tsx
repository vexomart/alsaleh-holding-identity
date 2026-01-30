import React from 'react';
import { Calendar, Filter, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useLanguage } from '@/hooks/useLanguage';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AnalyticsFiltersProps {
  dateRange: { from: Date | undefined; to: Date | undefined };
  setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  category: string;
  setCategory: (category: string) => void;
  project: string;
  setProject: (project: string) => void;
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  dateRange,
  setDateRange,
  category,
  setCategory,
  project,
  setProject,
}) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const categories = [
    { value: 'all', label: isRTL ? 'جميع الفئات' : 'All Categories' },
    { value: 'technology', label: isRTL ? 'التكنولوجيا' : 'Technology' },
    { value: 'media', label: isRTL ? 'الإعلام' : 'Media' },
    { value: 'finance', label: isRTL ? 'المالية' : 'Finance' },
    { value: 'real-estate', label: isRTL ? 'العقارات' : 'Real Estate' },
  ];

  const projects = [
    { value: 'all', label: isRTL ? 'جميع المشاريع' : 'All Projects' },
    { value: 'project-alpha', label: isRTL ? 'مشروع ألفا' : 'Project Alpha' },
    { value: 'project-beta', label: isRTL ? 'مشروع بيتا' : 'Project Beta' },
    { value: 'project-gamma', label: isRTL ? 'مشروع جاما' : 'Project Gamma' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-card rounded-xl border border-border/50">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">
          {isRTL ? 'تصفية:' : 'Filter:'}
        </span>
      </div>

      {/* Date Range Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal h-9",
              !dateRange.from && "text-muted-foreground"
            )}
          >
            <Calendar className="w-4 h-4 me-2" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
                </>
              ) : (
                format(dateRange.from, "MMM d, yyyy")
              )
            ) : (
              <span>{isRTL ? 'اختر التاريخ' : 'Pick a date'}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* Category Select */}
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-[160px] h-9">
          <SelectValue placeholder={isRTL ? 'الفئة' : 'Category'} />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Project Select */}
      <Select value={project} onValueChange={setProject}>
        <SelectTrigger className="w-[160px] h-9">
          <FolderOpen className="w-4 h-4 me-2" />
          <SelectValue placeholder={isRTL ? 'المشروع' : 'Project'} />
        </SelectTrigger>
        <SelectContent>
          {projects.map((proj) => (
            <SelectItem key={proj.value} value={proj.value}>
              {proj.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Reset Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setDateRange({ from: undefined, to: undefined });
          setCategory('all');
          setProject('all');
        }}
        className="text-muted-foreground hover:text-foreground"
      >
        {isRTL ? 'إعادة تعيين' : 'Reset'}
      </Button>
    </div>
  );
};
