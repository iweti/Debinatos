import type { ReactNode } from "react";

type StatsCardProps = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  hint: ReactNode;
};

export function StatsCard({ icon, label, value, hint }: StatsCardProps) {
  return (
    <article className="panel">
      <span className="stat-icon">{icon}</span>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </article>
  );
}
