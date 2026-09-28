
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import api from "../services/api/axios";
import { useCurrentUser } from "../features/auth/hooks/useCurrentUser";
import { deleteUser } from "../features/users/api/deleteUser";

interface ManagedUser {
  id: number;
  kc_id: string;
  email: string;
}

async function getUsers(): Promise<ManagedUser[]> {
  const response = await api.get("/users/");
  return response.data;
}

export function ManageUsersPage() {
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery<ManagedUser[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const { data: currentUser } = useCurrentUser();

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });

  if (isLoading) {
    return <p>Loading users...</p>;
  }

  if (isError || !users) {
    return <p>Failed to load users.</p>;
  }

  function handleDelete(user: ManagedUser) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.email}?`
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(user.id);
  }

  return (
    <main>
      <h1>Manage Users</h1>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div>
          {users.map((user) => {
            const isCurrentUser =
                currentUser?.email?.toLowerCase() === user.email.toLowerCase();

            return (
              <div key={user.id}>
                <p>Email: {user.email}</p>
                <p>Keycloak ID: {user.kc_id}</p>
                <p>Django ID: {user.id}</p>

                {isCurrentUser ? (
                  <p>Current user</p>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleDelete(user)}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                  </button>
                )}

                <hr />
              </div>
            );
          })}
        </div>
      )}

      {deleteMutation.isError && (
        <p>Failed to delete user.</p>
      )}
    </main>
  );
}

