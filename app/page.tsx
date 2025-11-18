"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import RequestForm from "@/components/Request-form";
import Footer from "@/components/Footer";
import StatsWidget from "@/components/StatsWidget";
import RequestFilters from "@/components/RequestFilters";
import RequestTable from "@/components/RequestTable";
import { useRequests } from "@/lib/hooks";
import { IRequest } from "@/lib/types";



export default function Home() {

  const { requests, mutate ,isLoading ,error } = useRequests();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;


  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };



  return (
   <div className="min-h-screen bg-background">
    <Header />
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <aside className="lg:col-span-1 space-y-6">
            <div className="lg:sticky lg:top-24">
              <RequestForm onSuccess={mutate} />
              <div className="mt-6">
              
              </div>
            </div>
          </aside>

          <section className="lg:col-span-3 space-y-6">
            <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg flex items-start gap-3">
              <div className="text-sm">
                <p className="font-medium text-foreground">
                  Advanced Features Active
                </p>
                <p className="text-muted-foreground mt-1">
                  This dashboard includes LRU caching, real-time updates, search with debouncing, and request statistics.
                </p>
              </div>
            </div>

            <StatsWidget />

            <RequestFilters 
             onSearchChange={handleSearchChange}
             onSortChange={setSortOrder}
             onClearSearch={handleClearSearch}
             currentSearch={searchQuery}
             currentSort={sortOrder}
             />

            <RequestTable
            searchQuery={searchQuery}
            sortOrder={sortOrder}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            requests = {requests}
            mutate = {mutate}
            isLoading = {isLoading}
            error = {error}
            />
            
          </section>
        </div>
      </main>

      <Footer />
   </div>
  );
}
