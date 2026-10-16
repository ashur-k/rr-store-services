import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";

import { createStoreUser } from "../../features/users/api/createStoreUser";

interface CreateStoreUserFormData {
  first_name: string;
  last_name: string;
  email: string;
}

const initialFormData: CreateStoreUserFormData = {
  first_name: "",
  last_name: "",
  email: "",
};

export function CreateStoreUserPage() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState<CreateStoreUserFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await createStoreUser(formData);
      navigate("/store", { state: { activeTab: "manage-store-users" } });
    } catch {
      setErrorMessage(
        "Failed to create the store user. Please check the details and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h3 mb-1">Create Store User</h1>
        <p className="text-muted mb-0">Create a user who can own a store.</p>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            {errorMessage && (
              <Alert variant="danger" role="alert">
                {errorMessage}
              </Alert>
            )}

            <h2 className="h5 mb-3">User details</h2>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="first_name">
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    maxLength={150}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3" controlId="last_name">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    maxLength={150}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-secondary"
                type="button"
                onClick={() => navigate("/store")}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating User..." : "Create Store User"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </main>
  );
}
