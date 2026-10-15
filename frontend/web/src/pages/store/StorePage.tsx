
import { Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DataTable } from "../../components/tables/DataTable";
import type { DataTableColumn } from "../../components/tables/DataTable";
import type { Store } from "../../features/store/types";
import { useMyStores } from "../../features/store/hooks/useMyStores";

const storeColumns: DataTableColumn<Store>[] = [
  {
    key: "name",
    header: "Name",
    render: (store) => (
      <span className="fw-semibold">{store.name}</span>
    ),
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
      <Badge
        bg={store.status === "active" ? "success" : "secondary"}
        pill
      >
        {store.status}
      </Badge>
    ),
  },
];

export function StorePage() {
  const navigate = useNavigate();
  const { data: stores = [], isLoading, error } = useMyStores();

  return (
    <main className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Store Management</h1>
          <p className="text-muted mb-0">
            View and manage platform stores.
          </p>
        </div>

        <Button onClick={() => navigate("/store/create")}>
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
    </main>
  );
}
