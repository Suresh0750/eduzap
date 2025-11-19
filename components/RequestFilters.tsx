'use client'
import { Search, X, ArrowUpDown } from '@/components/Icons';
import { Input } from './ui/Input';
import { useEffect, useState } from 'react';
import { Button } from './ui/Button';
import { useDebounce } from '@/lib/hooks';

interface RequestFiltersProps {
  onSearchChange: (query: string) => void;
  onSortChange: (order: 'asc' | 'desc') => void;
  onClearSearch: () => void;
  currentSearch: string;
  currentSort: 'asc' | 'desc';
}

const RequestFilters = ({
  onSearchChange,
  onSortChange,
  onClearSearch,
  currentSearch,
  currentSort,
}: RequestFiltersProps)=> {
  const [localSearch, setLocalSearch] = useState(currentSearch);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    if(!debouncedSearch.trim()) return
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  const handleClear = () => {
    setLocalSearch('');
    onClearSearch();
  };
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search requests by title..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-10 pr-10"
        />
        {localSearch && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onSortChange(currentSort === 'asc' ? 'desc' : 'asc')}
        className="flex items-center gap-2 cursor-pointer"
      >
        <ArrowUpDown className="w-4 h-4" />
        {currentSort === 'asc' ? 'A → Z' : 'Z → A'}
      </Button>
    </div>
  );
}

export default RequestFilters;