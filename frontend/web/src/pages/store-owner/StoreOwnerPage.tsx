
import "./StoreOwnerPage.css";
import {
  Alert,
  Badge,
  Button,
  Container,
  Form,
  Image,
  Nav,
  Spinner,
  Tab,
} from "react-bootstrap";

import type { DataTableColumn } from "../../components/tables/DataTable";
import { DataTable } from "../../components/tables/DataTable";
import { useProductsByStore } from "../../features/product/hooks/useProducts";
import type { Product } from "../../features/product/api/types";


import { useOwnerStores } from "../../features/store/hooks/useOwnerStores";

function StoreOwnerPage() {
  const {
    data: stores = [],
    isLoading: storesLoading,
    isError: storesError,
    selectedStoreSlug,
    selectStore,
  } = useOwnerStores();

const {
  data: products = [],
  isLoading: productsLoading,
  isError: productsError,
} = useProductsByStore(selectedStoreSlug);

  const productColumns: DataTableColumn<Product>[] = [
    {
      key: "product",
      header: "Product",
      render: (product) => (
        <div className="d-flex align-items-center gap-3">
          {product.images[0]?.image_url ? (
            <Image
              src={product.images[0].image_url}
              alt={product.name}
              width={56}
              height={56}
              rounded
              className="border"
              style={{ objectFit: "cover", flexShrink: 0 }}
            />
          ) : (
            <div
              className="border rounded bg-light d-flex align-items-center justify-content-center text-muted"
              style={{ width: 56, height: 56, flexShrink: 0 }}
            >
              <i className="fas fa-image" />
            </div>
          )}

          <div>
            <div className="fw-semibold">{product.name}</div>
            {product.description && (
              <small className="text-muted">
                {product.description}
              </small>
            )}
            <div className="d-flex gap-1 mt-1 flex-wrap">
              {product.new_edition && (
                <Badge bg="info">New</Badge>
              )}
              {product.discount_30_percent && (
                <Badge bg="danger">30% off</Badge>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (product) => product.category?.name ?? "Uncategorised",
    },
    {
      key: "price",
      header: "Price",
      render: (product) =>
        product.has_variants
          ? "Varies by variant"
          : product.price != null
            ? `£${Number(product.price).toFixed(2)}`
            : "—",
    },
    {
      key: "stock",
      header: "Stock",
      render: (product) =>
        product.has_variants ? (
          <div>
            <div>{product.variants.length} variants</div>
            <small className="text-muted">
              {product.variants.reduce(
                (total, variant) => total + variant.stock,
                0,
              )}{" "}
              items total
            </small>
          </div>
        ) : (
          product.stock ?? "—"
        ),
    },
    {
      key: "actions",
      header: "Actions",
      render: () => (
        <div className="d-flex gap-2">
          <Button
            type="button"
            variant="outline-primary"
            size="sm"
            disabled
            title="Product editing is not implemented yet"
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="outline-danger"
            size="sm"
            disabled
            title="Product deletion is not implemented yet"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Container className="py-4">
      <h1>
        {stores.find((store) => store.slug === selectedStoreSlug)?.name ??
          "Store Owner"}
      </h1>

      <Tab.Container defaultActiveKey="products">
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="products">Products</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="orders">Orders</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="products">
            {storesLoading && (
              <div className="py-4">
                <Spinner size="sm" className="me-2" />
                Loading stores...
              </div>
            )}

            {storesError && (
              <Alert variant="danger">
                Failed to load your stores. Please try again.
              </Alert>
            )}

            {!storesLoading && !storesError && stores.length === 0 && (
              <Alert variant="info">
                You don't have any stores yet.
              </Alert>
            )}

            {!storesLoading && !storesError && stores.length > 0 && (
              <>
                <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
                  <div>
                    <h2 className="h5 mb-1">Manage Products</h2>
                    <p className="text-muted mb-0">
                      View the products belonging to your store.
                    </p>
                  </div>

                  <Form.Group className="store-selector">
                    <Form.Select
                      value={selectedStoreSlug}
                      onChange={(event) => selectStore(event.target.value)}
                      disabled={storesLoading || stores.length === 0}
                      className="store-selector__select"
                    >
                      {stores.map((store) => (
                        <option key={store.id} value={store.slug}>
                          {store.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>

                <DataTable
                  data={products}
                  columns={productColumns}
                  getRowKey={(product) => product.id}
                  isLoading={productsLoading}
                  hasError={productsError}
                  emptyMessage="No products found for this store."
                />
              </>
            )}
          </Tab.Pane>

          <Tab.Pane eventKey="orders">
            <h2>Orders</h2>
            <p>
              Order management will be available when Order Service is
              implemented.
            </p>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}

export default StoreOwnerPage;
