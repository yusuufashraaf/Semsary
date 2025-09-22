/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { cn } from "@utils/classNames";
import { getStatusVariant } from "@utils/statusHelpers";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  status?: string;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size = "md", status, children, ...props }, ref) => {
    // If status is provided, get variant from status
    const badgeVariant = status
      ? getStatusVariant(status as any)
      : variant || "secondary";

    const baseClasses = "badge";
    const variantClasses = {
      primary: "badge-primary",
      secondary: "badge-secondary",
      success: "badge-success",
      warning: "badge-warning",
      danger: "badge-danger",
    };

    const sizeClasses = {
      sm: "text-xs px-2 py-0.5",
      md: "text-xs px-2.5 py-0.5",
      lg: "text-sm px-3 py-1",
    };

    return (
      <span
        className={cn(
          baseClasses,
          variantClasses[badgeVariant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
