import Pusher from 'pusher-js';
import Echo from 'laravel-echo';

const appKey = import.meta.env.VITE_PUSHER_APP_KEY || import.meta.env.VITE_REVERB_APP_KEY;
const host = import.meta.env.VITE_REVERB_HOST || '127.0.0.1';
const port = import.meta.env.VITE_REVERB_PORT || '8080';
const scheme = import.meta.env.VITE_REVERB_SCHEME || 'http';

export const initializeEcho = (token: string) => {
  if (!appKey) {
    console.warn('WebSocket app key not found. Real-time features will be disabled.');
    return null;
  }

  console.log('Initializing WebSocket with:', { appKey, host, port, scheme });

  // Use the built-in Laravel authentication (no custom authorizer)
  const pusher = new Pusher(appKey, {
    wsHost: host,
    wsPort: parseInt(port),
    wssPort: parseInt(port),
    forceTLS: scheme === 'https',
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
    cluster: '', // Empty for Reverb
    authEndpoint: `${import.meta.env.VITE_API_URL}/broadcasting/auth`,
    auth: {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    },
  });

  const echo = new Echo({
    broadcaster: 'pusher',
    client: pusher,
    key: appKey,
    wsHost: host,
    wsPort: parseInt(port),
    wssPort: parseInt(port),
    forceTLS: scheme === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${import.meta.env.VITE_API_URL}/broadcasting/auth`,
    auth: {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    },
  });

  return echo;
};