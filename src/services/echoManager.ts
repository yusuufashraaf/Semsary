// src/services/echoManager.ts
import EchoBase from "laravel-echo";
import Pusher from "pusher-js";

// Force Echo to use the "pusher" generic since Reverb is Pusher-compatible
type Echo = EchoBase<"pusher">;
const EchoClass = EchoBase as unknown as { new (opts: any): Echo };

let echo: Echo | null = null;

export const getEcho = () => echo;

export const initEcho = (jwt: string) => {
  // cleanup old instance
  if (echo) echo.disconnect();

  // required for laravel-echo + pusher/reverb
  (window as any).Pusher = Pusher;

  // initialize
  echo = new EchoClass({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: import.meta.env.VITE_REVERB_SCHEME === "https",
    enabledTransports: ["ws", "wss"],

   authEndpoint: `${import.meta.env.VITE_API_URL.replace('/api', '')}/broadcasting/auth`,

    auth: {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
      },
    },
  });

  return echo;
};

export const disconnectEcho = () => {
  if (echo) {
    echo.disconnect();
    echo = null;
  }
};
