import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@store/index";
import { clearNotifications } from "@store/Noifications/notificationsSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNotifications } from "@hooks/useNotifications";
import Navbar from "@components/Navbar/Navbar";
import Footer from "@components/common/Footer/Footer";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import styles from "./styles.module.css";

const { layoutContainer, wrapper } = styles;

function MainLayout() {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state: RootState) => state.notifications.items
  );
  const user = useSelector((state: RootState) => state.Authslice.user);

  // 🔔 Subscribe to notifications via Echo
  useNotifications(user?.id ?? null);

  // 🎯 Show toast and clear them right after
  useEffect(() => {
    if (notifications.length > 0) {
      notifications.forEach((n) => toast.success(n.message));
      dispatch(clearNotifications());
    }
  }, [notifications, dispatch]);

  return (
    <Container fluid className={layoutContainer}>
      <Navbar />

      <div className={wrapper}>
        <Outlet />
      </div>

      <Footer />
    </Container>
  );
}

export default MainLayout;
