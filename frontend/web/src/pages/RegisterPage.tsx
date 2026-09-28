import { useState, type FormEvent } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../features/auth/api/registerUser";
import { useAuth } from "../features/auth/useAuth";

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: async () => {
      await login();
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordError("");

    registerMutation.mutate({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    });
  }

  return (
    <Container className="py-5">
      <Card className="mx-auto" style={{ maxWidth: "500px" }}>
        <Card.Body>
          <h1 className="mb-4">Create Account</h1>

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

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                required
              />
            </Form.Group>

            {passwordError && (
              <p className="text-danger">{passwordError}</p>
            )}

            {registerMutation.isError && (
              <p className="text-danger">
                Registration failed. Please check your details.
              </p>
            )}

            <Button
              type="submit"
              variant="dark"
              disabled={registerMutation.isPending}
              className="w-100"
            >
              {registerMutation.isPending
                ? "Creating account..."
                : "Create account"}
            </Button>
          </Form>

          <Button
            variant="link"
            className="w-100 mt-3"
            onClick={() => navigate("/")}
          >
            Back to store
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}