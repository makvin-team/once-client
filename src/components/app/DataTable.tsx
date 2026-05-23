import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  width?: string;
  align?: "left" | "right" | "center";
};

type DataTableProps<T> = {
  columns: ReadonlyArray<Column<T>>;
  rows: ReadonlyArray<T>;
  getRowId: (row: T) => string;
  emptyLabel?: string;
  onRowClick?: (row: T) => void;
  className?: string;
};

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  emptyLabel = "No data",
  onRowClick,
  className,
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-hairline-soft bg-canvas overflow-x-auto",
        className,
      )}
    >
      <table className="w-full border-collapse text-body-sm">
        <thead>
          <tr className="bg-surface-soft border-b border-hairline-soft">
            {columns.map((c) => (
              <th
                key={c.key}
                style={c.width ? { width: c.width } : undefined}
                className={cn(
                  "px-md py-sm text-micro-uppercase uppercase text-stone text-left font-medium",
                  c.align === "right" && "text-right",
                  c.align === "center" && "text-center",
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-md py-section text-center text-body-md text-stone"
              >
                {emptyLabel}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={getRowId(row)}
                className={cn(
                  "border-b border-hairline-soft last:border-b-0",
                  onRowClick && "cursor-pointer hover:bg-surface-soft",
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn(
                      "px-md py-sm text-ink",
                      c.align === "right" && "text-right",
                      c.align === "center" && "text-center",
                    )}
                  >
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
