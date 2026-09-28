import { Link } from "react-router-dom";

import { useCurrentUser } from "../features/auth/hooks/useCurrentUser";

export function ProfilePage() {
  const {data: user, isLoading, isError} = useCurrentUser();

  if (isLoading) {return <p>Loading profile...</p>;}

  if (isError || !user) {return <p>Failed to load profile.</p>;}

  const canManageUsers =
    user.realm_roles.includes("admin") ||
    user.realm_roles.includes("staff");

  return (
    <main>
      <h1>Profile</h1>

      <p>
        Name: {user.first_name} {user.last_name}
      </p>

      <p>Email: {user.email}</p>

      <section>
        <h2>Account</h2>

        <Link to="/profile/edit">
          Edit Profile
        </Link>
      </section>

      {canManageUsers && (
        <section>
          <h2>User Management</h2>

          <Link to="/profile/users">
            Manage Users
          </Link>
        </section>
      )}
    </main>
  );
}
