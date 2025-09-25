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
import UserMessagesOrigin from '@components/Profile/UserMessagesOrigin';

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
      <UserMessagesOrigin />
  );
};
