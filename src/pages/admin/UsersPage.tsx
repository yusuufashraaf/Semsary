// src/pages/admin/UsersPage.tsx - Fixed version
import React, { useState, useEffect } from 'react';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { Input } from '@components/ui/Input';
import { Select } from '@components/ui/Select';
import { Card } from '@components/ui/Card';
import { useUsers, useUserProperties, useUserTransactions } from '@hooks/useAdminQueries';
import { formatCurrency, formatDate } from '@utils/formatters';
import Swal from 'sweetalert2';
import { 
  UserIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  IdentificationIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { Property } from '@app-types/index';
import { TFullUser } from '@app-types/users/users.types';
import { adminService } from '@services/axios-global';

const USERS_PER_PAGE = 15;

interface Transaction {
  id: number;
  type: string;
  amount: string;
  status: string;
  payment_gateway: string;
  created_at: string;
}

interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  sort_by?: string;
  sort_order?: string;
  date_from?: string;
  date_to?: string;
  per_page?: number;
}

export const UsersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<UserFilters>({
    sort_by: 'created_at',
    sort_order: 'desc',
    per_page: USERS_PER_PAGE
  });
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'properties' | 'transactions' | 'image'>('info');
  const [showFilters, setShowFilters] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState<number | null>(null); // Track loading per user

  // Use the filters in the query
  const { data: usersData, isLoading, error, refetch } = useUsers(currentPage, USERS_PER_PAGE, filters);
  const { data: userProperties, isLoading: propertiesLoading } = useUserProperties(selectedUserId!, !!selectedUserId);
  const { data: userTransactions, isLoading: transactionsLoading } = useUserTransactions(selectedUserId!, !!selectedUserId);
  
  const users = usersData?.data || [];
  const totalUsers = usersData?.total || 0;
  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);
  const selectedUser = users.find(u => u.id === selectedUserId);

  // Status/Role color mapping
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      active: 'success',
      pending: 'warning',
      suspended: 'danger',
      valid: 'success',
      rejected: 'danger'
    };
    return colors[status] || 'secondary';
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      admin: 'danger',
      agent: 'primary',
      user: 'secondary'
    };
    return colors[role] || 'secondary';
  };

  // Update filters
  const updateFilter = (key: keyof UserFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      sort_by: 'created_at',
      sort_order: 'desc',
      per_page: USERS_PER_PAGE
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== '' && 
    !['sort_by', 'sort_order', 'per_page'].includes(value as string)
  );

  const handleUserActivationStates = async (user: TFullUser, newActivationState: string) => {
    // Prevent multiple clicks on the same user
    if (isButtonLoading === user.id) return;
    
    setIsButtonLoading(user.id);
    
    try {
      if (user.status === newActivationState) {
        Swal.fire('No Change Needed', 'User status is already ' + newActivationState, 'info');
        setIsButtonLoading(null);
        return;
      }

      let confirmationConfig;
      
      switch (newActivationState) {
        case "suspended":
          confirmationConfig = {
            title: 'Suspend User',
            text: `Are you sure you want to suspend ${user.first_name} ${user.last_name}?`,
            icon: 'question' as const,
            confirmButtonColor: '#b94010ff',
            confirmButtonText: 'Yes, Suspend',
          };
          break;
        case "active":
          confirmationConfig = {
            title: 'Activate User',
            text: `Are you sure you want to activate ${user.first_name} ${user.last_name}?`,
            icon: 'question' as const,
            confirmButtonColor: '#10b981',
            confirmButtonText: 'Yes, Activate',
          };
          break;
        case "pending":
          confirmationConfig = {
            title: 'Pending User State',
            text: `Are you sure you want to switch user ${user.first_name} ${user.last_name} state to pending for revision?`,
            icon: 'question' as const,
            confirmButtonColor: '#eeea04ff',
            confirmButtonText: 'Yes, Switch to Pending State',
          };
          break;
        default:
          setIsButtonLoading(null);
          return;
      }

      const result = await Swal.fire({
        ...confirmationConfig,
        showCancelButton: true,
        cancelButtonColor: '#6b7280',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        await adminService.updateUserStatus(user.id, newActivationState);
        
        // CRITICAL FIX: Refetch the data to update the UI
        await refetch();
        
        let successMessage = '';
        let check = true;
        switch (newActivationState) {
          case "suspended":
            successMessage = 'User has been suspended successfully.';
            break;
          case "active":
            if(!selectedUser?.email_verified_at == null){
              check = false;
              successMessage = 'User Email is Not Verified, User status will be pending.';
            }
            else if(!selectedUser?.phone_verified_at == null){
              check = false;
              successMessage = 'User Phone is Not Verified, User status will be pending.';
            }
            else if(selectedUser?.id_state != "valid"){
              check = false;
              successMessage = 'User ID is Not Verified, User status will be pending.';
            }
            else
              successMessage = 'User has been activated successfully.';
            break;
          case "pending":
            successMessage = 'User state has been set to pending successfully.';
            break;
        }
        if(check){
          Swal.fire('Success!', successMessage,'success');
        }
        else{
          Swal.fire("Can't Validate User", successMessage,'error');
        }
        //Swal.fire('Error!', 'Failed to update user status.', 'error');
        
        // Close details modal if open for the same user
        if (showDetailsModal && selectedUserId === user.id) {
          setShowDetailsModal(false);
        }
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      Swal.fire('Error!', 'Failed to update user status.', 'error');
    } finally {
      setIsButtonLoading(null);
    }
  };

  const handleRoleChange = async (user: TFullUser, newRole: string) => {
    // Prevent multiple clicks on the same user
    if (isButtonLoading === user.id) return;
    
    setIsButtonLoading(user.id);
    
    try {
      if (user.role === newRole) {
        Swal.fire('No Change Needed', 'User role is already ' + newRole, 'info');
        setIsButtonLoading(null);
        return;
      }

      let confirmationConfig;
      
      switch (newRole) {
        case "admin":
          confirmationConfig = {
            title: 'Assign Admin Role',
            text: `Are you sure you want to assign admin role to ${user.first_name} ${user.last_name}? This will give them full system access.`,
            icon: 'warning' as const,
            confirmButtonColor: '#dc2626',
            confirmButtonText: 'Yes, Make Admin',
          };
          break;
        case "agent":
          confirmationConfig = {
            title: 'Assign Agent Role',
            text: `Are you sure you want to assign agent role to ${user.first_name} ${user.last_name}?`,
            icon: 'question' as const,
            confirmButtonColor: '#3b82f6',
            confirmButtonText: 'Yes, Make Agent',
          };
          break;
        case "user":
          confirmationConfig = {
            title: 'Assign User Role',
            text: `Are you sure you want to assign user role to ${user.first_name} ${user.last_name}?`,
            icon: 'question' as const,
            confirmButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Make User',
          };
          break;
        default:
          setIsButtonLoading(null);
          return;
      }

      const result = await Swal.fire({
        ...confirmationConfig,
        showCancelButton: true,
        cancelButtonColor: '#6b7280',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        await adminService.updateUserRole(user.id, newRole);
        
        // CRITICAL FIX: Refetch the data to update the UI
        await refetch();
        
        let successMessage = '';
        switch (newRole) {
          case "admin":
            successMessage = 'User has been assigned admin role successfully.';
            break;
          case "agent":
            successMessage = 'User has been assigned agent role successfully.';
            break;
          case "user":
            successMessage = 'User has been assigned user role successfully.';
            break;
        }
        
        Swal.fire('Success!', successMessage, 'success');
        
        // Close details modal if open for the same user
        if (showDetailsModal && selectedUserId === user.id) {
          setShowDetailsModal(false);
        }
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      Swal.fire('Error!', 'Failed to update user role.', 'error');
    } finally {
      setIsButtonLoading(null);
    }
  };

  const handleIdStatusChange = async (user: TFullUser, newStatus: string) => {
    // Prevent multiple clicks on the same user
    if (isButtonLoading === user.id) return;
    
    setIsButtonLoading(user.id);
    
    try {
      if (user.id_state === newStatus) {
        Swal.fire('No Change Needed', 'User ID status is already ' + newStatus, 'info');
        setIsButtonLoading(null);
        return;
      }

      let confirmationConfig;
      
      switch (newStatus) {
        case "valid":
          confirmationConfig = {
            title: 'Validate ID Document',
            text: `Are you sure you want to validate the ID document for ${user.first_name} ${user.last_name}?`,
            icon: 'question' as const,
            confirmButtonColor: '#10b981',
            confirmButtonText: 'Yes, Validate ID',
          };
          break;
        case "rejected":
          confirmationConfig = {
            title: 'Reject ID Document',
            text: `Are you sure you want to reject the ID document for ${user.first_name} ${user.last_name}?`,
            icon: 'warning' as const,
            confirmButtonColor: '#dc2626',
            confirmButtonText: 'Yes, Reject ID',
          };
          break;
        case "pending":
          confirmationConfig = {
            title: 'Set ID to Pending',
            text: `Are you sure you want to set ID status to pending for ${user.first_name} ${user.last_name}?`,
            icon: 'question' as const,
            confirmButtonColor: '#eeea04ff',
            confirmButtonText: 'Yes, Set to Pending',
          };
          break;
        default:
          setIsButtonLoading(null);
          return;
      }

      const result = await Swal.fire({
        ...confirmationConfig,
        showCancelButton: true,
        cancelButtonColor: '#6b7280',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        await adminService.updateUserIDStatus(user.id, newStatus);
        
        // CRITICAL FIX: Refetch the data to update the UI
        await refetch();
        
        let successMessage = '';
        switch (newStatus) {
          case "valid":
            successMessage = 'ID document has been validated successfully.';
            break;
          case "rejected":
            successMessage = 'ID document has been rejected successfully.';
            break;
          case "pending":
            successMessage = 'ID status has been set to pending successfully.';
            break;
        }
        
        Swal.fire('Success!', successMessage, 'success');
        
        // Close details modal if open for the same user
        if (showDetailsModal && selectedUserId === user.id) {
          setShowDetailsModal(false);
        }
      }
    } catch (error) {
      console.error('Error updating ID status:', error);
      Swal.fire('Error!', 'Failed to update ID status.', 'error');
    } finally {
      setIsButtonLoading(null);
    }
  };

  const handleRowClick = (user: TFullUser) => {
    setSelectedUserId(user.id);
    setShowDetailsModal(true);
    setActiveTab('info');
  };

  // Tab navigation
  const tabs = [
    { id: 'info', label: 'User Info', icon: UserIcon },
    { id: 'properties', label: 'Properties', icon: BuildingOfficeIcon, count: userProperties?.length },
    { id: 'transactions', label: 'Transactions', icon: CreditCardIcon, count: userTransactions?.length },
    { id: 'image', label: 'ID Image', icon: PhotoIcon },
  ];

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Error loading users: {error.message}</p>
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage system users and their permissions</p>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="bg-white rounded-lg border p-4 space-y-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Advanced Filters
            {hasActiveFilters && (
              <span className="ml-2 h-2 w-2 rounded-full bg-blue-600" />
            )}
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <Select
                  value={filters.role || ''}
                  onChange={(e) => updateFilter('role', e.target.value)}
                  options={[
                    { value: '', label: 'All Roles' },
                    { value: 'user', label: 'User' },
                    { value: 'agent', label: 'Agent' },
                    { value: 'admin', label: 'Admin' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select
                  value={filters.status || ''}
                  onChange={(e) => updateFilter('status', e.target.value)}
                  options={[
                    { value: '', label: 'All Statuses' },
                    { value: 'active', label: 'Active' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'suspended', label: 'Suspended' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Results Per Page</label>
                <Select
                  value={filters.per_page?.toString() || USERS_PER_PAGE.toString()}
                  onChange={(e) => updateFilter('per_page', parseInt(e.target.value))}
                  options={[
                    { value: '10', label: '10 per page' },
                    { value: '15', label: '15 per page' },
                    { value: '25', label: '25 per page' },
                    { value: '50', label: '50 per page' },
                  ]}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Registered From</label>
                <Input
                  type="date"
                  value={filters.date_from || ''}
                  onChange={(e) => updateFilter('date_from', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Registered To</label>
                <Input
                  type="date"
                  value={filters.date_to || ''}
                  onChange={(e) => updateFilter('date_to', e.target.value)}
                />
              </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500">Active filters:</span>
                  
                  {filters.role && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Role: {filters.role}
                    </span>
                  )}

                  {filters.status && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Status: {filters.status}
                    </span>
                  )}

                  {filters.search && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Search: "{filters.search}"
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : users.length > 0 ? (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(user)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {user.id_image_url ? (
                            <img 
                              src={user.id_image_url} 
                              alt="User" 
                              className="h-10 w-10 rounded-full object-cover cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUserId(user.id);
                                setShowImageModal(true);
                              }}
                            />
                          ) : (
                            <UserIcon className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user, e.target.value)}
                        className={`px-2 py-1 rounded border text-sm font-medium ${
                          getRoleColor(user.role) === 'danger' ? 'text-red-700 border-red-200' :
                          getRoleColor(user.role) === 'primary' ? 'text-blue-700 border-blue-200' :
                          'text-gray-700 border-gray-200'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                        disabled={isButtonLoading !== null}
                      >
                        <option value="user">User</option>
                        <option value="agent">Agent</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.id_state || "pending"}
                        onChange={(e) => handleIdStatusChange(user, e.target.value)}
                        className="px-2 py-1 rounded border text-sm font-medium text-gray-700 border-gray-200"
                        onClick={(e) => e.stopPropagation()}
                        disabled={isButtonLoading !== null}
                      >
                        <option value="valid">Valid</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.phone_number}
                      {user.phone_verified_at && (
                        <CheckCircleIcon className="h-4 w-4 text-green-500 inline ml-1" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 space-x-2" onClick={(e) => e.stopPropagation()}>
                      {user.status === 'active' && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleUserActivationStates(user, "suspended")}
                          loading={isButtonLoading === user.id}
                          disabled={isButtonLoading !== null}
                        >
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                          Suspend
                        </Button>
                      )}

                      {(user.status === 'pending' || user.status === 'suspended') && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleUserActivationStates(user, "active")}
                          loading={isButtonLoading === user.id}
                          disabled={isButtonLoading !== null}
                        >
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          {user.status === 'suspended' ? 'Reactivate' : 'Activate'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border">
          <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No users found</h3>
          <p className="text-gray-500">
            {hasActiveFilters 
              ? "No users match your current filters. Try adjusting your search criteria." 
              : "No users have been registered yet."
            }
          </p>
          {hasActiveFilters && (
            <Button onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * USERS_PER_PAGE + 1} to {Math.min(currentPage * USERS_PER_PAGE, totalUsers)} of {totalUsers} users
          </div>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <span className="px-3 py-2 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* User Details Modal with Tabs */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">User Details - {selectedUser.first_name} {selectedUser.last_name}</h3>
                <Button variant="ghost" onClick={() => setShowDetailsModal(false)}>×</Button>
              </div>
              
              {/* Tabs Navigation */}
              <div className="border-b mb-6">
                <nav className="flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id 
                          ? 'border-blue-500 text-blue-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <tab.icon className="h-4 w-4 mr-2" />
                      {tab.label}
                      {tab.count !== undefined && (
                        <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="min-h-[300px]">
                {/* Info Tab */}
                {activeTab === 'info' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Basic Information">
                      <div className="space-y-4">
                        <InfoRow label="Full Name" value={`${selectedUser.first_name} ${selectedUser.last_name}`} />
                        <InfoRow label="Email" value={selectedUser.email} verified={!!selectedUser.email_verified_at} />
                        <InfoRow label="Phone" value={selectedUser.phone_number} verified={!!selectedUser.phone_verified_at} />
                        <InfoRow label="Registered" value={formatDate(selectedUser.created_at)} />
                      </div>
                    </Card>

                    <Card title="Account Status">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Status</label>
                          <div className="mt-1">
                            <Badge variant={getStatusColor(selectedUser.status)} size="lg">
                              {selectedUser.status}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Role</label>
                          <div className="mt-1">
                            <Badge variant={getRoleColor(selectedUser.role)} size="lg">
                              {selectedUser.role}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">ID Status</label>
                          <div className="mt-1">
                            <Badge variant={getStatusColor(selectedUser.id_state || 'pending')} size="lg">
                              {selectedUser.id_state || 'pending'}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <StatBox label="Properties" value={selectedUser.properties_count || 0} />
                          <StatBox label="Transactions" value={selectedUser.transactions_count || 0} />
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Properties Tab */}
                {activeTab === 'properties' && (
                  <Card title="User Properties">
                    {userProperties && userProperties.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="text-left p-2">Title</th>
                              <th className="text-left p-2">Type</th>
                              <th className="text-left p-2">Price</th>
                              <th className="text-left p-2">Status</th>
                              <th className="text-left p-2">Created</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userProperties.map((property: Property) => (
                              <tr key={property.id} className="border-t">
                                <td className="p-2">{property.title}</td>
                                <td className="p-2">{property.type}</td>
                                <td className="p-2">{formatCurrency(property.price)}</td>
                                <td className="p-2">
                                  <Badge variant={getStatusColor(property.status)}>
                                    {property.status}
                                  </Badge>
                                </td>
                                <td className="p-2">{formatDate(property.created_at)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No properties found</p>
                      </div>
                    )}
                  </Card>
                )}

                {/* Transactions Tab */}
                {activeTab === 'transactions' && (
                  <Card title="User Transactions">
                    {userTransactions && userTransactions.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="text-left p-2">Type</th>
                              <th className="text-left p-2">Amount</th>
                              <th className="text-left p-2">Status</th>
                              <th className="text-left p-2">Gateway</th>
                              <th className="text-left p-2">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userTransactions.map((transaction: Transaction) => (
                              <tr key={transaction.id} className="border-t">
                                <td className="p-2">{transaction.type}</td>
                                <td className="p-2">{formatCurrency(parseFloat(transaction.amount))}</td>
                                <td className="p-2">
                                  <Badge variant={getStatusColor(transaction.status)}>
                                    {transaction.status}
                                  </Badge>
                                </td>
                                <td className="p-2">{transaction.payment_gateway}</td>
                                <td className="p-2">{formatDate(transaction.created_at)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No transactions found</p>
                      </div>
                    )}
                  </Card>
                )}

                {/* Image Tab */}
                {activeTab === 'image' && (
                  <Card title="ID Document">
                    {selectedUser.id_image_url ? (
                      <div className="flex justify-center">
                        <img
                          src={selectedUser.id_image_url}
                          alt="ID Document"
                          className="max-h-96 rounded border cursor-pointer"
                          onClick={() => {
                            setShowDetailsModal(false);
                            setShowImageModal(true);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No ID document uploaded</p>
                      </div>
                    )}
                  </Card>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-6 border-t mt-6">
                {selectedUser.status === 'active' && (
                  <Button
                    variant="danger"
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleUserActivationStates(selectedUser, "suspended");
                    }}
                    loading={isButtonLoading === selectedUser.id}
                    disabled={isButtonLoading !== null}
                  >
                    Suspend User
                  </Button>
                )}
                
                {(selectedUser.status === 'pending' || selectedUser.status === 'suspended') && (
                  <Button
                    variant="success"
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleUserActivationStates(selectedUser, "active");
                    }}
                    loading={isButtonLoading === selectedUser.id}
                    disabled={isButtonLoading !== null}
                  >
                    {selectedUser.status === 'suspended' ? 'Reactivate' : 'Activate'}
                  </Button>
                )}
                
                <Button
                  variant="secondary"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Image Modal */}
      {showImageModal && selectedUser && selectedUser.id_image_url && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative">
            <Button 
              variant="ghost" 
              className="absolute -top-12 right-0 text-white"
              onClick={() => setShowImageModal(false)}
            >
              × Close
            </Button>
            <img 
              src={selectedUser.id_image_url}
              alt="ID Document" 
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ label, value, verified }: { label: string; value: string; verified?: boolean }) => (
  <div>
    <p className="text-sm font-medium text-gray-900">{value}</p>
    <p className="text-sm text-gray-500">
      {label} 
      {verified == true && <Badge variant="success" className="ml-1">Verified</Badge>}
      {verified == false && <Badge variant="destructive" className="ml-1">Unverified</Badge>}
    </p>
  </div>
);

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-blue-600">{value}</p>
  </div>
);