'use client';

import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from '@/components/Icons';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}: PaginationControlsProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between gap-4 p-4 border border-primary/20 rounded-lg bg-card">
      <span className="text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems} requests
      </span>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={currentPage === 1 ? "" : "cursor-pointer"}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.max(1, totalPages) }).map((_, i) => {
            
            const page = i+1
            return (
              <Button
                key={i}
                variant={page === currentPage ? 'default' : 'outline'}
                className={page === currentPage ? '' : 'cursor-pointer'}
                size="sm"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={currentPage === totalPages ? "" : "cursor-pointer"}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
