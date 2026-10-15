
import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createStoreOwner } from "../../features/users/api/createStoreOwner";


interface CreateStoreFormData {
  first_name: string;
  last_name: string;
  email: string;
  store_name: string;
  store_slug: string;
}

const initialFormData: CreateStoreFormData = {
  first_name: "",
  last_name: "",
  email: "",
  store_name: "",
  store_slug: "",
};


export function CreateStorePage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CreateStoreFormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
    ) {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
        await createStoreOwner(formData);
        navigate("/store");
    } catch {
        setErrorMessage(
        "Failed to create the store. Please check the details and try again.",
        );
    } finally {
        setIsSubmitting(false);
    }
    }

  return (
    <main className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h3 mb-1">Create Store</h1>
        <p className="text-muted mb-0">
          Create a store and assign its owner.
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            {errorMessage && (
            <Alert variant="danger" role="alert">
                {errorMessage}
            </Alert>
            )}
            <h2 className="h5 mb-3">Store owner details</h2>

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

            <hr className="my-4" />

            <h2 className="h5 mb-3">Store details</h2>

            <Form.Group className="mb-3" controlId="store_name">
              <Form.Label>Store name</Form.Label>
              <Form.Control
                name="store_name"
                value={formData.store_name}
                onChange={handleChange}
                required
                maxLength={255}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="store_slug">
              <Form.Label>Store slug</Form.Label>
              <Form.Control
                name="store_slug"
                value={formData.store_slug}
                onChange={handleChange}
                required
                maxLength={100}
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                title="Use lowercase letters, numbers, and hyphens only."
                placeholder="e.g. ashurs-store"
              />
              <Form.Text className="text-muted">
                Used in the store URL. Use lowercase letters, numbers,
                and hyphens.
              </Form.Text>
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
                {isSubmitting ? "Creating Store..." : "Create Store"}
            </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </main>
  );
}
