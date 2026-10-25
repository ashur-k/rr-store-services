import { useState } from "react";
import { useParams } from "react-router-dom";

import { useProduct } from "../../features/product/hooks/useProducts";

function getAttributeType(name: string) {
  const key = name.toLowerCase();

  if (key.includes("colour") || key.includes("color")) {
    return "colour";
  }

  if (key.includes("size")) {
    return "size";
  }

  return "other";
}

export function ProductDetailPage() {
  const { productId } = useParams();
  const { data: product, isLoading, isError } = useProduct(productId);

  const [variantSelection, setVariantSelection] = useState({
    productId: "",
    variantId: "",
  });

  const selectedVariantId =
    variantSelection.productId === productId ? variantSelection.variantId : "";

  if (isLoading) {
    return <main className="container py-4">Loading product...</main>;
  }

  if (isError) {
    return (
      <main className="container py-4 text-danger">
        Failed to load product. Please try again.
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container py-4">
        <h1 className="h3">Product not found</h1>
        <p>This product may no longer be available.</p>
      </main>
    );
  }

  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) ??
    product.variants[0];

  const images = (
    selectedVariant?.images.length ? selectedVariant.images : product.images
  )
    .slice()
    .sort((a, b) => a.display_order - b.display_order);

  const price = product.has_variants ? selectedVariant?.price : product.price;
  const stock = product.has_variants ? selectedVariant?.stock : product.stock;

  const attributeNames = [
    ...new Set([
      ...product.variants.flatMap((variant) =>
        Object.keys(variant.attributes).filter(
          (name) => getAttributeType(name) !== "colour",
        ),
      ),
      ...(product.variants.some((variant) => variant.color) ? ["color"] : []),
    ]),
  ];

  const getVariantAttributeValue = (
    variant: (typeof product.variants)[number],
    attributeName: string,
  ) =>
    attributeName.toLowerCase() === "color" ||
    attributeName.toLowerCase() === "colour"
      ? variant.color?.name
      : variant.attributes[attributeName];

  return (
    <main className="container py-4 py-md-5">
      <div className="row g-4 g-lg-5">
        <section className="col-12 col-md-6" aria-label="Product images">
          {images.length > 0 ? (
            <div className="row g-3">
              {images.map((image) => (
                <div className="col-12 col-sm-6" key={image.id}>
                  <img
                    src={image.image_url}
                    alt={product.name}
                    className="img-fluid w-100 rounded"
                    style={{ aspectRatio: "3 / 4", objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="bg-light d-flex align-items-center justify-content-center rounded"
              style={{ minHeight: "300px" }}
            >
              <span className="text-secondary">No images available</span>
            </div>
          )}
        </section>

        <section className="col-12 col-md-6">
          {product.category && (
            <p className="text-secondary mb-2">{product.category.name}</p>
          )}

          <h1 className="display-6 fw-bold">{product.name}</h1>

          <p className="fs-4 fw-semibold">
            {price !== null && price !== undefined
              ? `£${Number(price).toFixed(2)}`
              : "Price unavailable"}
          </p>

          <p className="text-secondary">
            {product.description || "No description available."}
          </p>

          {product.has_variants && selectedVariant && (
            <div className="mb-4">
              {attributeNames.map((attributeName) => {
                const attributeType = getAttributeType(attributeName);

                const selectedValue = String(
                  getVariantAttributeValue(selectedVariant, attributeName) ??
                    "",
                );

                // Show every value that has at least one in-stock variant.
                // Do not restrict colours by the selected size or vice versa.
                const options = [
                  ...new Set(
                    product.variants
                      .filter((variant) => variant.stock > 0)
                      .map((variant) =>
                        getVariantAttributeValue(variant, attributeName),
                      )
                      .filter((value) => value !== null && value !== undefined)
                      .map(String),
                  ),
                ];

                return (
                  <div className="mb-4" key={attributeName}>
                    <p className="fw-semibold mb-2">
                      {attributeName}:{" "}
                      <span className="fw-normal">{selectedValue}</span>
                    </p>

                    <div className="d-flex flex-wrap gap-2">
                      {options.map((value) => {
                        const isSelected = value === selectedValue;

                        // Prefer a variant matching the selected value and
                        // all other current attributes. If none exists,
                        // allow switching to a variant with this value.
                        const matchingVariant =
                          product.variants.find(
                            (variant) =>
                              variant.stock > 0 &&
                              String(
                                getVariantAttributeValue(
                                  variant,
                                  attributeName,
                                ) ?? "",
                              ) === value &&
                              attributeNames.every(
                                (otherAttributeName) =>
                                  otherAttributeName === attributeName ||
                                  String(
                                    getVariantAttributeValue(
                                      variant,
                                      otherAttributeName,
                                    ) ?? "",
                                  ) ===
                                    String(
                                      getVariantAttributeValue(
                                        selectedVariant,
                                        otherAttributeName,
                                      ) ?? "",
                                    ),
                              ),
                          ) ??
                          product.variants.find(
                            (variant) =>
                              variant.stock > 0 &&
                              String(
                                getVariantAttributeValue(
                                  variant,
                                  attributeName,
                                ) ?? "",
                              ) === value,
                          );

                        return (
                          <button
                            key={value}
                            type="button"
                            aria-pressed={isSelected}
                            aria-label={`${attributeName}: ${value}`}
                            title={value}
                            disabled={!matchingVariant}
                            onClick={() => {
                              if (matchingVariant) {
                                setVariantSelection({
                                  productId: productId ?? "",
                                  variantId: matchingVariant.id,
                                });
                              }
                            }}
                            className={
                              attributeType === "colour"
                                ? `rounded-circle p-1 border ${
                                    isSelected
                                      ? "border-dark border-3"
                                      : "border-secondary"
                                  }`
                                : `btn rounded-0 ${
                                    isSelected ? "btn-dark" : "btn-outline-dark"
                                  }`
                            }
                            style={
                              attributeType === "colour"
                                ? {
                                    width: "42px",
                                    height: "42px",
                                    opacity: matchingVariant ? 1 : 0.5,
                                  }
                                : undefined
                            }
                          >
                            {attributeType === "colour" ? (
                              <span
                                className="d-block rounded-circle border"
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  backgroundColor:
                                    product.variants.find(
                                      (variant) =>
                                        variant.color?.name === value,
                                    )?.color?.hex_code ?? "#cccccc",
                                }}
                              />
                            ) : (
                              value
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p>
            <span className="fw-semibold">Availability: </span>
            {stock !== null && stock !== undefined
              ? stock > 0
                ? `${stock} in stock`
                : "Out of stock"
              : "Unavailable"}
          </p>
        </section>
      </div>
    </main>
  );
}
