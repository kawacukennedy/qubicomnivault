import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface Column<T> {
  id: string;
  label: string;
  accessor: keyof T | ((item: T) => any);
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowHeight?: number;
  onRowClick?: (item: T) => void;
  className?: string;
}

function Table<T extends Record<string, any>>({
  data,
  columns,
  rowHeight = 56,
  onRowClick,
  className,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const column = columns.find(col => col.id === sortConfig.key);
      if (!column) return 0;

      const aValue = typeof column.accessor === 'function' ? column.accessor(a) : a[column.accessor as keyof T];
      const bValue = typeof column.accessor === 'function' ? column.accessor(b) : b[column.accessor as keyof T];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig, columns]);

  const handleSort = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column?.sortable) return;

    setSortConfig(current => {
      if (current?.key === columnId) {
        return current.direction === 'asc' ? { key: columnId, direction: 'desc' } : null;
      }
      return { key: columnId, direction: 'asc' };
    });
  };

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-200">
            {columns.map(column => (
              <th
                key={column.id}
                className={cn(
                  'text-left py-3 px-4 text-sm font-medium text-neutral-700',
                  column.sortable && 'cursor-pointer hover:bg-neutral-50'
                )}
                onClick={() => handleSort(column.id)}
              >
                <div className="flex items-center gap-1">
                  {column.label}
                  {column.sortable && (
                    <svg
                      className={cn(
                        'w-4 h-4 transition-transform',
                        sortConfig?.key === column.id && sortConfig.direction === 'desc' && 'rotate-180'
                      )}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <motion.tr
              key={index}
              className={cn(
                'border-b border-neutral-100 hover:bg-neutral-50 transition-colors',
                onRowClick && 'cursor-pointer'
              )}
              style={{ height: rowHeight }}
              onClick={() => onRowClick?.(item)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {columns.map(column => {
                const value = typeof column.accessor === 'function' ? column.accessor(item) : item[column.accessor as keyof T];
                return (
                  <td key={column.id} className="py-3 px-4">
                    {column.render ? column.render(value, item) : value}
                  </td>
                );
              })}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { Table };