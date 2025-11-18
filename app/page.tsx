"use client"
import { useCallback } from "react";
import Header from "@/components/Header";
import RequestForm from "@/components/Request-form";
import Footer from "@/components/Footer";
import RequestFilters from "@/components/RequestFilters";
import RequestTable from "@/components/RequestTable";
import { useRequests } from "@/lib/hooks";



export default function Home() {

  const { requests, mutate ,isLoading ,error, filters : {
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    itemsPerPage,
    totalCount,
  } } = useRequests();

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, [setSearchQuery, setCurrentPage]);
  
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setCurrentPage(1);
  }, [setSearchQuery, setCurrentPage]);
  




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
            onPageChange={setCurrentPage}
            totalCount = {totalCount}
            />
            
          </section>
        </div>
      </main>

      <Footer />
   </div>
  );
}
