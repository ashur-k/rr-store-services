import { Button, Form } from "react-bootstrap";

import { SelectField } from "../forms/SelectField";
import { ImageUrlList } from "./ImageUrlList";
import "./ProductVariantCard.css";

export type VariantForm = {
  sku: string;
  price: string;
  stock: string;
  colorId: string;
  size: string;
  imageUrls: string[];
  attributes?: Record<string, unknown>;
};

type ColorOption = {
  id: string;
  name: string;
  hex_code: string;
};

type SelectOption = {
  value: string;
  label: string;
};

type ProductVariantCardProps = {
  variant: VariantForm;
  index: number;
  totalVariants: number;
  colors: ColorOption[];
  isLoadingColors: boolean;
  colorsError: boolean;
  sizeOptions: SelectOption[];
  isExpanded: boolean;
  onToggle: () => void;
  onChange: (changes: Partial<VariantForm>) => void;
  onRemove: () => void;
};

export function ProductVariantCard({
  variant,
  index,
  totalVariants,
  colors,
  isLoadingColors,
  colorsError,
  sizeOptions,
  isExpanded,
  onToggle,
  onChange,
  onRemove,
}: ProductVariantCardProps) {
  const selectedColor = colors.find((color) => color.id === variant.colorId);

  const variantTitle = [
    variant.sku.trim() || `Variant ${index + 1}`,
    selectedColor?.name,
    variant.size || undefined,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="product-variant-accordion border rounded mb-3">
      <button
        type="button"
        className="btn w-100 d-flex justify-content-between align-items-center text-start p-3"
        aria-expanded={isExpanded}
        onClick={onToggle}
      >
        <span>
          <span className="fw-semibold">{variantTitle}</span>
          <span className="d-block small text-body-secondary mt-1">
            {isExpanded
              ? "Click to collapse this variant"
              : `Price: ${variant.price || "—"} · Stock: ${variant.stock || "0"}`}
          </span>
        </span>

        <span aria-hidden="true" className="ms-3">
          {isExpanded ? "▲" : "▼"}
        </span>
      </button>

      {isExpanded && (
        <div className="p-3 border-top">
          <Form.Group className="mb-3">
            <Form.Label>SKU</Form.Label>
            <Form.Control
              value={variant.sku}
              onChange={(event) => onChange({ sku: event.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Colour</Form.Label>
            <SelectField
              value={variant.colorId}
              onChange={(value) => onChange({ colorId: value })}
              disabled={isLoadingColors || colorsError}
              required
              options={[
                { value: "", label: "Select a colour" },
                ...colors.map((color) => ({
                  value: color.id,
                  label: color.name,
                })),
              ]}
            />

            {selectedColor && (
              <div className="d-flex align-items-center gap-2 mt-2">
                <span
                  aria-label="Selected colour"
                  className="border rounded-circle"
                  style={{
                    display: "inline-block",
                    width: 24,
                    height: 24,
                    backgroundColor: selectedColor.hex_code,
                  }}
                />
                <span>{selectedColor.name}</span>
              </div>
            )}

            {colorsError && (
              <Form.Text className="text-danger">
                Could not load colours. Please refresh and try again.
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Size</Form.Label>
            <SelectField
              value={variant.size}
              onChange={(value) => onChange({ size: value })}
              options={sizeOptions}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              min="0"
              step="0.01"
              value={variant.price}
              onChange={(event) => onChange({ price: event.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              min="0"
              step="1"
              value={variant.stock}
              onChange={(event) => onChange({ stock: event.target.value })}
              required
            />
          </Form.Group>

          <ImageUrlList
            label="Variant Image URLs"
            imageUrls={variant.imageUrls}
            onChange={(imageUrls) => onChange({ imageUrls })}
          />

          {totalVariants > 1 && (
            <Button type="button" variant="danger" onClick={onRemove}>
              Remove Variant
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
