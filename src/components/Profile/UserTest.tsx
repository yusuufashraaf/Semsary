import React, { useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import { useAppSelector } from '@store/hook';

interface UserStatus {
  userId: number;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

const UserTest = () => {
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());
  const [awayUsers, setAwayUsers] = useState<Set<number>>(new Set());
  const [userStatuses, setUserStatuses] = useState<UserStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAppSelector(state => state.Authslice);

  // WebSocket connection for user status updates
  useEffect(() => {
    if (!user?.id) return;

    const pusher = new Pusher(import.meta.env.VITE_REVERB_APP_KEY, {
      wsHost: import.meta.env.VITE_REVERB_HOST,
      wsPort: import.meta.env.VITE_REVERB_PORT,
      forceTLS: false,
      disableStats: true,
      cluster: 'mt1',
    });

    // Subscribe to user status channel
    const statusChannel = pusher.subscribe('user-status');
    
    console.log('Subscribed to user status channel');
    
    // Listen for user online events
    statusChannel.bind('UserOnline', (data: { user_id: number }) => {
      console.log('User came online:', data.user_id);
      setOnlineUsers(prev => new Set(prev).add(data.user_id));
      setAwayUsers(prev => {
        const newAway = new Set(prev);
        newAway.delete(data.user_id);
        return newAway;
      });
      
      // Update user statuses array
      setUserStatuses(prev => {
        const existing = prev.find(status => status.userId === data.user_id);
        if (existing) {
          return prev.map(status => 
            status.userId === data.user_id 
              ? { ...status, status: 'online' }
              : status
          );
        }
        return [...prev, { userId: data.user_id, status: 'online' }];
      });
    });

    // Listen for user offline events
    statusChannel.bind('UserOffline', (data: { user_id: number; last_seen: string }) => {
      console.log('User went offline:', data.user_id, data.last_seen);
      setOnlineUsers(prev => {
        const newOnline = new Set(prev);
        newOnline.delete(data.user_id);
        return newOnline;
      });
      setAwayUsers(prev => {
        const newAway = new Set(prev);
        newAway.delete(data.user_id);
        return newAway;
      });
      
      // Update user statuses array
      setUserStatuses(prev => 
        prev.map(status => 
          status.userId === data.user_id 
            ? { ...status, status: 'offline', lastSeen: data.last_seen }
            : status
        )
      );
    });

    // Listen for user away events
    statusChannel.bind('UserAway', (data: { user_id: number }) => {
      console.log('User is away:', data.user_id);
      setOnlineUsers(prev => {
        const newOnline = new Set(prev);
        newOnline.delete(data.user_id);
        return newOnline;
      });
      setAwayUsers(prev => new Set(prev).add(data.user_id));
      
      // Update user statuses array
      setUserStatuses(prev => 
        prev.map(status => 
          status.userId === data.user_id 
            ? { ...status, status: 'away' }
            : status
        )
      );
    });

    // Listen for bulk status updates (when first connecting)
    statusChannel.bind('StatusUpdate', (data: { online_users: number[]; away_users: number[] }) => {
      console.log('Bulk status update received:', data);
      setOnlineUsers(new Set(data.online_users));
      setAwayUsers(new Set(data.away_users));
      
      // Initialize user statuses array
      const statuses: UserStatus[] = [];
      data.online_users.forEach(userId => 
        statuses.push({ userId, status: 'online' })
      );
      data.away_users.forEach(userId => 
        statuses.push({ userId, status: 'away' })
      );
      setUserStatuses(statuses);
    });

    // Cleanup on unmount
    return () => {
      pusher.unsubscribe('user-status');
      pusher.disconnect();
    };
  }, [user?.id]);

  // Fetch initial user statuses
  const fetchInitialStatuses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(import.meta.env.VITE_API_URL + '/user-statuses');
      if (!response.ok) throw new Error('Failed to fetch user statuses');
      
      const data = await response.json();
      setOnlineUsers(new Set(data.online_users || []));
      setAwayUsers(new Set(data.away_users || []));
      setUserStatuses(data.user_statuses || []);
      
      console.log('Initial user statuses loaded:', data);
    } catch (error) {
      console.error('Failed to fetch user statuses:', error);
      setError('Failed to load user statuses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchInitialStatuses();
    }
  }, [user?.id]);

  const getUserStatus = (userId: number): UserStatus | undefined => {
    return userStatuses.find(status => status.userId === userId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#10b981'; // green
      case 'away': return '#f59e0b'; // yellow
      case 'offline': return '#6b7280'; // gray
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  if (loading && userStatuses.length === 0) {
    return (
      <div className="container">
        <div className="loading">Loading user statuses...</div>
      </div>
    );
  }

  if (error && userStatuses.length === 0) {
    return (
      <div className="container">
        <div className="error">Error: {error}</div>
        <button onClick={fetchInitialStatuses} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <h1 className="heading-primary">User Status Monitor</h1>
        <div className="status-summary">
          <span className="status-indicator online">{onlineUsers.size} Online</span>
          <span className="status-indicator away">{awayUsers.size} Away</span>
          <span className="status-indicator offline">{userStatuses.length - onlineUsers.size - awayUsers.size} Offline</span>
        </div>
      </div>

      <div className="user-status-layout">
        <div className="user-list">
          <h2 className="heading-secondary">User Statuses</h2>
          <div className="user-grid">
            {userStatuses.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-users" style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)', opacity: 0.5 }}></i>
                <h3>No Users Found</h3>
                <p>No user status information available.</p>
              </div>
            ) : (
              userStatuses.map((userStatus) => (
                <div key={userStatus.userId} className="user-status-card card">
                  <div className="user-status-header">
                    <h4 className="heading-tertiary">User #{userStatus.userId}</h4>
                    <div className="status-badge" style={{ backgroundColor: getStatusColor(userStatus.status) }}>
                      {getStatusText(userStatus.status)}
                    </div>
                  </div>
                  <div className="user-status-details">
                    <p><strong>Status:</strong> {getStatusText(userStatus.status)}</p>
                    {userStatus.status === 'offline' && userStatus.lastSeen && (
                      <p><strong>Last Seen:</strong> {new Date(userStatus.lastSeen).toLocaleString()}</p>
                    )}
                    <p><strong>User ID:</strong> {userStatus.userId}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="status-log">
          <h2 className="heading-secondary">Real-time Updates</h2>
          <div className="log-container">
            <p>Monitoring user status changes in real-time...</p>
            <div className="log-stats">
              <p>Total Users: {userStatuses.length}</p>
              <p>Online: {onlineUsers.size}</p>
              <p>Away: {awayUsers.size}</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--spacing-lg);
        }

        .status-summary {
          display: flex;
          gap: var(--spacing-md);
        }

        .status-indicator {
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .status-indicator.online {
          background: #10b981;
          color: white;
        }

        .status-indicator.away {
          background: #f59e0b;
          color: white;
        }

        .status-indicator.offline {
          background: #6b7280;
          color: white;
        }

        .user-status-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--spacing-lg);
          height: 600px;
        }

        .user-list {
          background: var(--primary-bg);
          border-radius: var(--radius-md);
          border: 1px solid var(--primary-border);
          padding: var(--spacing-lg);
          overflow-y: auto;
        }

        .status-log {
          background: var(--primary-bg);
          border-radius: var(--radius-md);
          border: 1px solid var(--primary-border);
          padding: var(--spacing-lg);
        }

        .user-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: var(--spacing-md);
        }

        .user-status-card {
          padding: var(--spacing-md);
          border: 1px solid var(--primary-border);
          border-radius: var(--radius-sm);
        }

        .user-status-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-sm);
        }

        .status-badge {
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .user-status-details {
          font-size: 0.9rem;
        }

        .user-status-details p {
          margin: var(--spacing-xs) 0;
        }

        .log-container {
          background: var(--secondary-color);
          padding: var(--spacing-md);
          border-radius: var(--radius-sm);
          margin-top: var(--spacing-md);
        }

        .log-stats {
          margin-top: var(--spacing-md);
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--primary-border);
        }

        @media (max-width: 768px) {
          .user-status-layout {
            grid-template-columns: 1fr;
            height: auto;
          }
          
          .user-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default UserTest;