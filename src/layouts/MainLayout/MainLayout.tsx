import Footer from "@components/common/Footer/Footer";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import styles from "./styles.module.css";
import Navbar from "@components/Navbar/Navbar";

const { layoutContainer, wrapper } = styles;

function MainLayout() {


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
