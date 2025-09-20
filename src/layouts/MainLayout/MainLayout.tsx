// components/MainLayout.tsx
import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import Navbar from "@components/Navbar/Navbar";
import Footer from "@components/common/Footer/Footer";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import styles from "./styles.module.css";
import NotificationList from "@components/common/NotificationsList/NotificationsList";

const { layoutContainer, wrapper } = styles;

function MainLayout() {
  const user = useSelector((state: RootState) => state.Authslice.user);

  return (
    <Container fluid className={layoutContainer}>
      <Navbar />

      <div className={wrapper}>
        <Outlet />
      </div>

      {/* Pass userId to NotificationList */}
      <NotificationList userId={user?.id ?? null} />

      <Footer />
    </Container>
  );
}

export default MainLayout;
