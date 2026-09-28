import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

import { useAuth } from "../../features/auth/useAuth";

function Header() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Brand href="/">
            RR Store
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav
              className="ms-auto"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link href="/cart">
                <i className="fas fa-shopping-cart m-1"></i>
                Cart
              </Nav.Link>

              {isAuthenticated ? (
                <>
                  <Nav.Link href="/profile">
                    <i className="fas fa-user m-1"></i>
                    Profile
                  </Nav.Link>

                  <Nav.Link onClick={logout}>
                    <i className="fas fa-sign-out-alt m-1"></i>
                    Logout
                  </Nav.Link>
                </>
              ) : (
                <>
                <Nav.Link onClick={login}>
                  <i className="fas fa-user m-1"></i>
                  Login
                </Nav.Link>

                <Nav.Link as={Link} to="/register">
                  <i className="fas fa-user-plus m-1"></i>
                  Register
                </Nav.Link>
              </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;