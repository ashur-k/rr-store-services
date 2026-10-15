import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

import { useCurrentUser } from "../../features/auth/hooks/useCurrentUser";
import { useAuth } from "../../features/auth/useAuth";
import { useMyStores } from "../../features/store/hooks/useMyStores";


function Header() {
  const { isAuthenticated, login, logout } = useAuth();
  const { data: stores = [] } = useMyStores();
  const { data: currentUser } = useCurrentUser();

  const canManageUsers =
    currentUser?.realm_roles.includes("admin") ||
    currentUser?.realm_roles.includes("staff");

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
                  {stores.length > 0 && (
                    <Nav.Link as={Link} to="/store">
                      <i className="fas fa-store m-1"></i>
                      Store
                    </Nav.Link>
                  )}

                  {canManageUsers && (
                    <Nav.Link as={Link} to="/manage-users">
                      <i className="fas fa-users m-1"></i>
                      Manage Users
                    </Nav.Link>
                  )}
                
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