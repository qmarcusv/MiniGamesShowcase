import React from "react";
import type { ButtonHTMLAttributes } from "react";
import styles from "./button.module.scss"; // SCSS module import

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

const base =
  "inline-flex items-center justify-center rounded-md text-sm p-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  default: "bg-blue-500 text-white hover:bg-blue-600",
  outline: "border border-gray-300 text-gray-800 hover:bg-gray-100",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-800",
};

export const Button: React.FC<ButtonProps> = ({ variant = "default", className = "", children, ...props }) => {
  return (
    <button className={`${base} ${variants[variant]} ${styles.customButton} ${className}`} {...props}>
      {children}
    </button>
  );
};
