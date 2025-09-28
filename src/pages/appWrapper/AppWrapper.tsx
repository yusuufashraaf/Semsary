import { useEffect } from "react";
import { getEcho } from "@services/echoManager";
import { toast } from "react-toastify";
import { TFullUser } from "@app-types/users/users.types";
interface IAppWrapper {
    children:React.ReactNode;
    currentUser:TFullUser | null
}

function AppWrapper({ children, currentUser }:IAppWrapper) {
  useEffect(() => {
    if (!currentUser) return;

    const echo = getEcho();
    if (!echo) return;

    const channel = echo.private(`user.${currentUser.id}`);

    const listener = (event: any) => {
      console.log("Realtime event received:", event);
      if (event.id_state) {
        toast.info(`Your ID status has been updated to "${event.id_state}"`);
      }
    };

    channel.listen(".user.updated", listener);

    // don't cleanup on every render – only on unmount
    return () => {
      channel.stopListening(".user.updated", listener);
      echo.leave(`user.${currentUser.id}`);
    };
  }, [currentUser]);

  return children;
}

export default AppWrapper;
