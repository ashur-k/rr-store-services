import { useState, type FormEvent } from "react";
import { Alert, Container, Form, Spinner } from "react-bootstrap";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import Button from "../../components/buttons/Button";
import { SelectField } from "../../components/forms/SelectField";
import type { Product, ProductUpdate } from "../../features/product/api/types";
import {
  useCategories,
  useColors,
  useProduct,
  useUpdateProduct,
} from "../../features/product/hooks/useProducts";

import { ImageUrlList } from "../../components/create-product/ImageUrlList";
import {
  ProductVariantCard,
  type VariantForm,
} from "../../components/create-product/ProductVariantCard";

const createEmptyVariant = (): VariantForm => ({
  sku: "",
  colorId: "",
  size: "",
  price: "",
  stock: "0",
  attributes: {},
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

function imageUrls(images: Product["images"]): string[] {
  const urls = images
    .slice()
    .sort((a, b) => a.display_order - b.display_order)
    .map((image) => image.image_url);

  return urls.length ? urls : [""];
}

function initialiseVariants(product: Product): VariantForm[] {
  if (!product.variants.length) {
    return [createEmptyVariant()];
  }

  return product.variants.map((variant) => ({
    sku: variant.sku,
    colorId: variant.color?.id ?? "",
    size: String(variant.attributes.size ?? ""),
    price: String(variant.price),
    stock: String(variant.stock),
    attributes: { ...variant.attributes },
    imageUrls: imageUrls(variant.images),
  }));
}

interface EditProductFormProps {
  product: Product;
  productId: string;
  storeId: string;
}

export function EditProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const storeId = searchParams.get("storeId");

  const {
    data: product,
    isLoading: productLoading,
    isError: productError,
  } = useProduct(productId);

  if (!productId || !storeId) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          Product ID or store ID is missing. Please open Edit from your store's
          product list.
        </Alert>
        <Button type="button" onClick={() => navigate("/store-owner")}>
          Back to Store
        </Button>
      </Container>
    );
  }

  if (productLoading) {
    return (
      <Container className="py-4">
        <Spinner size="sm" className="me-2" />
        Loading product...
      </Container>
    );
  }

  if (productError || !product) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          Could not load this product. Please try again.
        </Alert>
        <Button type="button" onClick={() => navigate("/store-owner")}>
          Back to Store
        </Button>
      </Container>
    );
  }

  if (product.store_id !== storeId) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          This product does not belong to the selected store.
        </Alert>
        <Button type="button" onClick={() => navigate("/store-owner")}>
          Back to Store
        </Button>
      </Container>
    );
  }

  return (
    <EditProductForm
      key={product.id}
      product={product}
      productId={productId}
      storeId={storeId}
    />
  );
}

