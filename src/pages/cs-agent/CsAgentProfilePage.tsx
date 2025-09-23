import React from 'react';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { useCsAgentUIStore, useCsAgentNotifications } from '@store/cs-agent/csAgentStore';
import { useAppSelector } from '@store/hook';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon,
  BellIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@utils/classNames';

export const CsAgentProfilePage: React.FC = () => {
  const { setActivePage, darkMode, setDarkMode } = useCsAgentUIStore();
  const { user } = useAppSelector(state => state.Authslice);
  const { showSuccess } = useCsAgentNotifications();
  
  const [formData, setFormData] = React.useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone_number || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  });

  React.useEffect(() => {
    setActivePage('profile');
    document.title = 'Profile Settings - CS Agent - Semsary';
  }, [setActivePage]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement profile update logic
    showSuccess('Profile Updated', 'Your profile has been successfully updated.');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement password change logic
    showSuccess('Password Changed', 'Your password has been successfully changed.');
  };

  const handleNotificationToggle = (type: 'email' | 'push' | 'sms') => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  return (
    <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <div className="p-6">
                <div className="text-center">
                  <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold">
                    {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                    {user?.first_name} {user?.last_name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">CS Agent</p>
                  <div className="mt-4 flex justify-center">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/50 dark:text-green-300">
                      Active
                    </span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Member Since</span>
                    <span className="font-medium text-gray-900 dark:text-white">Jan 2024</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total Verifications</span>
                    <span className="font-medium text-gray-900 dark:text-white">245</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
                    <span className="font-medium text-gray-900 dark:text-white">92%</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Personal Information
                </h3>
              </div>
              <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="First Name"
                    icon={<UserCircleIcon className="h-5 w-5" />}
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
                <Input
                  label="Email Address"
                  type="email"
                  icon={<EnvelopeIcon className="h-5 w-5" />}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  icon={<PhoneIcon className="h-5 w-5" />}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <div className="flex justify-end">
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>

            {/* Change Password */}
            <Card>
              <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Change Password
                </h3>
              </div>
              <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  icon={<KeyIcon className="h-5 w-5" />}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                />
                <Input
                  label="New Password"
                  type="password"
                  icon={<KeyIcon className="h-5 w-5" />}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  icon={<KeyIcon className="h-5 w-5" />}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                <div className="flex justify-end">
                  <Button type="submit" variant="primary">
                    Update Password
                  </Button>
                </div>
              </form>
            </Card>

            {/* Preferences */}
            <Card>
              <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Preferences
                </h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {darkMode ? (
                      <MoonIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <SunIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Dark Mode
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Use dark theme across the application
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      darkMode ? 'bg-teal-600' : 'bg-gray-200 dark:bg-gray-700'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        darkMode ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>

                {/* Notification Preferences */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <BellIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Notifications
                    </p>
                  </div>
                  
                  <div className="ml-8 space-y-3">
                    {Object.entries(formData.notifications).map(([key, enabled]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {key.charAt(0).toUpperCase() + key.slice(1)} Notifications
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Receive {key} notifications for new assignments
                          </p>
                        </div>
                        <button
                          onClick={() => handleNotificationToggle(key as 'email' | 'push' | 'sms')}
                          className={cn(
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                            enabled ? 'bg-teal-600' : 'bg-gray-200 dark:bg-gray-700'
                          )}
                        >
                          <span
                            className={cn(
                              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                              enabled ? 'translate-x-6' : 'translate-x-1'
                            )}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
    </div>
  );
};
