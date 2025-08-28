import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  totalCount?: number;
  onSortChange?: (key: keyof T, direction: "asc" | "desc") => void;
  sortKey?: keyof T;
  sortDirection?: "asc" | "desc";
  selectableRows?: boolean;
  selectedRows?: string[];
  onSelectRow?: (id: string) => void;
  onSelectAll?: () => void;
  rowKey: (row: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  pageSize = 10,
  currentPage: controlledPage,
  onPageChange,
  totalCount,
  onSortChange,
  sortKey,
  sortDirection,
  selectableRows = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  rowKey,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const isControlled = typeof controlledPage === "number" && !!onPageChange;
  const currentPage = isControlled ? controlledPage! : page;
  const pageCount = totalCount
    ? Math.ceil(totalCount / pageSize)
    : Math.ceil(data.length / pageSize);

  const handlePageChange = (newPage: number) => {
    if (isControlled && onPageChange) onPageChange(newPage);
    else setPage(newPage);
  };

  const handleSort = (col: Column<T>) => {
    if (!col.sortable || !onSortChange) return;
    let direction: "asc" | "desc" = "asc";
    if (sortKey === col.key && sortDirection === "asc") direction = "desc";
    onSortChange(col.key, direction);
  };

  // Paginate data if not controlled
  const pagedData = isControlled
    ? data
    : data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {selectableRows && (
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={
                    selectedRows.length > 0 &&
                    pagedData.every((row) => selectedRows.includes(rowKey(row)))
                  }
                  onChange={onSelectAll}
                  className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
              </TableHead>
            )}
            {columns.map((col) => (
              <TableHead
                key={String(col.key)}
                className={col.className || ""}
                onClick={() => col.sortable && handleSort(col)}
                style={col.sortable ? { cursor: "pointer" } : {}}
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  {col.sortable &&
                    sortKey === col.key &&
                    (sortDirection === "asc" ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    ))}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagedData.length > 0 ? (
            pagedData.map((row) => (
              <TableRow key={rowKey(row)}>
                {selectableRows && (
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(rowKey(row))}
                      onChange={() => onSelectRow && onSelectRow(rowKey(row))}
                      className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell
                    key={String(col.key)}
                    className={col.className || ""}
                  >
                    {col.render ? col.render(row) : (row[col.key] as any)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + (selectableRows ? 1 : 0)}
                className="h-24 text-center text-gray-500 dark:text-gray-400"
              >
                ไม่พบข้อมูล
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-end gap-2 mt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            aria-label="หน้าแรก"
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="ก่อนหน้า"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium">
            หน้า {currentPage} / {pageCount}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pageCount}
            aria-label="ถัดไป"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handlePageChange(pageCount)}
            disabled={currentPage === pageCount}
            aria-label="หน้าสุดท้าย"
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
