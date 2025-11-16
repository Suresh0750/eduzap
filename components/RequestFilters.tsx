'use client'
import { Search, X, ArrowUpDown } from '@/components/Icons';
import { Input } from './ui/Input';
import { useState } from 'react';
import { Button } from './ui/Button';

const RequestFilters = ()=>{

    const [localSearch,setLocalSearch] = useState("")

    const handleClear = ()=>{

    }

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
            onClick={() => {}}
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="w-4 h-4" />
            {"asc" === 'asc' ? 'A → Z' : 'Z → A'}
          </Button>
        </div>
      );
}

export default RequestFilters;