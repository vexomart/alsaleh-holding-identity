/**
 * V3 Table - 100% Custom Data Table
 * Command Center & Banking Portal variants
 * NO SHADCN
 */

import * as React from 'react';
import './V3Data.css';

export interface V3TableColumn<T> {
  key: keyof T | string;
  header: string;
  headerAr?: string;
  width?: string;
  align?: 'start' | 'center' | 'end';
  render?: (row: T, index: number) => React.ReactNode;
}

export interface V3TableProps<T> {
  context?: 'command' | 'bank';
  columns: V3TableColumn<T>[];
  data: T[];
  language?: 'ar' | 'en';
  loading?: boolean;
  emptyMessage?: string;
  emptyMessageAr?: string;
  onRowClick?: (row: T, index: number) => void;
  rowKey?: keyof T | ((row: T) => string);
  striped?: boolean;
  compact?: boolean;
  className?: string;
}

export function V3Table<T extends Record<string, any>>({
  context = 'command',
  columns,
  data,
  language = 'ar',
  loading = false,
  emptyMessage = 'No data available',
  emptyMessageAr = 'لا توجد بيانات',
  onRowClick,
  rowKey,
  striped = false,
  compact = false,
  className = '',
}: V3TableProps<T>) {
  const baseClass = context === 'command' ? 'cmd-table' : 'bank-table';
  const isAr = language === 'ar';

  const getRowKey = (row: T, index: number): string => {
    if (!rowKey) return String(index);
    if (typeof rowKey === 'function') return rowKey(row);
    return String(row[rowKey]);
  };

  const getCellValue = (row: T, column: V3TableColumn<T>, index: number): React.ReactNode => {
    if (column.render) {
      return column.render(row, index);
    }
    const value = row[column.key as keyof T];
    return value !== undefined && value !== null ? String(value) : '—';
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className={`${baseClass} ${baseClass}--loading ${className}`}>
        <div className={`${baseClass}__skeleton`}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`${baseClass}__skeleton-row`}>
              {columns.map((_, j) => (
                <div key={j} className={`${baseClass}__skeleton-cell`} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${baseClass} ${striped ? `${baseClass}--striped` : ''} ${compact ? `${baseClass}--compact` : ''} ${className}`}
    >
      <div className={`${baseClass}__wrapper`}>
        <table className={`${baseClass}__table`}>
          <thead className={`${baseClass}__thead`}>
            <tr>
              {columns.map((column) => (
                <th 
                  key={String(column.key)}
                  className={`${baseClass}__th`}
                  style={{ 
                    width: column.width,
                    textAlign: column.align || 'start',
                  }}
                >
                  {isAr && column.headerAr ? column.headerAr : column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`${baseClass}__tbody`}>
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length}
                  className={`${baseClass}__empty`}
                >
                  {isAr ? emptyMessageAr : emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr 
                  key={getRowKey(row, index)}
                  className={`${baseClass}__tr ${onRowClick ? `${baseClass}__tr--clickable` : ''}`}
                  onClick={() => onRowClick?.(row, index)}
                >
                  {columns.map((column) => (
                    <td 
                      key={String(column.key)}
                      className={`${baseClass}__td`}
                      style={{ textAlign: column.align || 'start' }}
                    >
                      {getCellValue(row, column, index)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

V3Table.displayName = 'V3Table';
