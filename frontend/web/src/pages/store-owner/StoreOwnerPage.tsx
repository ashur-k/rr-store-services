import {
  Alert,
  Badge,
  Container,
  Image,
  Nav,
  Spinner,
  Tab,
} from "react-bootstrap";

import Button from "../../components/buttons/Button";
import "./StoreOwnerPage.css";

import { useNavigate } from "react-router-dom";
import { SelectField } from "../../components/forms/SelectField";
import type { DataTableColumn } from "../../components/tables/DataTable";
import { DataTable } from "../../components/tables/DataTable";
import type { Product } from "../../features/product/api/types";
import {
  useDeleteProduct,
  useProductsByStore,
} from "../../features/product/hooks/useProducts";
import { useOwnerStores } from "../../features/store/hooks/useOwnerStores";

function StoreOwnerPage() {
  const navigate = useNavigate();
  const deleteProductMutation = useDeleteProduct();
  const {
    data: stores = [],
    isLoading: storesLoading,
    isError: storesError,
    selectedStoreId,
    selectStore,
  } = useOwnerStores();

  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useProductsByStore(selectedStoreId);

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
              <small className="text-muted">{product.description}</small>
            )}
            <div className="d-flex gap-1 mt-1 flex-wrap">
              {product.new_edition && <Badge bg="info">New</Badge>}
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
          (product.stock ?? "—")
        ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (product) => (
        <div className="d-flex gap-2">
          <Button
            type="button"
            variant="secondary"
            className="btn-sm"
            onClick={() =>
              navigate(
                `/store-owner/products/${encodeURIComponent(product.id)}/edit?storeId=${encodeURIComponent(selectedStoreId)}`,
              )
            }
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="danger"
            className="btn-sm"
            disabled={deleteProductMutation.isPending}
            onClick={() => {
              const confirmed = window.confirm(
                `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
              );

              if (confirmed) {
                deleteProductMutation.mutate({
                  storeId: selectedStoreId,
                  productId: product.id,
                });
              }
            }}
          >
            {deleteProductMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Container className="py-4">
      <h1>
        {stores.find((store) => store.slug === selectedStoreId)?.name ??
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
              <Alert variant="info">You don't have any stores yet.</Alert>
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

                  <div className="d-flex align-items-center gap-3">
                    <Button
                      type="button"
                      className="create-product-button"
                      onClick={() =>
                        navigate(
                          `/store-owner/products/create?storeId=${encodeURIComponent(selectedStoreId)}`,
                        )
                      }
                    >
                      <i className="fas fa-plus me-2" />
                      Create Product
                    </Button>
                    <SelectField
                      value={selectedStoreId}
                      onChange={selectStore}
                      disabled={storesLoading || stores.length === 0}
                      groupClassName="store-selector mb-0"
                      className="store-selector__select"
                      options={stores.map((store) => ({
                        value: store.id,
                        label: store.name,
                      }))}
                    />
                  </div>
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
