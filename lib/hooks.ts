'use client';

import { useState, useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { IRequest } from './types';
import axios, { AxiosError } from 'axios';



export function useRequests() {
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | AxiosError | string | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<{ success: boolean; data: IRequest[] }>(
        `${process.env.NEXT_PUBLIC_SERVER}/requests`,
      );
      if (response.data.success) {
        console.log("data from backend",response)
        setRequests(response.data.data);
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
  }, []);

  useEffect(()=>{
    fetchRequests()
  },[])

  // useEffect(() => {
  //   fetchRequests();
  //   pollIntervalRef.current = setInterval(fetchRequests, 5000);
  //   return () => {
  //     if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
  //   };
  // }, [fetchRequests]);

  const mutate = useCallback(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    isLoading,
    error,
    mutate,
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
