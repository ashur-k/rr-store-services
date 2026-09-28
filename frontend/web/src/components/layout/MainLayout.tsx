import { Outlet } from "react-router-dom";
import Header from "../navigation/Header";
import Footer from "../footer/Footer";
import { Container } from 'react-bootstrap'

export default function MainLayout() {

  return (
    <>
      <Header/>
      
      <main className="py-5">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer/>
    </>
  );
}