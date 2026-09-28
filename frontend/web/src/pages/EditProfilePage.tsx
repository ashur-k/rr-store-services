
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useCurrentUser } from "../features/auth/hooks/useCurrentUser";
import {updateUser, type UpdateUserData,} from "../features/users/api/updateUser.ts";

export function EditProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading, isError } = useCurrentUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    setFirstName(user.first_name);
    setLastName(user.last_name);
    setEmail(user.email);
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateUserData) =>
      updateUser(user!.id, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });

      navigate("/profile");
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    updateMutation.mutate({
      first_name: firstName,
      last_name: lastName,
      email,
    });
  }

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  if (isError || !user) {
    return <p>Failed to load profile.</p>;
  }

  return (
    <Container className="py-5">
      <Card className="mx-auto" style={{ maxWidth: "500px" }}>
        <Card.Body>
          <h1 className="mb-4">Edit Profile</h1>

          {updateMutation.isError && (
            <Alert variant="danger">
              Failed to update your profile.
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

            <div className="d-flex gap-2">
              <Button
                type="submit"
                variant="dark"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending
                  ? "Saving..."
                  : "Save changes"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/profile")}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

