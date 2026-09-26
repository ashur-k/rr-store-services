import { useCurrentUser } from '../features/auth/hooks/useCurrentUser'

export function ProfilePage() {
  const { data: user, isLoading, isError } = useCurrentUser()

  if (isLoading) {
    return <p>Loading profile...</p>
  }

  if (isError || !user) {
    return <p>Failed to load profile.</p>
  }

  return (
    <main>
      <h1>Profile</h1>

      <p>
        Name: {user.first_name} {user.last_name}
      </p>

      <p>Email: {user.email}</p>
    </main>
  )
}