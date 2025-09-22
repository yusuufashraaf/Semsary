import React from 'react';
import BasicInfo from '@components/User/BasicInfo/BasicInfo';
import ChangeEmail from '@components/User/ChangeEmail/ChangeEmail';
import ChangePhone from '@components/User/ChangePhone/ChangePhone';
import ChangePassword from '@components/User/ChangePassword/ChangePassword';

export const AdminProfilePage: React.FC = () => {
  const [activeSection, setActiveSection] = React.useState('basic');

  const renderSection = () => {
    switch (activeSection) {
      case 'basic':
        return <BasicInfo />;
      case 'email':
        return <ChangeEmail />;
      case 'phone':
        return <ChangePhone />;
      case 'password':
        return <ChangePassword />;
      default:
        return <BasicInfo />;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Profile Settings</h1>
      
      {/* Admin Profile Navigation */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveSection('basic')}
          className={`pb-2 px-1 ${activeSection === 'basic' 
            ? 'border-b-2 border-blue-500 text-blue-600' 
            : 'text-gray-500'}`}
        >
          Basic Info
        </button>
        <button
          onClick={() => setActiveSection('email')}
          className={`pb-2 px-1 ${activeSection === 'email' 
            ? 'border-b-2 border-blue-500 text-blue-600' 
            : 'text-gray-500'}`}
        >
          Change Email
        </button>
        <button
          onClick={() => setActiveSection('phone')}
          className={`pb-2 px-1 ${activeSection === 'phone' 
            ? 'border-b-2 border-blue-500 text-blue-600' 
            : 'text-gray-500'}`}
        >
          Change Phone
        </button>
        <button
          onClick={() => setActiveSection('password')}
          className={`pb-2 px-1 ${activeSection === 'password' 
            ? 'border-b-2 border-blue-500 text-blue-600' 
            : 'text-gray-500'}`}
        >
          Change Password
        </button>
      </div>

      {/* Profile Content */}
      <div className="bg-white rounded-lg shadow">
        {renderSection()}
      </div>
    </div>
  );
};
