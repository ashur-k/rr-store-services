import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "danger" | "secondary" | "success";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export default function Button({variant = "primary", className = "", children, ...props}: ButtonProps)
    {return (<button {...props} className={`btn btn-${variant} ${className}`.trim()}>{children}</button>);}