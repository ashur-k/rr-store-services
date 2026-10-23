
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import type { DataTableColumn } from "../../components/tables/DataTable";
import { DataTable } from "../../components/tables/DataTable";
import { useStoresWithOwners } from "../../features/users/hooks/useStoresWithOwners";
import type { StoreWithOwner } from "../../features/users/types";

export function StorePage() {
  const navigate = useNavigate();

  const {
    data: stores = [],
    isLoading,
    isError,
  } = useStoresWithOwners();

  const columns: DataTableColumn<StoreWithOwner>[] = [
    {
      key: "store_name",
      header: "Store Name",
      render: (store) => (
        <span className="fw-semibold">{store.store_name}</span>
      ),
    },
    {
      key: "store_user_full_name",
      header: "User Name",
      render: (store) => store.store_user_full_name || "—",
    },
    {
      key: "store_user_email",
      header: "User Email",
      render: (store) => store.store_user_email,
    },
    {
      key: "actions",
      header: "Actions",
      render: () => (
        <Button
          type="button"
          variant="danger"
          size="sm"
          disabled
          title="Delete functionality will be implemented later"
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1 className="h3 mb-1">Admin Store Management</h1>
          <p className="text-muted mb-0">
            Manage stores and their associated users.
          </p>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <Button onClick={() => navigate("/store/create")}>
            <i className="fas fa-store me-2" />
            Create Store
          </Button>

          <Button
            variant="outline-primary"
            onClick={() => navigate("/store/users/create")}
          >
            <i className="fas fa-user-plus me-2" />
            Create Store User
          </Button>
        </div>
      </div>

      <DataTable
        data={stores}
        columns={columns}
        getRowKey={(store) => store.store_id}
        isLoading={isLoading}
        hasError={isError}
        emptyMessage="No stores found."
      />
    </Container>
  );
}
