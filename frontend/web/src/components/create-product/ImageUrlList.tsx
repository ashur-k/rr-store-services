import { Button, Form } from "react-bootstrap";

type ImageUrlListProps = {
  imageUrls: string[];
  onChange: (imageUrls: string[]) => void;
  label: string;
};

export function ImageUrlList({
  imageUrls,
  onChange,
  label,
}: ImageUrlListProps) {
  const updateImage = (index: number, value: string) => {
    onChange(imageUrls.map((url, i) => (i === index ? value : url)));
  };

  const removeImage = (index: number) => {
    onChange(imageUrls.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-4">
      <h2 className="h5 mb-3">{label}</h2>

      {imageUrls.map((imageUrl, index) => (
        <div className="d-flex gap-2 mb-2" key={index}>
          <Form.Control
            type="url"
            placeholder="https://example.com/image.jpg"
            aria-label={`${label} URL ${index + 1}`}
            value={imageUrl}
            onChange={(event) => updateImage(index, event.target.value)}
          />

          {imageUrls.length > 1 && (
            <Button
              type="button"
              variant="outline-danger"
              onClick={() => removeImage(index)}
            >
              Remove
            </Button>
          )}
        </div>
      ))}

      <Button
        type="button"
        variant="outline-secondary"
        onClick={() => onChange([...imageUrls, ""])}
      >
        Add Image URL
      </Button>
    </div>
  );
}
