import React, { useState } from 'react';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { Table } from '@components/ui/Table';
import { Card } from '@components/ui/Card';
import { useUser } from '@hooks/useAdminQueries';
import { formatCurrency, formatDate } from '@utils/formatters';
import { UserIcon, EnvelopeIcon, PhoneIcon, CalendarIcon, BuildingOfficeIcon, CreditCardIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import { TFullUser } from '@app-types/users/users.types';

interface UserDetailsModalProps {
  userId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
  status: string;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  id_image_url: string | null;
  created_at: string;
  properties_count: number;
  transactions_count: number;
  recent_properties: Array<{ id: number; title: string; status: string; created_at: string }>;
  recent_transactions: Array<{ id: number; type: string; amount: string; status: string; created_at: string }>;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ userId, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [showImageModal, setShowImageModal] = useState(false);
  const { data: user, isLoading } = useUser(userId!, !!userId) as { data: TFullUser | undefined; isLoading: boolean };

  const handleStatusChange = (action: string) => {
    console.log(`${action} pressed for user ${userId}`);
  };

  const getStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      active: 'success',
      pending: 'warning', 
      suspended: 'danger',
      valid: 'success',
      invalid: 'danger',
      sold: 'secondary',
      rented: 'primary'
    };
    return statusMap[status.toLowerCase()] || 'secondary';
  };

  const getRoleColor = (role: string) => {
    const roleMap: { [key: string]: string } = {
      admin: 'danger',
      agent: 'primary',
      user: 'secondary'
    };
    return roleMap[role.toLowerCase()] || 'secondary';
  };

  const tabs = [
    { id: 'info', label: 'User Info', icon: UserIcon },
    { id: 'ID', label: 'ID Image', icon: IdentificationIcon },
    { id: 'properties', label: 'Properties', icon: BuildingOfficeIcon, count: user?.properties_count },
    { id: 'transactions', label: 'Transactions', icon: CreditCardIcon, count: user?.transactions_count },
  ];

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="xl">
        <div className="flex justify-center py-8"><LoadingSpinner size="lg" /></div>
      </Modal>
    );
  }

  if (!user) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="xl">
        <div className="text-center py-8"><p className="text-gray-500">User not found</p></div>
      </Modal>
    );
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={`${user.first_name} ${user.last_name}`} size="xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-gray-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user.first_name} {user.last_name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                <div className="flex space-x-2 mt-1">
                  <Badge variant={getRoleColor(user.role)}>{user.role.toUpperCase()}</Badge>
                  <Badge variant={getStatusColor(user.status)}>{user.status.toUpperCase()}</Badge>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {user.status === 'pending' && (
                <Button variant="primary" size="sm" onClick={() => handleStatusChange('activate')}>
                  Activate
                </Button>
              )}
              {user.status === 'active' && (
                <Button variant="secondary" size="sm" onClick={() => handleStatusChange('suspend')}>
                  Suspend
                </Button>
              )}
              {user.status === 'suspended' && (
                <Button variant="primary" size="sm" onClick={() => handleStatusChange('reactivate')}>
                  Reactivate
                </Button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id 
                      ? 'border-primary-500 text-primary-600' 
                      : 'border-transparent text-gray-500'
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
          <div className="mt-6">
            {activeTab === 'info' && (
              <div className="grid md:grid-cols-2 gap-6">
                <Card title="Basic Information">
                  <div className="space-y-4">
                    <InfoRow icon={UserIcon} label="Full Name" value={`${user.first_name} ${user.last_name}`} />
                    <InfoRow icon={EnvelopeIcon} label="Email" value={user.email} verified={!!user.email_verified_at} />
                    <InfoRow icon={PhoneIcon} label="Phone" value={user.phone_number} verified={!!user.phone_verified_at} />
                    <InfoRow icon={CalendarIcon} label="Registration Date" value={formatDate(user.created_at)} />
                  </div>
                </Card>

                <Card title="Account Status">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Current Status</p>
                      <Badge variant={getStatusColor(user.status)} size="lg">{user.status.toUpperCase()}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Role</p>
                      <Badge variant={getRoleColor(user.role)} size="lg">{user.role.toUpperCase()}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <StatBox label="Properties" value={user.properties_count} />
                      <StatBox label="Transactions" value={user.transactions_count} />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'properties' && (
              <TabContent 
                data={user.recent_properties} 
                emptyIcon={BuildingOfficeIcon}
                emptyText="No properties found"
                columns={[
                  { key: 'id', label: 'ID', render: (v: number) => `#${v}` },
                  { key: 'title', label: 'Title' },
                  { key: 'status', label: 'Status', render: (v: string) => <Badge variant={getStatusColor(v)}>{v}</Badge> },
                  { key: 'created_at', label: 'Created', render: formatDate },
                ]}
              />
            )}

            {activeTab === 'transactions' && (
              <TabContent 
                data={user.recent_transactions} 
                emptyIcon={CreditCardIcon}
                emptyText="No transactions found"
                columns={[
                  { key: 'id', label: 'ID', render: (v: number) => `#${v}` },
                  { key: 'type', label: 'Type', render: (v: string) => <Badge variant={v === 'buy' ? 'primary' : 'secondary'}>{v.toUpperCase()}</Badge> },
                  { key: 'amount', label: 'Amount', render: (v: string) => formatCurrency(parseFloat(v)), align: 'right' },
                  { key: 'status', label: 'Status', render: (v: string) => <Badge variant={getStatusColor(v)}>{v}</Badge> },
                  { key: 'created_at', label: 'Date', render: formatDate },
                ]}
              />
            )}

            {activeTab === 'ID' && (
              <div>
                {user.id_image_url ? (
                  <div className="flex justify-center">
                    <img
                      src={user.id_image_url}
                      alt="ID Document"
                      className="max-h-96 object-contain rounded-md border cursor-pointer"
                      onClick={() => setShowImageModal(true)}
                    />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <IdentificationIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No ID found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Image Modal */}
      {showImageModal && user.id_image_url && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setShowImageModal(false)}
        >
          <img 
            src={user.id_image_url} 
            alt="ID Document" 
            className="max-w-[90%] max-h-[90%] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

// Helper Components
const InfoRow = ({ icon: Icon, label, value, verified }: any) => (
  <div className="flex items-center space-x-3">
    <Icon className="h-5 w-5 text-gray-400" />
    <div>
      <p className="text-sm font-medium">{value}</p>
      <p className="text-sm text-gray-500">{label} {verified && '(Verified)'}</p>
    </div>
  </div>
);

const StatBox = ({ label, value }: any) => (
  <div>
    <p className="text-sm font-medium mb-1">{label}</p>
    <p className="text-2xl font-bold text-primary-600">{value}</p>
  </div>
);

const TabContent = ({ data, emptyIcon: Icon, emptyText, columns }: any) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">{emptyText}</p>
      </div>
    );
  }

  return <Table data={data} columns={columns} loading={false} />;
};