function EditProductForm({
  product,
  productId,
  storeId,
}: EditProductFormProps) {
  const navigate = useNavigate();

  const {
    data: colors = [],
    isLoading: colorsLoading,
    isError: colorsError,
  } = useColors();

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();

  const updateProduct = useUpdateProduct();

  // Initialize form state directly from the loaded product.
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description ?? "");
  const [categoryId, setCategoryId] = useState(product.category_id ?? "");
  const [hasVariants, setHasVariants] = useState(product.has_variants);
  const [rate, setRate] = useState(String(product.rate));
  const [newEdition, setNewEdition] = useState(product.new_edition);
  const [discount30Percent, setDiscount30Percent] = useState(
    product.discount_30_percent,
  );
  const [price, setPrice] = useState(String(product.price ?? ""));
  const [stock, setStock] = useState(String(product.stock ?? 0));
  const [images, setImages] = useState<string[]>(() =>
    imageUrls(product.images),
  );
  const [variants, setVariants] = useState<VariantForm[]>(() =>
    initialiseVariants(product),
  );

  const [expandedVariants, setExpandedVariants] = useState<number[]>([]);

  const toggleVariant = (index: number) => {
    setExpandedVariants((current) =>
      current.includes(index)
        ? current.filter((i) => i !== index)
        : [...current, index],
    );
  };

  const updateVariant = (index: number, changes: Partial<VariantForm>) => {
    setVariants((current) =>
      current.map((variant, i) =>
        i === index ? { ...variant, ...changes } : variant,
      ),
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const productData: ProductUpdate = {
      name: name.trim(),
      description: description.trim() || null,
      category_id: categoryId || null,
      has_variants: hasVariants,
      rate: Number(rate),
      new_edition: newEdition,
      discount_30_percent: discount30Percent,
      price: hasVariants ? null : Number(price),
      stock: hasVariants ? null : Number(stock),
      images: images
        .map((url) => url.trim())
        .filter(Boolean)
        .map((image_url, display_order) => ({
          image_url,
          display_order,
        })),
      variants: hasVariants
        ? variants.map((variant) => ({
            sku: variant.sku.trim(),
            color_id: variant.colorId || null,
            price: Number(variant.price),
            stock: Number(variant.stock),
            attributes: {
              ...variant.attributes,
              ...(variant.size ? { size: variant.size } : {}),
            },
            images: variant.imageUrls
              .map((url) => url.trim())
              .filter(Boolean)
              .map((image_url, display_order) => ({
                image_url,
                display_order,
              })),
          }))
        : [],
    };

    try {
      await updateProduct.mutateAsync({
        storeId,
        productId,
        productData,
      });

      navigate("/store-owner");
    } catch {
      // Display the mutation error below.
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h1 className="h3 mb-0">Edit Product</h1>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/store-owner")}
        >
          Cancel
        </Button>
      </div>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="editProductName">
          <Form.Label>Product name</Form.Label>
          <Form.Control
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={255}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="editProductDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="editProductCategory">
          <Form.Label>Category</Form.Label>
          <SelectField
            value={categoryId}
            onChange={setCategoryId}
            disabled={categoriesLoading || categoriesError}
            options={[
              { value: "", label: "No category" },
              ...categories.map((category) => ({
                value: category.id,
                label: category.name,
              })),
            ]}
          />
          {categoriesError && (
            <Form.Text className="text-danger">
              Could not load categories. Refresh and try again.
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="editProductType">
          <Form.Label>Product type</Form.Label>
          <SelectField
            value={hasVariants ? "variants" : "simple"}
            onChange={(value) => setHasVariants(value === "variants")}
            options={[
              { value: "simple", label: "Simple product" },
              { value: "variants", label: "Product with variants" },
            ]}
          />
          {hasVariants !== product.has_variants && (
            <Form.Text className="text-warning">
              Changing the product type changes how its price, stock and
              variants are saved. Review these fields carefully.
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="editProductRate">
          <Form.Label>Rate</Form.Label>
          <Form.Control
            type="number"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
            required
          />
        </Form.Group>

        <Form.Check
          className="mb-2"
          type="checkbox"
          id="editNewEdition"
          label="New edition"
          checked={newEdition}
          onChange={(event) => setNewEdition(event.target.checked)}
        />

        <Form.Check
          className="mb-4"
          type="checkbox"
          id="editDiscount"
          label="30% discount"
          checked={discount30Percent}
          onChange={(event) => setDiscount30Percent(event.target.checked)}
        />

        {!hasVariants && (
          <>
            <Form.Group className="mb-3" controlId="editProductPrice">
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

            <Form.Group className="mb-4" controlId="editProductStock">
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
        )}

        <ImageUrlList
          label="Product Images"
          imageUrls={images}
          onChange={setImages}
        />

        {hasVariants && (
          <section className="mb-4">
            <h2 className="h5 mb-3">Product Variants</h2>

            {variants.map((variant, index) => (
              <ProductVariantCard
                key={index}
                variant={variant}
                index={index}
                totalVariants={variants.length}
                colors={colors}
                isLoadingColors={colorsLoading}
                colorsError={colorsError}
                sizeOptions={sizeOptions}
                isExpanded={expandedVariants.includes(index)}
                onToggle={() => toggleVariant(index)}
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
              variant="secondary"
              onClick={() => {
                const newIndex = variants.length;
                setVariants((current) => [...current, createEmptyVariant()]);
                setExpandedVariants((current) => [...current, newIndex]);
              }}
            >
              Add Another Variant
            </Button>

            {colorsError && (
              <Alert variant="danger" className="mt-3">
                Could not load colours. Refresh and try again before editing
                variants.
              </Alert>
            )}
          </section>
        )}

        {updateProduct.isError && (
          <Alert variant="danger" className="mt-3">
            Could not update the product. Check the details and try again.
          </Alert>
        )}

        <div className="d-flex gap-2 mt-4">
          <Button
            type="submit"
            disabled={
              updateProduct.isPending ||
              (hasVariants && (colorsLoading || colorsError))
            }
          >
            {updateProduct.isPending ? (
              <>
                <Spinner size="sm" className="me-2" />
                Saving Changes...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>

          <Button
            type="button"
            variant="secondary"
            disabled={updateProduct.isPending}
            onClick={() => navigate("/store-owner")}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
}
