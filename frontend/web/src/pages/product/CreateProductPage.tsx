import { useState } from "react";
import { Alert, Button, Container, Form, Spinner } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";

import { ImageUrlList } from "../../components/create-product/ImageUrlList";
import {
  ProductVariantCard,
  type VariantForm,
} from "../../components/create-product/ProductVariantCard";
import { SelectField } from "../../components/forms/SelectField";
import type { ProductCreate } from "../../features/product/api/types";
import {
  useCategories,
  useColors,
  useCreateProduct,
} from "../../features/product/hooks/useProducts";

const createEmptyVariant = (): VariantForm => ({
  sku: "",
  price: "",
  stock: "0",
  colorId: "",
  size: "",
  imageUrls: [""],
});

const sizeOptions = [
  { value: "", label: "Select a size" },
  { value: "XS", label: "Extra Small (XS)" },
  { value: "S", label: "Small (S)" },
  { value: "M", label: "Medium (M)" },
  { value: "L", label: "Large (L)" },
  { value: "XL", label: "Extra Large (XL)" },
  { value: "XXL", label: "XXL" },
  { value: "One Size", label: "One Size" },
];

export function CreateProductPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const storeId = searchParams.get("storeId");

  const createProduct = useCreateProduct();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [hasVariants, setHasVariants] = useState(false);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [images, setImages] = useState<string[]>([""]);
  const [variants, setVariants] = useState<VariantForm[]>([
    createEmptyVariant(),
  ]);

  // Track expanded variants independently. Open the first variant by default.
  const [expandedVariants, setExpandedVariants] = useState<number[]>([0]);

  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    isError: categoriesError,
  } = useCategories();

  const {
    data: colors = [],
    isLoading: isLoadingColors,
    isError: colorsError,
  } = useColors();

  const updateVariant = (index: number, changes: Partial<VariantForm>) => {
    setVariants((current) =>
      current.map((variant, i) =>
        i === index ? { ...variant, ...changes } : variant,
      ),
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!storeId || !categoryId) {
      return;
    }

    const productData: ProductCreate = {
      store_id: storeId,
      category_id: categoryId,
      name: name.trim(),
      description: description.trim() || null,
      has_variants: hasVariants,
      images: images
        .map((url) => url.trim())
        .filter(Boolean)
        .map((image_url, display_order) => ({
          image_url,
          display_order,
        })),
      ...(hasVariants
        ? {
            variants: variants.map((variant) => ({
              sku: variant.sku.trim(),
              color_id: variant.colorId,
              price: Number(variant.price),
              stock: Number(variant.stock),
              attributes: { size: variant.size },
              images: variant.imageUrls
                .map((url) => url.trim())
                .filter(Boolean)
                .map((image_url, display_order) => ({
                  image_url,
                  display_order,
                })),
            })),
          }
        : {
            price: Number(price),
            stock: Number(stock),
          }),
    };

    try {
      await createProduct.mutateAsync({ storeId, productData });
      navigate("/store-owner");
    } catch {
      // The mutation error will be displayed in the form.
    }
  };

  return (
    <Container className="py-4">
      <h1 className="h3 mb-4">Create Product</h1>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="productName">
          <Form.Label>Product name</Form.Label>
          <Form.Control
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={255}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="productDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="productCategory">
          <Form.Label>Category</Form.Label>
          <SelectField
            value={categoryId}
            onChange={setCategoryId}
            disabled={isLoadingCategories || categoriesError}
            required
            options={[
              { value: "", label: "Select a category" },
              ...categories.map((category) => ({
                value: category.id,
                label: category.name,
              })),
            ]}
          />

          {isLoadingCategories && <Form.Text>Loading categories...</Form.Text>}

          {categoriesError && (
            <Form.Text className="text-danger">
              Could not load categories. Please refresh and try again.
            </Form.Text>
          )}

          {!isLoadingCategories &&
            !categoriesError &&
            categories.length === 0 && (
              <Form.Text className="text-danger">
                No categories are available. Please create a category first.
              </Form.Text>
            )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Product type</Form.Label>
          <SelectField
            value={hasVariants ? "variants" : "simple"}
            onChange={(value) => setHasVariants(value === "variants")}
            options={[
              { value: "simple", label: "Simple product" },
              { value: "variants", label: "Product with variants" },
            ]}
          />
        </Form.Group>

        <ImageUrlList
          label="Product Images"
          imageUrls={images}
          onChange={setImages}
        />

        {!hasVariants ? (
          <>
            <Form.Group className="mb-3" controlId="productPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="productStock">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                required
              />
            </Form.Group>
          </>
        ) : (
          <div className="mb-4">
            <h2 className="h5 mb-3">Product Variants</h2>

            {variants.map((variant, index) => (
              <ProductVariantCard
                key={index}
                variant={variant}
                index={index}
                totalVariants={variants.length}
                colors={colors}
                isLoadingColors={isLoadingColors}
                colorsError={colorsError}
                sizeOptions={sizeOptions}
                isExpanded={expandedVariants.includes(index)}
                onToggle={() =>
                  setExpandedVariants((current) =>
                    current.includes(index)
                      ? current.filter((i) => i !== index)
                      : [...current, index],
                  )
                }
                onChange={(changes) => updateVariant(index, changes)}
                onRemove={() => {
                  setVariants((current) =>
                    current.filter((_, i) => i !== index),
                  );
                  setExpandedVariants((current) =>
                    current
                      .filter((i) => i !== index)
                      .map((i) => (i > index ? i - 1 : i)),
                  );
                }}
              />
            ))}

            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => {
                const newIndex = variants.length;
                setVariants((current) => [...current, createEmptyVariant()]);
                setExpandedVariants((current) => [...current, newIndex]);
              }}
            >
              Add Another Variant
            </Button>
          </div>
        )}

        <div className="mt-3">
          {!storeId && (
            <Alert variant="danger">
              Store ID is missing. Please open this page from your store.
            </Alert>
          )}

          {createProduct.isError && (
            <Alert variant="danger">
              Could not create the product. Please check your details and try
              again.
            </Alert>
          )}

          <Button
            type="submit"
            disabled={
              !storeId ||
              !categoryId ||
              isLoadingCategories ||
              categoriesError ||
              categories.length === 0 ||
              createProduct.isPending
            }
          >
            {createProduct.isPending ? (
              <>
                <Spinner size="sm" className="me-2" />
                Creating Product...
              </>
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </Form>
    </Container>
  );
}
