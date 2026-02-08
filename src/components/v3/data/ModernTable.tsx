/**
 * Modern Table Components
 * Stripe/Notion/Apple Inspired
 * Professional Data Tables with RTL Support
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit3,
  Trash2,
  ExternalLink
} from 'lucide-react';
import '@/styles/v3/modern-theme.css';

/* =========================================
   Table Container
   ========================================= */

interface ModernTableProps {
  children: React.ReactNode;
  className?: string;
}

export const ModernTable: React.FC<ModernTableProps> = ({ children, className }) => {
  return (
    <div className={cn('modern-card overflow-hidden', className)}>
      <div className="modern-table-wrapper">
        <table className="modern-table">
          {children}
        </table>
      </div>
    </div>
  );
};

/* =========================================
   Table Header
   ========================================= */

interface ModernTableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const ModernTableHeader: React.FC<ModernTableHeaderProps> = ({ children, className }) => {
  return (
    <thead className={cn('modern-table-header', className)}>
      {children}
    </thead>
  );
};

/* =========================================
   Table Body
   ========================================= */

interface ModernTableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const ModernTableBody: React.FC<ModernTableBodyProps> = ({ children, className }) => {
  return (
    <tbody className={cn('modern-table-body', className)}>
      <AnimatePresence mode="sync">
        {children}
      </AnimatePresence>
    </tbody>
  );
};

/* =========================================
   Table Row
   ========================================= */

interface ModernTableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
  isNew?: boolean;
}

export const ModernTableRow: React.FC<ModernTableRowProps> = ({ 
  children, 
  className, 
  onClick,
  isSelected,
  isNew 
}) => {
  return (
    <motion.tr
      initial={isNew ? { opacity: 0, backgroundColor: 'hsl(var(--modern-success-bg))' } : false}
      animate={{ opacity: 1, backgroundColor: 'transparent' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'modern-table-row',
        onClick && 'cursor-pointer',
        isSelected && 'selected',
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.tr>
  );
};

/* =========================================
   Table Head Cell
   ========================================= */

interface ModernTableHeadProps {
  children?: React.ReactNode;
  className?: string;
  sortable?: boolean;
  sorted?: 'asc' | 'desc' | null;
  onSort?: () => void;
  align?: 'start' | 'center' | 'end';
  width?: string;
}

export const ModernTableHead: React.FC<ModernTableHeadProps> = ({ 
  children, 
  className,
  sortable,
  sorted,
  onSort,
  align = 'start',
  width
}) => {
  return (
    <th 
      className={cn(
        'modern-table-th',
        sortable && 'sortable',
        sorted && 'sorted',
        `text-${align}`,
        className
      )}
      style={{ width }}
      onClick={sortable ? onSort : undefined}
    >
      <div className="flex items-center gap-2">
        <span>{children}</span>
        {sortable && (
          <span className="modern-table-sort-icon">
            {sorted === 'asc' ? (
              <ArrowUp size={14} />
            ) : sorted === 'desc' ? (
              <ArrowDown size={14} />
            ) : (
              <div className="opacity-30">
                <ArrowUp size={14} />
              </div>
            )}
          </span>
        )}
      </div>
    </th>
  );
};

/* =========================================
   Table Cell
   ========================================= */

interface ModernTableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
  highlight?: boolean;
}

export const ModernTableCell: React.FC<ModernTableCellProps> = ({ 
  children, 
  className,
  align = 'start',
  highlight
}) => {
  return (
    <td 
      className={cn(
        'modern-table-td',
        `text-${align}`,
        highlight && 'font-medium',
        className
      )}
    >
      {children}
    </td>
  );
};

/* =========================================
   Table Actions
   ========================================= */

interface TableAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface ModernTableActionsProps {
  actions: TableAction[];
  className?: string;
}

export const ModernTableActions: React.FC<ModernTableActionsProps> = ({ actions, className }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show inline for 3 or fewer actions
  if (actions.length <= 3) {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        {actions.map((action) => (
          <button
            key={action.id}
            className={cn(
              'modern-table-action-btn',
              action.variant === 'danger' && 'danger'
            )}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick();
            }}
            title={action.label}
          >
            {action.icon}
          </button>
        ))}
      </div>
    );
  }

  // Dropdown for more actions
  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        className="modern-table-action-btn"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <MoreHorizontal size={16} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15 }}
            className="modern-table-dropdown"
          >
            {actions.map((action) => (
              <button
                key={action.id}
                className={cn(
                  'modern-table-dropdown-item',
                  action.variant === 'danger' && 'danger'
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                  setIsOpen(false);
                }}
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* =========================================
   Table Toolbar
   ========================================= */

interface ModernTableToolbarProps {
  title?: string;
  description?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
  className?: string;
}

export const ModernTableToolbar: React.FC<ModernTableToolbarProps> = ({
  title,
  description,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'بحث...',
  actions,
  filters,
  className,
}) => {
  return (
    <div className={cn('modern-card-header flex-col sm:flex-row gap-4', className)}>
      {(title || description) && (
        <div className="flex-1">
          {title && <h3 className="modern-card-title">{title}</h3>}
          {description && <p className="modern-card-description">{description}</p>}
        </div>
      )}
      
      <div className="flex items-center gap-3 flex-wrap">
        {onSearchChange && (
          <div className="modern-search-input">
            <Search size={16} className="modern-search-icon" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="modern-search-field"
            />
          </div>
        )}
        
        {filters}
        {actions}
      </div>
    </div>
  );
};

/* =========================================
   Table Pagination
   ========================================= */

interface ModernTablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showingText?: string;
  className?: string;
}

export const ModernTablePagination: React.FC<ModernTablePaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showingText = 'عرض',
  className,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={cn('modern-card-footer flex items-center justify-between', className)}>
      <div 
        className="text-sm"
        style={{ color: 'hsl(var(--modern-text-muted))' }}
      >
        {showingText} {startItem}-{endItem} من {totalItems}
      </div>
      
      <div className="flex items-center gap-1">
        <button
          className="modern-pagination-btn"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          title="الصفحة الأولى"
        >
          <ChevronsRight size={16} />
        </button>
        <button
          className="modern-pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="السابق"
        >
          <ChevronRight size={16} />
        </button>
        
        <div 
          className="px-3 text-sm font-medium"
          style={{ color: 'hsl(var(--modern-text-primary))' }}
        >
          {currentPage} / {totalPages}
        </div>
        
        <button
          className="modern-pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="التالي"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          className="modern-pagination-btn"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          title="الصفحة الأخيرة"
        >
          <ChevronsLeft size={16} />
        </button>
      </div>
    </div>
  );
};

