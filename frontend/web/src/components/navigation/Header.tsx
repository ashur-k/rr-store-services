import { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

import { useAuth } from "../../features/auth/useAuth";
import { useStoresWithOwners } from "../../features/users/hooks/useStoresWithOwners";

import "./Header.css";

function Header() {
  const { isAuthenticated, login, logout } = useAuth();
  const { data: stores = [] } = useStoresWithOwners();

  const [search, setSearch] = useState("");

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} to="/">
            RR Store
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Form
              className="header-search"
              role="search"
              onSubmit={(event) => event.preventDefault()}
            >
              <Form.Control
                type="search"
                placeholder="Search products..."
                aria-label="Search products"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </Form>

            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/cart">
                <i className="fas fa-shopping-cart m-1"></i>
                Cart
              </Nav.Link>

              {isAuthenticated ? (
                <>
                  {stores.length > 0 && (
                    <Nav.Link as={Link} to="/store">
                      <i className="fas fa-store m-1"></i>
                      Admin
                    </Nav.Link>
                  )}

                  <Nav.Link as={Link} to="/store-owner">
                    <i className="fas fa-store m-1"></i>
                    Store Owner
                  </Nav.Link>

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
