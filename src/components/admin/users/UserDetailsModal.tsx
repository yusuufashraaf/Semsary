// src/components/admin/users/UserDetailsModal.tsx - Improved with properties and transactions
import React, { useState } from 'react';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { Table } from '@components/ui/Table';
import { Card } from '@components/ui/Card';
import { useUser } from '@hooks/useAdminQueries';
import {
  useActivateUser,
  useSuspendUser
} from '@hooks/useUserMutations';
import { formatCurrency, formatDate } from '@utils/formatters';
import { cn } from '@utils/classNames';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  MapPinIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

// Create SweetAlert with React content support
const MySwal = withReactContent(Swal);

interface UserDetailsModalProps {
  userId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

// Enhanced User interface to match backend response
interface EnhancedUser {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
  status: string;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  id_image_url: string | null;
  created_at: string;
  updated_at?: string;
  google_id?: string | null;
  properties_count: number;
  transactions_count: number;
  recent_properties: Array<{
    id: number;
    title: string;
    status: string;
    created_at: string;
  }>;
  recent_transactions: Array<{
    id: number;
    type: string;
    amount: string;
    status: string;
    created_at: string;
  }>;
  admin_actions: Array<any>;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  userId,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'properties' | 'transactions'>('info');

  // Queries - casting to enhanced user type
  const { data: user, isLoading: userLoading } = useUser(userId!, !!userId) as {
    data: EnhancedUser | undefined;
    isLoading: boolean;
  };

  // Mutations
  const activateUserMutation = useActivateUser();
  const suspendUserMutation = useSuspendUser();

  const handleStatusChange = async (action: 'activate' | 'suspend') => {
    if (!userId || !user) return;

    try {
      switch (action) {
        case 'activate':
          const activateResult = await MySwal.fire({
            title: 'Activate User',
            text: `Are you sure you want to activate ${user.first_name} ${user.last_name}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Activate',
            cancelButtonText: 'Cancel'
          });

          if (activateResult.isConfirmed) {
            await activateUserMutation.mutateAsync({ 
              userId, 
              reason: user?.status === 'suspended' ? 'Reactivated by admin' : 'Activated by admin' 
            });
            
            MySwal.fire({
              title: 'Activated!',
              text: 'User has been activated successfully.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
          break;
          
        case 'suspend':
          const { value: reason } = await MySwal.fire({
            title: 'Suspend User',
            text: `Please provide a reason for suspending ${user.first_name} ${user.last_name}:`,
            input: 'textarea',
            inputPlaceholder: 'Enter suspension reason...',
            inputAttributes: {
              'aria-label': 'Suspension reason'
            },
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Suspend User',
            cancelButtonText: 'Cancel',
            inputValidator: (value) => {
              if (!value || value.trim().length === 0) {
                return 'You need to provide a reason for suspension!'
              }
              if (value.trim().length < 10) {
                return 'Reason must be at least 10 characters long!'
              }
            }
          });

          if (reason && reason.trim()) {
            await suspendUserMutation.mutateAsync({ userId, reason: reason.trim() });
            
            MySwal.fire({
              title: 'Suspended!',
              text: 'User has been suspended successfully.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
          break;
      }
    } catch (error) {
      console.error('Status change failed:', error);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'suspended': return 'danger';
      case 'valid': return 'success';
      case 'invalid': return 'danger';
      case 'sold': return 'secondary';
      case 'rented': return 'primary';
      default: return 'secondary';
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'danger';
      case 'agent': return 'primary';
      case 'owner': return 'warning';
      case 'user': return 'secondary';
      default: return 'secondary';
    }
  };

  // Property table columns
  const propertyColumns = [
    {
      key: 'id',
      label: 'ID',
      render: (value: number) => `#${value}`,
      width: '80px',
    },
    {
      key: 'title',
      label: 'Title',
      render: (value: string) => (
        <div className="max-w-xs truncate font-medium">{value}</div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge variant={getStatusBadgeVariant(value.toLowerCase())}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value: string) => formatDate(value),
    },
  ];

  // Transaction table columns
  const transactionColumns = [
    {
      key: 'id',
      label: 'ID',
      render: (value: number) => `#${value}`,
      width: '80px',
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: string) => (
        <Badge variant={value === 'buy' ? 'primary' : 'secondary'}>
          {value.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value: string) => formatCurrency(parseFloat(value)),
      align: 'right' as const,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge variant={getStatusBadgeVariant(value)}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (value: string) => formatDate(value),
    },
  ];

  const tabs = [
    { id: 'info', label: 'User Info', icon: UserIcon },
    { id: 'properties', label: 'Properties', icon: BuildingOfficeIcon, count: user?.properties_count },
    { id: 'transactions', label: 'Transactions', icon: CreditCardIcon, count: user?.transactions_count },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? `${user.first_name} ${user.last_name}` : 'User Details'}
      size="xl"
    >
      <div className="space-y-6">
        {userLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : user ? (
          <>
            {/* User Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-gray-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user.first_name} {user.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role.toUpperCase()}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(user.status)}>
                      {user.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {user.status === 'pending' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStatusChange('activate')}
                    loading={activateUserMutation.isPending}
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Activate
                  </Button>
                )}
                
                {user.status === 'active' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleStatusChange('suspend')}
                    loading={suspendUserMutation.isPending}
                  >
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                    Suspend
                  </Button>
                )}

                {user.status === 'suspended' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStatusChange('activate')}
                    loading={activateUserMutation.isPending}
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Reactivate
                  </Button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'info' | 'properties' | 'transactions')}
                      className={cn(
                        'flex items-center py-2 px-1 border-b-2 font-medium text-sm',
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      )}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.label}
                      {'count' in tab && tab.count !== undefined && (
                        <span className={cn(
                          'ml-2 py-0.5 px-2 rounded-full text-xs',
                          activeTab === tab.id 
                            ? 'bg-primary-100 text-primary-800'
                            : 'bg-gray-100 text-gray-600'
                        )}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 'info' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <Card title="Basic Information" className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-sm text-gray-500">Full Name</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.email}</p>
                          <p className="text-sm text-gray-500">
                            Email {user.email_verified_at ? '(Verified)' : '(Unverified)'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.phone_number}</p>
                          <p className="text-sm text-gray-500">
                            Phone {user.phone_verified_at ? '(Verified)' : '(Unverified)'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(user.created_at)}
                          </p>
                          <p className="text-sm text-gray-500">Registration Date</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Account Status */}
                  <Card title="Account Status" className="p-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">Current Status</p>
                        <Badge variant={getStatusBadgeVariant(user.status)} size="lg">
                          {user.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">Role</p>
                        <Badge variant={getRoleBadgeVariant(user.role)} size="lg">
                          {user.role.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">Properties</p>
                          <p className="text-2xl font-bold text-primary-600">{user.properties_count}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">Transactions</p>
                          <p className="text-2xl font-bold text-primary-600">{user.transactions_count}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'properties' && (
                <div>
                  {user.recent_properties && user.recent_properties.length > 0 ? (
                    <Table
                      data={user.recent_properties}
                      columns={propertyColumns}
                      loading={false}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No properties found</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'transactions' && (
                <div>
                  {user.recent_transactions && user.recent_transactions.length > 0 ? (
                    <Table
                      data={user.recent_transactions}
                      columns={transactionColumns}
                      loading={false}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No transactions found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">User not found</p>
          </div>
        )}
      </div>
    </Modal>
  );
};