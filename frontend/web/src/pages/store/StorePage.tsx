import { useState } from "react";
import { Container, Nav } from "react-bootstrap";
import { useLocation } from "react-router-dom";

import { ManageStoresTab } from "./tabs/ManageStoresTab";
import { ManageStoreUsersTab } from "./tabs/ManageStoreUsersTab";

type StoreTab = "manage-store" | "manage-store-users";

export function StorePage() {
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<StoreTab>(
    location.state?.activeTab ?? "manage-store",
  );

  return (
    <Container fluid className="py-4">
      <div className="mb-4">
        <h1 className="h3 mb-1">Store Management</h1>
        <p className="text-muted mb-0">
          Manage your stores and the users associated with them.
        </p>
      </div>

      <Nav
        variant="tabs"
        activeKey={activeTab}
        onSelect={(key) => {
          if (key === "manage-store" || key === "manage-store-users") {
            setActiveTab(key);
          }
        }}
        className="mb-4"
      >
        <Nav.Item>
          <Nav.Link eventKey="manage-store">
            <i className="fas fa-store me-2" />
            Manage Store
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link eventKey="manage-store-users">
            <i className="fas fa-users me-2" />
            Manage Store Users
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {activeTab === "manage-store" && <ManageStoresTab />}

      {activeTab === "manage-store-users" && <ManageStoreUsersTab />}
    </Container>
  );
}
