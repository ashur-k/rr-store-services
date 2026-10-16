import { useState } from "react";
import { Badge, Button, Container, Nav } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { ManageUsersPage } from "../users/ManageUsersPage";

import type { DataTableColumn } from "../../components/tables/DataTable";
import { DataTable } from "../../components/tables/DataTable";
import { useMyStores } from "../../features/store/hooks/useMyStores";
import type { Store } from "../../features/store/types";

type StoreTab = "manage-store" | "manage-store-users";

const storeColumns: DataTableColumn<Store>[] = [
  {
    key: "name",
    header: "Name",
    render: (store) => <span className="fw-semibold">{store.name}</span>,
  },
  {
    key: "description",
    header: "Description",
    render: (store) => (
      <span className="text-muted">
        {store.description || "No description provided"}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (store) => (
      <Badge bg={store.status === "active" ? "success" : "secondary"} pill>
        {store.status}
      </Badge>
    ),
  },
];

export function StorePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<StoreTab>(
    location.state?.activeTab ?? "manage-store",
  );

  const { data: stores = [], isLoading, error } = useMyStores();

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

      {activeTab === "manage-store" && (
        <section>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h5 mb-1">Your Stores</h2>
              <p className="text-muted mb-0">
                View and manage platform stores.
              </p>
            </div>

            <Button onClick={() => navigate("/store/create")}>
              <i className="fas fa-plus me-2" />
              Create Store
            </Button>
          </div>

          <DataTable
            data={stores}
            columns={storeColumns}
            getRowKey={(store) => store.id}
            isLoading={isLoading}
            hasError={Boolean(error)}
            emptyMessage="No stores found."
          />
        </section>
      )}

      {activeTab === "manage-store-users" && (
        <section>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h5 mb-1">Store Users</h2>
              <p className="text-muted mb-0">
                View and manage users who own or work with stores.
              </p>
            </div>

            <Button onClick={() => navigate("/store/users/create")}>
              <i className="fas fa-plus me-2" />
              Create Store User
            </Button>
          </div>

          <ManageUsersPage />
        </section>
      )}
    </Container>
  );
}
