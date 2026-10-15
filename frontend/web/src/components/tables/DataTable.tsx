
import type { ReactNode } from "react";
import { Table } from "react-bootstrap";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowKey: (item: T) => string;
  isLoading?: boolean;
  hasError?: boolean;
  emptyMessage?: string;
}

export function DataTable<T,>({
  data,
  columns,
  getRowKey,
  isLoading = false,
  hasError = false,
  emptyMessage = "No records found.",
}: DataTableProps<T>) {
  if (isLoading) {
    return <p className="text-muted">Loading...</p>;
  }

  if (hasError) {
    return (
      <p className="text-danger">
        Failed to load data. Please try again.
      </p>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center border rounded-3 p-5">
        <p className="text-muted mb-0">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="border rounded-3 shadow-sm overflow-hidden">
      <Table responsive hover className="mb-0 align-middle">
        <thead className="table-light">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={getRowKey(item)}>
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3">
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
