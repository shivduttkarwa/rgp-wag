import type { ButtonHTMLAttributes, CSSProperties } from "react";
import "./BtnSecondary.css";

interface BtnSecondaryProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  width?: string | number;
  height?: string | number;
  color?: string;
  className?: string;
}

export default function BtnSecondary({
  label,
  width,
  height,
  color = "#f5c45e",
  className = "",
  ...rest
}: BtnSecondaryProps) {
  const buttonStyle: CSSProperties = {
    width: width ? (typeof width === "number" ? `${width}px` : width) : "auto",
    height: height
      ? typeof height === "number"
        ? `${height}px`
        : height
      : "auto",
    // @ts-ignore - CSS custom properties
    "--btn-secondary-color": color,
  };

  return (
    <button
      className={`btn-secondary ${className}`}
      style={buttonStyle}
      {...rest}
    >
      <span className="bs-text">{label}</span>
    </button>
  );
}
