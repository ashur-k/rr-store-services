
import { useState, type FormEvent } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useCurrentUser } from "../../features/auth/hooks/useCurrentUser";
import { useUpdateUser } from "../../features/users/hooks/useUpdateUser";

export function EditProfilePage() {
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  if (isError || !user) {
    return <p>Failed to load profile.</p>;
  }

  return <EditProfileForm user={user} />;
}

interface EditProfileFormProps {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

function EditProfileForm({ user }: EditProfileFormProps) {
  const navigate = useNavigate();
  const updateMutation = useUpdateUser();

  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    updateMutation.mutate({
      userId: user.id,
      data: {
        first_name: firstName,
        last_name: lastName,
        email,
      },
    });
  }

  return (
    <Container className="py-4">
      <Card>
        <Card.Body>
          <Card.Title>Edit Profile</Card.Title>

          {updateMutation.isError && (
            <Alert variant="danger">
              Failed to update your profile. Please try again.
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label>First name</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="me-2"
            >
              {updateMutation.isPending ? "Saving..." : "Save changes"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
