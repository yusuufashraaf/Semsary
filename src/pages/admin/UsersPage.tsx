// src/pages/admin/UsersPage.tsx - Updated with Status Select and Clickable Rows
import React, { useState } from 'react';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { Input } from '@components/ui/Input';
import { Select } from '@components/ui/Select';
import { Card } from '@components/ui/Card';
import { useUsers, useUserProperties, useUserTransactions } from '@hooks/useAdminQueries';
import { useActivateUser, useSuspendUser } from '@hooks/useUserMutations';
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
import { fetchUserProperties } from '@services/axios-global';
import { TFullUser } from '@app-types/users/users.types';

const USERS_PER_PAGE = 15;


interface Transaction {
  id: number;
  type: string;
  amount: string;
  status: string;
  payment_gateway: string;
  created_at: string;
}

export const UsersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'properties' | 'transactions' | 'image'>('info');
  const [showFilters, setShowFilters] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Build filters object
  const filters = {
    search: search || undefined,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
    sort_by: 'created_at',
    sort_order: 'desc'
  };

  const { data: usersData, isLoading, error, refetch } = useUsers(currentPage, USERS_PER_PAGE, filters);
  //const { any: userProperties } = (){await fetchUserProperties(selectedUserId);}//useUserProperties(selectedUserId!, !!selectedUserId); 
  const userProperties = ()=>{const response = fetchUserProperties(selectedUserId);
    console.log(response + "");
  }
  const { data: userTransactions } = useUserTransactions(selectedUserId!, !!selectedUserId);
  
  const activateUserMutation = useActivateUser();
  const suspendUserMutation = useSuspendUser();
  
  const users = usersData?.data || [];
  const totalUsers = usersData?.total || 0;
  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);
  const selectedUser = users.find(u => u.id === selectedUserId);

  // Status/Role color mapping
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      active: 'success',
      pending: 'warning',
      suspended: 'danger'
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

  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setRoleFilter('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  const hasActiveFilters = search || roleFilter || statusFilter;

  // User actions
  const handleActivateUser = async (user: TFullUser) => {
    const result = await Swal.fire({
      title: 'Activate User',
      text: `Are you sure you want to activate ${user.first_name} ${user.last_name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Activate',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await activateUserMutation.mutateAsync({ 
          userId: user.id, 
          reason: user.status === 'suspended' ? 'Reactivated by admin' : 'Activated by admin' 
        });
        refetch();
        Swal.fire('Activated!', 'User has been activated successfully.', 'success');
      } catch (error) {
        Swal.fire('Error!', 'Failed to activate user.', 'error');
      }
    }
  };

  const handleSuspendUser = async (user: TFullUser) => {
    const { value: reason } = await Swal.fire({
      title: 'Suspend User',
      text: `Please provide a reason for suspending ${user.first_name} ${user.last_name}:`,
      input: 'textarea',
      inputPlaceholder: 'Enter suspension reason...',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Suspend User',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value || value.trim().length === 0) {
          return 'You need to provide a reason for suspension!';
        }
        if (value.trim().length < 10) {
          return 'Reason must be at least 10 characters long!';
        }
      },
    });

    if (reason) {
      try {
        await suspendUserMutation.mutateAsync({ userId: user.id, reason: reason.trim() });
        refetch();
        Swal.fire('Suspended!', 'User has been suspended successfully.', 'success');
      } catch (error) {
        Swal.fire('Error!', 'Failed to suspend user.', 'error');
      }
    }
  };

  const handleRoleChange = async (user: TFullUser, newRole: string) => {
    if (user.role === newRole) return;

    const result = await Swal.fire({
      title: 'Change Role',
      text: `Change ${user.first_name}'s role to ${newRole}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Change Role',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      // Implement role change logic here
      console.log(`Changing user ${user.id} role to ${newRole}`);
      refetch();
      Swal.fire('Updated!', `Role changed to ${newRole}.`, 'success');
    }
  };

  // NEW: Handle status change (valid, pending, rejected)
  const handleStatusChange = (user: TFullUser, newStatus: string) => {
    console.log(`Changing user ${user.id} status from ${user.status} to ${newStatus}`);
    // Here you would typically make an API call to update the user status
    // For now, we'll just log it to the console
  };

  const handleRowClick = (user: TFullUser) => {
    console.log(user);
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

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border p-4 space-y-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
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
            Filters
            {hasActiveFilters && (
              <span className="ml-2 h-2 w-2 rounded-full bg-blue-600" />
            )}
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <Select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
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
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'active', label: 'Active' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'suspended', label: 'Suspended' }
                ]}
              />
            </div>
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
                          
                          {/* <UserIcon className="h-5 w-5 text-gray-500" /> */}
                          {user.id_image_url && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setShowImageModal(true);
                          }}
                        >
                          <IdentificationIcon className="h-4 w-4 mr-1" />
                        </Button>)}{
                          <UserIcon className="h-5 w-5 text-gray-500" />
                        }
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
                        onClick={(e) => e.stopPropagation()} // Prevent row click when selecting
                      >
                        <option value="user">User</option>
                        <option value="agent">Agent</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {/* NEW: ID Status Select */}
                      <select
                        value={user.status} // You might want a separate field for ID status
                        onChange={(e) => handleStatusChange(user, e.target.value)}
                        className="px-2 py-1 rounded border text-sm font-medium text-gray-700 border-gray-200"
                        onClick={(e) => e.stopPropagation()} // Prevent row click when selecting
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
                      {/* REMOVED: View button since row is now clickable */}
                      
                      {/* {user.id_image_url && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setShowImageModal(true);
                          }}
                        >
                          <IdentificationIcon className="h-4 w-4 mr-1" />
                        </Button>
                      )} */}

                      {user.status === 'active' && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleSuspendUser(user)}
                          loading={suspendUserMutation.isPending}
                        >
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                          Suspend
                        </Button>
                      )}

                      {(user.status === 'pending' || user.status === 'suspended') && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleActivateUser(user)}
                          loading={activateUserMutation.isPending}
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
                      handleSuspendUser(selectedUser);
                    }}
                  >
                    Suspend User
                  </Button>
                )}
                
                {(selectedUser.status === 'pending' || selectedUser.status === 'suspended') && (
                  <Button
                    variant="success"
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleActivateUser(selectedUser);
                    }}
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

// Helper Components
const InfoRow = ({ label, value, verified }: { label: string; value: string; verified?: boolean }) => (
  <div>
    <p className="text-sm font-medium text-gray-900">{value}</p>
    <p className="text-sm text-gray-500">
      {label} {verified && <Badge variant="success" className="ml-1">Verified</Badge>}
    </p>
  </div>
);

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-blue-600">{value}</p>
  </div>
);