/* =========================================
   Table Empty State
   ========================================= */

interface ModernTableEmptyProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  colSpan: number;
}

export const ModernTableEmpty: React.FC<ModernTableEmptyProps> = ({
  icon,
  title,
  description,
  action,
  colSpan,
}) => {
  return (
    <tr>
      <td colSpan={colSpan} className="py-16">
        <div className="flex flex-col items-center justify-center text-center">
          {icon && (
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ 
                background: 'hsl(var(--modern-bg-elevated))',
                color: 'hsl(var(--modern-text-muted))'
              }}
            >
              {icon}
            </div>
          )}
          <h4 
            className="font-medium mb-1"
            style={{ color: 'hsl(var(--modern-text-primary))' }}
          >
            {title}
          </h4>
          {description && (
            <p 
              className="text-sm mb-4"
              style={{ color: 'hsl(var(--modern-text-muted))' }}
            >
              {description}
            </p>
          )}
          {action}
        </div>
      </td>
    </tr>
  );
};

/* =========================================
   Status Badge for Tables
   ========================================= */

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'pending';

interface ModernStatusBadgeProps {
  status: StatusType;
  label: string;
  icon?: React.ReactNode;
  pulse?: boolean;
}

export const ModernStatusBadge: React.FC<ModernStatusBadgeProps> = ({
  status,
  label,
  icon,
  pulse
}) => {
  const statusColors: Record<StatusType, { bg: string; text: string; dot: string }> = {
    success: { 
      bg: 'hsl(var(--modern-success-bg))', 
      text: 'hsl(var(--modern-success))',
      dot: 'hsl(var(--modern-success))'
    },
    warning: { 
      bg: 'hsl(var(--modern-warning-bg))', 
      text: 'hsl(var(--modern-warning))',
      dot: 'hsl(var(--modern-warning))'
    },
    error: { 
      bg: 'hsl(var(--modern-error-bg))', 
      text: 'hsl(var(--modern-error))',
      dot: 'hsl(var(--modern-error))'
    },
    info: { 
      bg: 'hsl(var(--modern-info-bg))', 
      text: 'hsl(var(--modern-info))',
      dot: 'hsl(var(--modern-info))'
    },
    neutral: { 
      bg: 'hsl(var(--modern-bg-elevated))', 
      text: 'hsl(var(--modern-text-secondary))',
      dot: 'hsl(var(--modern-text-muted))'
    },
    pending: { 
      bg: 'hsl(38 92% 96%)', 
      text: 'hsl(38 92% 40%)',
      dot: 'hsl(38 92% 50%)'
    },
  };

  const colors = statusColors[status];

  return (
    <span 
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: colors.bg, color: colors.text }}
    >
      {pulse ? (
        <span className="relative flex h-2 w-2">
          <span 
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ background: colors.dot }}
          />
          <span 
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ background: colors.dot }}
          />
        </span>
      ) : icon ? (
        icon
      ) : (
        <span 
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: colors.dot }}
        />
      )}
      {label}
    </span>
  );
};

export default ModernTable;
