import { useState } from "react";
import { Link } from "react-router-dom";

import {
  useCategories,
  useProducts,
} from "../features/product/hooks/useProducts";

export function HomePage() {
  const { data: products, isLoading, error } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState("all");

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products?.filter(
          (product) => product.category?.slug === selectedCategory,
        );

  return (
    <main className="container py-4 py-md-5">
      <section className="mb-4 mb-md-5">
        <h1 className="display-5 fw-bold">Discover your next favourite</h1>
        <p className="lead text-secondary">
          Browse our collection of everyday essentials.
        </p>
      </section>

      <nav
        aria-label="Product categories"
        className="d-flex flex-wrap justify-content-end gap-2 mb-4"
      >
        <button
          type="button"
          className={`btn rounded-0 ${
            selectedCategory === "all" ? "btn-dark" : "btn-outline-dark"
          }`}
          aria-pressed={selectedCategory === "all"}
          onClick={() => setSelectedCategory("all")}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`btn rounded-0 ${
              selectedCategory === category.slug
                ? "btn-dark"
                : "btn-outline-dark"
            }`}
            aria-pressed={selectedCategory === category.slug}
            onClick={() => setSelectedCategory(category.slug)}
          >
            {category.name}
          </button>
        ))}
      </nav>

      {categoriesLoading && (
        <p className="text-secondary small">Loading categories...</p>
      )}

      {categoriesError && (
        <p className="text-danger small">Failed to load categories.</p>
      )}

      <section aria-label="Product catalogue">
        <h2 className="h3 mb-4">Shop products</h2>

        {isLoading && <p>Loading products...</p>}

        {error && (
          <p className="text-danger">
            Failed to load products. Please try again later.
          </p>
        )}

        {!isLoading && !error && filteredProducts?.length === 0 && (
          <p>
            {selectedCategory === "all"
              ? "No products available yet."
              : "No products in this category."}
          </p>
        )}

        {!isLoading && !error && (
          <div className="row g-4">
            {filteredProducts?.map((product) => {
              const prices = product.has_variants
                ? product.variants.map((variant) => Number(variant.price))
                : product.price !== null
                  ? [Number(product.price)]
                  : [];

              const validPrices = prices.filter(Number.isFinite);
              const startingPrice =
                validPrices.length > 0 ? Math.min(...validPrices) : null;

              const image = [...product.images].sort(
                (a, b) => a.display_order - b.display_order,
              )[0]?.image_url;

              return (
                <div key={product.id} className="col-12 col-sm-6 col-lg-3">
                  <Link
                    to={`/products/${product.id}`}
                    className="card h-100 border-0 shadow-sm text-decoration-none text-reset"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                        className="card-img-top"
                        style={{
                          height: "260px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        className="bg-light d-flex align-items-center justify-content-center"
                        style={{ height: "260px" }}
                      >
                        <span className="text-secondary">
                          No image available
                        </span>
                      </div>
                    )}

                    <div className="card-body d-flex flex-column">
                      <h3 className="h5 card-title">{product.name}</h3>

                      <p className="card-text text-secondary">
                        {product.description || "Discover this product."}
                      </p>

                      <div className="mt-auto pt-2">
                        <p className="fs-5 fw-bold mb-0">
                          {startingPrice !== null
                            ? `From £${startingPrice.toFixed(2)}`
                            : "Price unavailable"}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
