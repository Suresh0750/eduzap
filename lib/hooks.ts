'use client';

import { useState, useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { IRequest } from './types';
import axios, { AxiosError } from 'axios';


export interface IMeta {
  totalCount: number;
  page: number;
  limit: number;
  hasMore: boolean;
}



export function useRequests() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [cacheRequest, setCacheRequest] = useState<Record<string, IRequest[]>>({});
  const [cacheCount, setCacheCount] = useState<Record<string, number>>({});
  const itemsPerPage = 5;

  const [requests, setRequests] = useState<IRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | AxiosError | string | null>(null);

  const createKey = useCallback(
    (search: string, sortOrder: string, page: number, limit: number) =>
      `${search ?? ''}::${sortOrder ?? ''}::${page ?? 0}::${limit ?? 0}`,
    [],
  );

  const fetchRequests = useCallback(async () => {
    const key = createKey(searchQuery, sortOrder, currentPage, itemsPerPage);
    if (cacheRequest[key]) {
      setRequests(cacheRequest[key]);
      const cachedCount = cacheCount[key];
      if (typeof cachedCount === 'number') {
        setTotalCount(cachedCount);
        setHasMore(currentPage * itemsPerPage < cachedCount);
      } else {
        setHasMore(false);
      }
      setIsLoading(false);
      setError(null);
      return;
    }
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();

      if (searchQuery) {
        queryParams.append('search', searchQuery);
      }
      if (sortOrder) {
        queryParams.append('sortOrder', sortOrder);
      }
      if (currentPage) {
        queryParams.append('page', currentPage.toString());
      }
      if (itemsPerPage) {
        queryParams.append('limit', itemsPerPage.toString());
      }
      
      const queryString = queryParams.toString();
      const url = `${process.env.NEXT_PUBLIC_SERVER}/requests${queryString ? `?${queryString}` : ''}`;
      
      const response = await axios.get<{
        success: boolean;
        data: IRequest[];
        meta: IMeta;
      }>(url);
      
      if (response.data.success) {
        console.log("data from backend", response);
        setRequests(response.data.data);
        setHasMore(response.data?.meta?.hasMore || false) 
        setTotalCount(response.data?.meta?.totalCount || 0)
       

        // * cache the user request

        setCacheRequest((prev)=>({
          ...prev,
          [key] : response.data.data
        }))
        setCacheCount((prev)=>({
          ...prev,
          [key] : response.data?.meta?.totalCount
        }))

      }
      
      setError(null);
    } catch (err: unknown) {  
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, sortOrder, itemsPerPage, currentPage, cacheRequest, cacheCount, createKey]);


  useEffect(()=>{
    fetchRequests?.()
  },[fetchRequests])

  const mutate = useCallback(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    isLoading,
    error,
    mutate,
    filters : {
      totalCount,
      hasMore,
      currentPage,
      setCurrentPage,
      searchQuery,
      setSearchQuery,
      sortOrder,
      setSortOrder,
      itemsPerPage
    }
  };
  
}


export function useRequestStats(requests: IRequest[]) {
  return useCallback(() => {
    const totalRequests = requests.length;
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const todayRequests = requests.filter(req => 
      new Date(req.timestamp) >= oneDayAgo
    ).length;

    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const recentRequests = requests.filter(req => 
      new Date(req.timestamp) >= oneHourAgo
    );

    const titleStats = requests.reduce((acc, req) => {
      acc[req.title] = (acc[req.title] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRequests,
      todayRequests,
      recentRequests,
      titleStats,
    };
  }, [requests]);
}

export function useDebounce<T>(value: T, delayMs: number = 300) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delayMs]);

  return debouncedValue;
}

const LOCAL_STORAGE_EVENT = 'eduzap-local-storage';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const getSnapshot = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const subscribe = useCallback(
    (listener: () => void) => {
      if (typeof window === 'undefined') {
        return () => {};
      }

      const storageHandler = (event: StorageEvent) => {
        if (event.key === key) {
          listener();
        }
      };

      const customHandler = (event: Event) => {
        const detail = (event as CustomEvent<string | undefined>).detail;
        if (!detail || detail === key) {
          listener();
        }
      };

      window.addEventListener('storage', storageHandler);
      window.addEventListener(LOCAL_STORAGE_EVENT, customHandler);

      return () => {
        window.removeEventListener('storage', storageHandler);
        window.removeEventListener(LOCAL_STORAGE_EVENT, customHandler);
      };
    },
    [key],
  );

  const storedValue = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => initialValue,
  );

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      if (typeof window === 'undefined') {
        return;
      }

      try {
        const currentValue = getSnapshot();
        const valueToStore = value instanceof Function ? value(currentValue) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        window.dispatchEvent(new CustomEvent(LOCAL_STORAGE_EVENT, { detail: key }));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [getSnapshot, key],
  );

  return [storedValue, setValue] as const;
}
