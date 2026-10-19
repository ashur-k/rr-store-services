import { Alert, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import type { DataTableColumn } from "../../../components/tables/DataTable";
import { DataTable } from "../../../components/tables/DataTable";
import { useDeleteStore } from "../../../features/store/hooks/useDeleteStore";
import { useMyStores } from "../../../features/store/hooks/useMyStores";
import type { Store } from "../../../features/store/types";

export function ManageStoresTab() {
  const navigate = useNavigate();

  const { data: stores = [], isLoading, error } = useMyStores();

  const deleteMutation = useDeleteStore();

  function handleDelete(store: Store) {
    const confirmed = window.confirm(
      `Are you sure you want to delete the store "${store.name}"? This action cannot be undone.`,
    );

    if (confirmed) {
      deleteMutation.mutate(store.id);
    }
  }

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
    {
      key: "actions",
      header: "Actions",
      render: (store) => (
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={() => handleDelete(store)}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete"}
        </Button>
      ),
    },
  ];

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h5 mb-1">Your Stores</h2>
          <p className="text-muted mb-0">View and manage platform stores.</p>
        </div>

        <Button onClick={() => navigate("/store/create")}>
          <i className="fas fa-plus me-2" />
          Create Store
        </Button>
      </div>
      {deleteMutation.isSuccess && (
        <Alert variant="success" dismissible>
          Store deleted successfully.
        </Alert>
      )}

      {deleteMutation.isError && (
        <Alert variant="danger" dismissible>
          Failed to delete the store. Please try again.
        </Alert>
      )}

      <DataTable
        data={stores}
        columns={storeColumns}
        getRowKey={(store) => store.id}
        isLoading={isLoading}
        hasError={Boolean(error)}
        emptyMessage="No stores found."
      />
    </section>
  );
}
