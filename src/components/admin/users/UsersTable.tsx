// src/components/admin/users/UsersTable.tsx - Improved with all requested changes
import React from 'react';
import { Table } from '@components/ui/Table';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { formatDate } from '@utils/formatters';
import { cn } from '@utils/classNames';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import type { User } from '@app-types/admin/admin';

// Create SweetAlert with React content support
const MySwal = withReactContent(Swal);

interface UsersTableProps {
  data: User[];
  loading?: boolean;
  onUserView?: (user: User) => void;
  onUserActivate?: (userId: number, reason?: string) => void;
  onUserSuspend?: (userId: number, reason: string) => void;
  className?: string;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  data,
  loading,
  onUserView,
  onUserActivate,
  onUserSuspend,
  className,
}) => {

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'suspended': return 'danger';
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
      case 'suspended':
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <XCircleIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleActivateUser = async (user: User, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const reason = user.status === 'suspended' ? 
      'User reactivated from suspension' : 
      'User account activated by admin';
    
    const result = await MySwal.fire({
      title: 'Activate User',
      text: `Are you sure you want to activate ${user.first_name} ${user.last_name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Activate',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      onUserActivate?.(user.id, reason);
      
      MySwal.fire({
        title: 'Activated!',
        text: 'User has been activated successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleSuspendUser = async (user: User, event: React.MouseEvent) => {
    event.stopPropagation();
    
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
      onUserSuspend?.(user.id, reason.trim());
      
      MySwal.fire({
        title: 'Suspended!',
        text: 'User has been suspended successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (id: number) => (
        <span className="text-sm font-mono text-gray-600 font-medium">#{id}</span>
      ),
      width: '80px',
    },
    {
      key: 'user',
      label: 'User',
      render: (_: any, user: User) => (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <UserIcon className="h-5 w-5 text-gray-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-gray-900 truncate">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-sm text-gray-600 truncate">{user.email}</p>
          </div>
        </div>
      ),
      width: '350px',
    },
    {
      key: 'status',
      label: 'Status',
      render: (status: string) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(status)}
          <Badge variant={getStatusBadgeVariant(status)} size="md">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      ),
      align: 'center' as const,
      width: '140px',
    },
    {
      key: 'role',
      label: 'Role',
      render: (role: string) => (
        <Badge variant={getRoleBadgeVariant(role)} size="md">
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Badge>
      ),
      align: 'center' as const,
      width: '120px',
    },
    {
      key: 'phone_number',
      label: 'Phone',
      render: (phone: string, user: User) => (
        <div className="text-sm text-gray-900 font-medium">
          {phone}
          {user.phone_verified_at && (
            <CheckCircleIcon className="h-4 w-4 text-green-500 inline ml-1" />
          )}
        </div>
      ),
      width: '180px',
    },
    {
      key: 'created_at',
      label: 'Registration Date',
      render: (date: string) => (
        <span className="text-sm text-gray-600 font-medium">{formatDate(date)}</span>
      ),
      width: '160px',
    },
    {
      key: 'email_verified_at',
      label: 'Email Verified',
      render: (verified: string | null) => (
        <div className="flex items-center justify-center">
          {verified ? (
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          ) : (
            <XCircleIcon className="h-5 w-5 text-gray-400" />
          )}
        </div>
      ),
      align: 'center' as const,
      width: '140px',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, user: User) => (
        <div className="flex items-center space-x-2">
          {/* Activate for pending or suspended users */}
          {(user.status === 'pending' || user.status === 'suspended') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleActivateUser(user, e)}
              className="text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 border border-green-200 font-medium px-3 py-1.5 rounded-md transition-colors"
              title={user.status === 'suspended' ? 'Reactivate User' : 'Activate User'}
            >
              Activate
            </Button>
          )}

          {/* Suspend active users */}
          {user.status === 'active' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleSuspendUser(user, e)}
              className="text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 font-medium px-3 py-1.5 rounded-md transition-colors"
              title="Suspend User"
            >
              Suspend
            </Button>
          )}
        </div>
      ),
      align: 'center' as const,
      width: '120px',
    },
  ];

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <div className="min-w-[1400px]">
          <Table
            data={data}
            columns={columns}
            loading={loading}
            onRowClick={onUserView}
          />
        </div>
      </div>
    </div>
  );
};