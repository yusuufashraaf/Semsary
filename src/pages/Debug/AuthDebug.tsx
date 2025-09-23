import React from 'react';
import { useAppSelector } from '@store/hook';
import { Link } from 'react-router-dom';

export const AuthDebug: React.FC = () => {
  const { user, jwt, loading, isInitialized } = useAppSelector(state => state.Authslice);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Auth Debug Information</h1>
      
      <div style={{ background: '#f5f5f5', padding: '15px', marginBottom: '20px' }}>
        <h3>Authentication State:</h3>
        <pre>{JSON.stringify({
          hasJWT: !!jwt,
          jwtLength: jwt?.length || 0,
          loading,
          isInitialized,
        }, null, 2)}</pre>
      </div>

      <div style={{ background: '#f0f8ff', padding: '15px', marginBottom: '20px' }}>
        <h3>User Information:</h3>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>

      <div style={{ background: '#f0fff0', padding: '15px', marginBottom: '20px' }}>
        <h3>Role Analysis:</h3>
        <p><strong>User Role:</strong> "{user?.role}"</p>
        <p><strong>Role Type:</strong> {typeof user?.role}</p>
        <p><strong>Is Agent:</strong> {user?.role === 'agent' ? 'Yes' : 'No'}</p>
        <p><strong>Is CS_Agent:</strong> {user?.role === 'CS_Agent' ? 'Yes' : 'No'}</p>
        <p><strong>Is Admin:</strong> {user?.role === 'admin' ? 'Yes' : 'No'}</p>
        <p><strong>Is Owner:</strong> {user?.role === 'owner' ? 'Yes' : 'No'}</p>
      </div>

      <div style={{ background: '#fff0f5', padding: '15px' }}>
        <h3>Test Links:</h3>
        <ul>
          <li><Link to="/cs-agent/dashboard">CS Agent Dashboard</Link></li>
          <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
          <li><Link to="/">Home</Link></li>
        </ul>
      </div>
    </div>
  );
};
