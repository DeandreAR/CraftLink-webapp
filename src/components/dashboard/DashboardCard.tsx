import type { ReactNode } from "react";

type DashboardCardVariant = "gradient" | "flat";

type DashboardCardProps = {
  children: ReactNode;
  className?: string;
  variant?: DashboardCardVariant;
  as?: "div" | "article" | "section";
};

export function DashboardCard({
  children,
  className = "",
  variant = "gradient",
  as: Tag = "div",
}: DashboardCardProps) {
  const surface = variant === "flat" ? "db-card-flat" : "db-card";
  return <Tag className={`${surface} ${className}`.trim()}>{children}</Tag>;
}
