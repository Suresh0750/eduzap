'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Trash2, Loader2 } from '@/components/Icons';
import Image from 'next/image';
import { IRequest } from '@/lib/types';
import { PaginationControls } from '@/components/pagination-controls';
import axios from 'axios';
import { toast } from "sonner";


export interface RequestTableProps {
    searchQuery?: string;
    sortOrder?: "asc" | "desc";
    currentPage?: number;
    itemsPerPage?: number;
    totalCount ? : number;
    requests?: IRequest[];
    isLoading?: boolean;
    error?: string | Error | null;
    mutate?: () => void | Promise<void>;
    onPageChange?: (page: number) => void;
  }
  

  const RequestTable = ({
    currentPage = 1,
    totalCount = 0,
    itemsPerPage = 5,
    requests = [],
    isLoading = false,
    error = null,
    mutate,
    onPageChange,
  }: RequestTableProps) => {
  

    const [displayRequests, setDisplayRequests] = useState<IRequest[]>(requests);
    const [deletingId, setDeletingId] = useState<string | null>(null);

   


      useEffect(()=>{
          if(requests){
            setDisplayRequests(requests)
          }
      },[requests])

      const isRecentRequest = (timestamp: string): boolean => {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return new Date(timestamp) >= oneHourAgo;
      };

      const formatDate = (timestamp: string): string => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      };
      const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
          const response = await axios.delete<{
            success: boolean,
            data : IRequest
          }>(`${process.env.NEXT_PUBLIC_SERVER}/requests/${id}`);
    
          if (response.data.success) {
            toast.success("Request successfully deleted")
            mutate?.();
          } else {
            toast.error('Failed to delete request');
          }
        } catch (error) {
          toast.error('Error deleting request');
        } finally {
          setDeletingId(null);
        }
      };    


      const totalPages = useMemo(()=>{
        return Math.ceil(totalCount/itemsPerPage)
      },[totalCount,itemsPerPage])
      
      
      if (isLoading) {
        return (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        );
      }
    
      if (error) {
        return (
          <Card className="p-6 border-destructive/50 bg-destructive/10">
            <p className="text-destructive font-semibold">Error loading requests</p>
            <p className="text-destructive/80 text-sm mt-1">Please try again later</p>
          </Card>
        );
      }
    
      if (displayRequests.length === 0) {
        return (
          <Card className="p-12 text-center border-primary/20">
            <p className="text-muted-foreground text-lg">No requests found</p>
          </Card>
        );
      }
    
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {requests?.map(request => (
              <Card
                key={request.id || request._id}
                className={`p-4 border ${
                  isRecentRequest(request.timestamp)
                    ? 'border-primary/40 bg-primary/5 dark:bg-primary/10'
                    : 'border-primary/20'
                } transition-all duration-300 hover:border-primary/60`}
              >
                <div className="flex gap-4">
                  {request.image && (
                    <Image
                      src={request.image || "/placeholder.svg"}
                      alt={request.title}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                    />
                  )}
    
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-foreground text-balance">
                          {request.title}
                        </h3>
                        {isRecentRequest(request.timestamp) && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded">
                            Recent
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(request.id || request._id || '')}
                        disabled={deletingId === request.id || deletingId === request._id}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        {deletingId === request.id || deletingId === request._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>itemsPerPage
    
                    <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Name:</span>
                        <p className="font-medium text-foreground">{request.name}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Phone:</span>
                        <p className="font-medium text-foreground">{request.phone}</p>
                      </div>
                    </div>
    
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDate(request.timestamp)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
    
          {displayRequests.length > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={Math.max(totalPages, 1)}
              onPageChange={(page) => onPageChange?.(page)}
            />
          )}
        </div>
      );
}

export default RequestTable;