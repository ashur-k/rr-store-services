import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";

const products = [
  {
    id: "classic-tshirt",
    name: "Classic T-Shirt",
    description: "A comfortable everyday cotton T-shirt.",
    price: 19.99,
    category: "Clothing",
    colours: ["Black", "White", "Navy"],
  },
  {
    id: "polo-shirt",
    name: "Classic Polo Shirt",
    description: "A versatile polo shirt for everyday wear.",
    price: 29.99,
    category: "Clothing",
    colours: ["Navy", "White"],
  },
  {
    id: "hoodie",
    name: "Everyday Hoodie",
    description: "A soft hoodie for cooler days.",
    price: 39.99,
    category: "Clothing",
    colours: ["Black", "Grey"],
  },
  {
    id: "long-sleeve",
    name: "Long Sleeve T-Shirt",
    description: "A classic long-sleeve wardrobe essential.",
    price: 24.99,
    category: "Clothing",
    colours: ["Black", "White"],
  },
];

export function StoreProductPage() {
  return (
    <Container className="py-4 py-md-5">
      <div className="mb-4">
        <h1 className="display-5 fw-bold">Discover Products</h1>
        <p className="text-muted mb-0">
          Find something you'll love from our stores.
        </p>
      </div>

      <Row className="g-4">
        {products.map((product) => (
          <Col key={product.id} xs={12} sm={6} lg={4} xl={3}>
            <Card className="h-100 border-0 shadow-sm">
              <div
                className="bg-light d-flex align-items-center justify-content-center"
                style={{ height: "220px" }}
              >
                <i
                  className="fas fa-tshirt text-secondary"
                  style={{ fontSize: "5rem" }}
                  aria-hidden="true"
                />
              </div>

              <Card.Body className="d-flex flex-column">
                <Badge bg="light" text="dark" className="align-self-start mb-2">
                  {product.category}
                </Badge>

                <Card.Title>{product.name}</Card.Title>

                <Card.Text className="text-muted small">
                  {product.description}
                </Card.Text>

                <p className="small text-muted mb-2">
                  Colours: {product.colours.join(", ")}
                </p>

                <div className="mt-auto">
                  <p className="fs-5 fw-bold mb-3">
                    £{product.price.toFixed(2)}
                  </p>

                  <Button variant="primary" className="w-100" disabled>
                    View product
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
