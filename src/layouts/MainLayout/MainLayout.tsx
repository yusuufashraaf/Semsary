import Footer from '@components/common/Footer/Footer'
import Header from '@components/common/Header/Header'
import { Container } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import styles from "./styles.module.css";
const { layoutContainer, wrapper } = styles;

function MainLayout() {
  return (
 <Container className={layoutContainer}>
      <Header />
      <div className={wrapper}>
        <Outlet />
      </div>
      <Footer />
    </Container>
  )
}

export default MainLayout
