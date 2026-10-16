import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Footer from "../footer/Footer";
import Header from "../navigation/Header";

export default function MainLayout() {
  return (
    <>
      <Header />

      <main className="py-5">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </>
  );
}
