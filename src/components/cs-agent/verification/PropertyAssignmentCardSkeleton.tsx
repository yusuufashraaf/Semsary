import React from "react";
import { Card } from "@components/ui/Card";

export const PropertyAssignmentCardSkeleton: React.FC = () => {
  return (
    <Card>
      <div className="p-4 animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="h-16 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="h-6 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="flex space-x-2">
            <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PropertyAssignmentCardSkeleton;
