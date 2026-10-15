import { DataTable } from "../../components/tables/DataTable";
import type { DataTableColumn } from "../../components/tables/DataTable";

import { useUsers } from "../../features/users/hooks/useUsers";
import type { ManagedUser } from "../../features/users/types";


import { useCurrentUser } from "../../features/auth/hooks/useCurrentUser";
import { useDeleteUser } from "../../features/users/hooks/useDeleteUser";
import Button from "../../components/buttons//Button";


export function ManageUsersPage() {

  const {
    data: users = [],
    isLoading,
    isError,
  } = useUsers();

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

  const columns: DataTableColumn<ManagedUser>[] = [
    {
      key: "id",
      header: "User ID",
      render: (user: ManagedUser) => user.id,
    },
    {
      key: "email",
      header: "Email",
      render: (user: ManagedUser) => user.email,
    },
    {
      key: "kc_id",
      header: "Keycloak ID",
      render: (user: ManagedUser) => user.kc_id,
    },
    {
      key: "actions",
      header: "Actions",
      render: (user: ManagedUser) => {
        const isCurrentUser =
          currentUser?.email?.toLowerCase() ===
          user.email.toLowerCase();

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
          >{deleteMutation.isPending ? "Deleting..." : "Delete"}
        </Button>
        );
      },
    },
  ];

  return (
    <main>
      <h1>Manage Users</h1>

      <DataTable
        data={users}
        columns={columns}
        getRowKey={(user) => String(user.id)}
        isLoading={isLoading}
        hasError={isError}
        emptyMessage="No users found."
      />

      {deleteMutation.isError && (
        <p className="text-danger mt-2">
          Failed to delete user.
        </p>
      )}
    </main>
  );
}
