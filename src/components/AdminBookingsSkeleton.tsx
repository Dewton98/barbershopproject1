import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const AdminBookingsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Filter skeleton */}
      <div className="flex space-x-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-24" />
      </div>
      
      {/* Table header skeleton */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="grid grid-cols-6 gap-4 mb-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        
        {/* Table rows skeleton */}
        {[...Array(5)].map((_, index) => (
          <div key={index} className="grid grid-cols-6 gap-4 py-3 border-t border-gray-700">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="flex space-x-2">
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBookingsSkeleton;