import { Form } from "react-bootstrap";
import "./SelectField.css";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  groupClassName?: string;
  name?: string;
  required?: boolean;
}

export function SelectField({
  value,
  options,
  onChange,
  disabled = false,
  className = "select-field__select",
  groupClassName,
  name,
  required = false,
}: SelectFieldProps) {
  return (
    <Form.Group className={groupClassName}>
      <Form.Select
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className={className}
        required={required}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
}
