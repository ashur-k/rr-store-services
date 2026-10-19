import { useNavigate } from "react-router-dom";

import Button from "../../../components/buttons/Button";
import type { DataTableColumn } from "../../../components/tables/DataTable";
import { DataTable } from "../../../components/tables/DataTable";

import { useCurrentUser } from "../../../features/auth/hooks/useCurrentUser";
import { useDeleteUser } from "../../../features/users/hooks/useDeleteUser";
import { useStoreUsers } from "../../../features/users/hooks/useStoreUsers";
import type { ManagedUser } from "../../../features/users/types";

export function ManageStoreUsersTab() {
  const navigate = useNavigate();

  const { data: users = [], isLoading, isError } = useStoreUsers();

  const { data: currentUser } = useCurrentUser();
  const deleteMutation = useDeleteUser();

  function handleDelete(user: ManagedUser) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.email}?`,
    );

    if (confirmed) {
      deleteMutation.mutate(user.id);
    }
  }

  const userColumns: DataTableColumn<ManagedUser>[] = [
    {
      key: "id",
      header: "User ID",
      render: (user) => user.id,
    },
    {
      key: "email",
      header: "Email",
      render: (user) => user.email,
    },
    {
      key: "kc_id",
      header: "Keycloak ID",
      render: (user) => user.kc_id,
    },
    {
      key: "actions",
      header: "Actions",
      render: (user) => {
        const isCurrentUser =
          currentUser?.email?.toLowerCase() === user.email.toLowerCase();

        if (isCurrentUser) {
          return <span>Current user</span>;
        }

        return (
          <Button
            type="button"
            variant="danger"
            className="btn-sm"
            onClick={() => handleDelete(user)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        );
      },
    },
  ];

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h5 mb-1">Store Users</h2>
          <p className="text-muted mb-0">
            View and manage users who own or work with stores.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/store/users/create")}
        >
          <i className="fas fa-plus me-2" />
          Create Store User
        </button>
      </div>

      <DataTable
        data={users}
        columns={userColumns}
        getRowKey={(user) => String(user.id)}
        isLoading={isLoading}
        hasError={isError}
        emptyMessage="No users found."
      />

      {deleteMutation.isError && (
        <p className="text-danger mt-2">
          Failed to delete user. Please try again.
        </p>
      )}
    </section>
  );
}
