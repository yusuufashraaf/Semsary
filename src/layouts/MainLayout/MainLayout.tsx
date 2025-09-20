import Footer from "@components/common/Footer/Footer";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import styles from "./styles.module.css";
import Navbar from "@components/Navbar/Navbar";
import { useNotifications } from "@hooks/useNotifications";
import { useSelector } from "react-redux";
import type { RootState } from "@store/index";
import { toast } from "react-toastify";

const { layoutContainer, wrapper } = styles;

function MainLayout() {
  const user = useSelector((state: RootState) => state.Authslice.user);
  const jwt = useSelector((state: RootState) => state.Authslice.jwt);

  // always call the hook, pass null if not logged in (for test only)
  const notifications = useNotifications(jwt && user?.id ? user.id : null);
console.log(notifications);

  return (
    <Container fluid className={layoutContainer}>
      <Navbar />

      {notifications.length > 0 && (
        <div className="p-2">
          {notifications.map((n, i) => (
            <div key={i} >
              {toast.success(n.message)}
            </div>
          ))}
        </div>
      )}

      <div className={wrapper}>
        <Outlet />
      </div>
      <Footer />
    </Container>
  );
}

export default MainLayout;

