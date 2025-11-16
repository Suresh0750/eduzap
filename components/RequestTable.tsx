'use client';

import { useState, } from 'react'
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Trash2, Loader2, Clock, Heart } from '@/components/Icons';
import Image from 'next/image';



const RequestTable = ()=>{

    return (
        <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
            {[].map((request, index) => (
            <Card
                key={index }
                className={`p-4 border transition-all duration-300 hover:shadow-lg ${
                false
                    ? 'border-primary/40 bg-gradient-to-r from-primary/5 to-transparent dark:from-primary/10'
                    : 'border-primary/20 hover:border-primary/40'
                } animate-in fade-in slide-in-from-bottom-2`}
                style={{ animationDelay: `${index * 50}ms` }}
            >
                <div className="flex gap-4">
                {false && (
                    <Image
                    src={ "/placeholder.svg"}
                    alt={"title"}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0 border border-primary/20"
                    />
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-balance">
                        <title></title>
                        </h3>
                        {false && (
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                            <Clock className="w-3 h-3" />
                            Recent
                        </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                        {}
                        }
                        className="text-muted-foreground hover:text-accent"
                        >
                        <Heart
                            className={`w-4 h-4 `}
                        />
                        </Button>
                        <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>{}}
                        disabled={
                            false
                        }
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                        {false ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                        </Button>
                    </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div>
                        <span className="text-muted-foreground text-xs">Name</span>
                        <p className="font-medium text-foreground">name</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground text-xs">Phone</span>
                        <p className="font-medium text-foreground">
                        <a
                            href={`tel:${"request.phone"}`}
                            className="text-primary hover:underline"
                        >
                            {"phone"}
                        </a>
                        </p>
                    </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    
                    </p>
                </div>
                </div>
            </Card>
            ))}
        </div>

        {3 > 1 && (
            <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled={1 === 1}>
                Previous
            </Button>
            <span className="text-sm text-muted-foreground">
                Page {1} of {10}
            </span>
            <Button variant="outline" size="sm" disabled={10 === 10}>
                Next
            </Button>
            </div>
        )}
        </div>
    );
}

export default RequestTable;