import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const BookingHistorySkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div 
          key={index} 
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingHistorySkeleton;