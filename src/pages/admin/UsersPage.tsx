// src/pages/admin/UsersPage.tsx - Fixed pagination functionality
import React, { useState, useEffect } from 'react';
import { Button } from '@components/ui/Button';
import { Pagination } from '@components/ui/Pagination';
import { EmptyState } from '@components/ui/EmptyState';
import { UserFilter } from '@components/admin/users/UserFilter';
import { UsersTable } from '@components/admin/users/UsersTable';
import { UserDetailsModal } from '@components/admin/users/UserDetailsModal';
import { useUsers } from '@hooks/useAdminQueries';
import {
  useActivateUser,
  useSuspendUser,
} from '@hooks/useUserMutations';
import { useFilterStore } from '@store/admin/adminStore';
import {
  UsersIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import type { User, UserFilters } from '@app-types/admin/admin';

const USERS_PER_PAGE = 15; // Matching backend default

export const UsersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Store hooks
  const { userFilters, setUserFilters, clearUserFilters } = useFilterStore();

  // Create a stable query key that includes all dependencies
  const queryFilters = {
    ...userFilters,
    sort_by: userFilters.sort_by || 'created_at',
    sort_order: userFilters.sort_order || 'desc',
  };

  // Query hooks - Updated to match backend pagination
  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useUsers(currentPage, USERS_PER_PAGE, queryFilters);

  // Mutation hooks - Updated to match backend API
  const activateUserMutation = useActivateUser();
  const suspendUserMutation = useSuspendUser();

  const users = usersData?.data || [];
  const totalUsers = usersData?.total || 0;
  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

  // Debug logging to see if pagination data is updating
  useEffect(() => {
  }, [currentPage, totalPages, totalUsers, users.length]);

  // Handlers
  const handleFilterChange = (filters: UserFilters) => {
    setUserFilters(filters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    clearUserFilters();
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Force refetch to ensure data updates
    setTimeout(() => {
      refetch();
    }, 100);
  };

  const handleUserView = (user: User) => {
    setSelectedUserId(user.id);
    setShowUserModal(true);
  };

  const handleUserActivate = async (userId: number, reason?: string) => {
    try {
      await activateUserMutation.mutateAsync({ userId, reason });
    } catch (error) {
      console.error('User activation failed:', error);
    }
  };

  const handleUserSuspend = async (userId: number, reason: string) => {
    try {
      await suspendUserMutation.mutateAsync({ userId, reason });
    } catch (error) {
      console.error('User suspension failed:', error);
    }
  };

  // Check if we have active filters
  const hasActiveFilters = Object.values(userFilters).some(value => 
    value !== undefined && value !== null && value !== ''
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">Error loading users: {error.message}</p>
          <Button 
            variant="primary" 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-fit space-y-6 mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <UsersIcon className="h-8 w-8 mr-3 text-primary-600" />
            Users Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage all users on the platform ({totalUsers} total)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="primary">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <UserFilter
        filters={userFilters}
        onFiltersChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        loading={isLoading}
      />

      {/* Users Table - Full Width */}
      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="animate-pulse">
            <div className="h-16 bg-gray-100 rounded-t-lg"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-50 border-t border-gray-200"></div>
            ))}
          </div>
        </div>
      ) : users.length > 0 ? (
        <UsersTable
          data={users}
          loading={isLoading}
          onUserView={handleUserView}
          onUserActivate={handleUserActivate}
          onUserSuspend={handleUserSuspend}
        />
      ) : (
        <EmptyState
          icon={<UsersIcon className="h-8 w-8 text-primary-600" />}
          title="No users found"
          description={
            hasActiveFilters
              ? "No users match your current filters. Try adjusting your search criteria."
              : "No users have been registered yet."
          }
          action={
            hasActiveFilters ? (
              <Button variant="secondary" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            ) : (
              <Button variant="primary">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add First User
              </Button>
            )
          }
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          showInfo={true}
          totalItems={totalUsers}
          itemsPerPage={USERS_PER_PAGE}
        />
      )}

      {/* User Details Modal */}
      <UserDetailsModal
        userId={selectedUserId}
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUserId(null);
        }}
      />
    </div>
  );
};