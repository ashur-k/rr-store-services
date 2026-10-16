import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useCreateStore } from "../../features/store/hooks/useCreateStore";
import { useStoreUsers } from "../../features/users/hooks/useStoreUsers";

interface CreateStoreFormData {
  name: string;
  slug: string;
  description: string;
  owner_id: string;
}

const initialFormData: CreateStoreFormData = {
  name: "",
  slug: "",
  description: "",
  owner_id: "",
};

export function CreateStorePage() {
  const navigate = useNavigate();
  const { data: users = [], isLoading, isError } = useStoreUsers();
  const createMutation = useCreateStore();

  const [formData, setFormData] =
    useState<CreateStoreFormData>(initialFormData);
  const [ownerSearch, setOwnerSearch] = useState("");
  const [showOwnerResults, setShowOwnerResults] = useState(false);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    createMutation.mutate(formData, {
      onSuccess: () => {
        navigate("/store");
      },
    });
  }

  const filteredUsers = users.filter((user) =>
    user.email?.toLowerCase().includes(ownerSearch.toLowerCase()),
  );

  return (
    <main className="container-fluid py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8} xl={6}>
          <Card>
            <Card.Body className="p-4">
              <h1 className="h3 mb-1">Create Store</h1>
              <p className="text-muted mb-4">
                Create a store and assign its owner.
              </p>

              {isError && (
                <p className="text-danger" role="alert">
                  Failed to load store owners. Please try again.
                </p>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="storeName">
                  <Form.Label>Store name</Form.Label>
                  <Form.Control
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={255}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="storeSlug">
                  <Form.Label>Store slug</Form.Label>
                  <Form.Control
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    maxLength={255}
                    placeholder="ashur"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="storeDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="storeOwner">
                  <Form.Label>Store owner</Form.Label>

                  <Form.Control
                    type="text"
                    placeholder={
                      isLoading
                        ? "Loading store owners..."
                        : "Search by email..."
                    }
                    value={ownerSearch}
                    onChange={(event) => {
                      setOwnerSearch(event.target.value);
                      setShowOwnerResults(true);

                      setFormData((previous) => ({
                        ...previous,
                        owner_id: "",
                      }));
                    }}
                    onFocus={() => setShowOwnerResults(true)}
                    disabled={isLoading || isError}
                    required={!formData.owner_id}
                    autoComplete="off"
                  />

                  {showOwnerResults && ownerSearch.trim() && (
                    <div className="list-group mt-1">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.slice(0, 10).map((user) => (
                          <button
                            key={user.kc_id}
                            type="button"
                            className="list-group-item list-group-item-action"
                            onClick={() => {
                              setFormData((previous) => ({
                                ...previous,
                                owner_id: user.kc_id,
                              }));
                              setOwnerSearch(user.email ?? "");
                              setShowOwnerResults(false);
                            }}
                          >
                            {user.email}
                          </button>
                        ))
                      ) : (
                        <div className="list-group-item text-muted">
                          No store owners found.
                        </div>
                      )}
                    </div>
                  )}

                  {formData.owner_id && (
                    <Form.Text className="text-success">
                      Store owner selected.
                    </Form.Text>
                  )}
                </Form.Group>

                <div className="d-flex justify-content-end gap-2">
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => navigate("/store")}
                    disabled={createMutation.isPending}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={createMutation.isPending || isLoading || isError}
                  >
                    {createMutation.isPending ? "Creating..." : "Create Store"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </main>
  );
}
