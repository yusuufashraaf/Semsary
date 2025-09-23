import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import {
  HomeModernIcon,
  MapPinIcon,
  ClockIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@utils/classNames';
import type { PropertyAssignment } from '@app-types/cs-agent/cs-agent';

interface RecentAssignmentsProps {
  assignments: PropertyAssignment[];
}

export const RecentAssignments: React.FC<RecentAssignmentsProps> = ({ assignments }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'amber';
      case 'in_progress':
        return 'blue';
      case 'completed':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'red';
      case 'high':
        return 'orange';
      case 'normal':
        return 'blue';
      case 'low':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Assignments
          </h3>
          <Link to="/cs-agent/properties">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {assignments.length > 0 ? (
          assignments.slice(0, 5).map((assignment) => (
            <div
              key={assignment.id}
              className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    {/* Property Image or Icon */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500">
                      <HomeModernIcon className="h-6 w-6 text-white" />
                    </div>
                    
                    {/* Property Details */}
                    <div className="flex-1">
                      <Link
                        to={`/cs-agent/properties/${assignment.property_id}`}
                        className="text-sm font-medium text-gray-900 hover:text-teal-600 dark:text-white dark:hover:text-teal-400"
                      >
                        {assignment.property.title}
                      </Link>
                      
                      <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <MapPinIcon className="mr-1 h-3 w-3" />
                          {assignment.property.address || 'Location not specified'}
                        </span>
                        <span className="flex items-center">
                          <ClockIcon className="mr-1 h-3 w-3" />
                          {formatDate(assignment.assigned_at)}
                        </span>
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-2">
                        <Badge variant={getStatusColor(assignment.status)}>
                          {assignment.status.replace('_', ' ')}
                        </Badge>
                        {assignment.priority && assignment.priority !== 'normal' && (
                          <Badge variant={getPriorityColor(assignment.priority)}>
                            {assignment.priority}
                          </Badge>
                        )}
                        <Badge variant="outline">
                          {assignment.property.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Button */}
                <div className="ml-4">
                  <Link to={`/cs-agent/properties/${assignment.property_id}/verify`}>
                    <Button size="sm" variant="outline">
                      {assignment.status === 'pending' ? 'Start' : 'Continue'}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-12 text-center">
            <HomeModernIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              No assignments yet
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              New assignments will appear here
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
