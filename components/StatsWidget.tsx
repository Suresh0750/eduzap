'use client';

import { Card } from '@/components/ui/Card';
import { BarChart3, TrendingUp } from '@/components/Icons';


const StatsWidget = ()=>{
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-primary/20 bg-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Requests</p>
              <p className="text-3xl font-bold text-foreground">
                {0}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-primary/60" />
          </div>
        </Card>
  
        <Card className="p-4 border-primary/20 bg-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today&#39;s Requests</p>
              <p className="text-3xl font-bold text-foreground">
                {0}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-accent" />
          </div>
        </Card>
  
        <Card className="p-4 border-primary/20 bg-card">
          <div>
            <p className="text-sm text-muted-foreground mb-3">Top Request Titles</p>
            <div className="space-y-2">
              {Object.entries([])
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([title, count]) => (
                  <div key={title} className="flex justify-between items-center text-sm">
                    <span className="text-foreground truncate flex-1">
                      {title}
                    </span>
                    <span className="text-primary font-semibold ml-2">x{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      </div>
    )
}

export default StatsWidget;