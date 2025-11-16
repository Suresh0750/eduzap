import Image from "next/image";
import Header from "@/components/Header";
import RequestForm from "@/components/Request-form";
import Footer from "@/components/Footer";
import StatsWidget from "@/components/StatsWidget";
import RequestFilters from "@/components/RequestFilters";



export default function Home() {
  return (
   <div className="min-h-screen bg-background">
    <Header />
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <aside className="lg:col-span-1 space-y-6">
            <div className="lg:sticky lg:top-24">
              <RequestForm />
              <div className="mt-6">
              
              </div>
            </div>
          </aside>

          {/* Main Content - Dashboard & Table */}
          <section className="lg:col-span-3 space-y-6">
            {/* Info Banner */}
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

            <RequestFilters />

          </section>
        </div>
      </main>

      <Footer />
   </div>
  );
}
