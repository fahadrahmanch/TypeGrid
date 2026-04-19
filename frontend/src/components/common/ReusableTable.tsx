import React from "react";

export interface Column<T> {
  header: React.ReactNode;
  key: string;
  className?: string;
  headerClassName?: string;
  render?: (item: T) => React.ReactNode;
}

interface ReusableTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  rowClassName?: string;
}

const ReusableTable = <T extends { _id?: string; id?: string }>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No data found",
  rowClassName = "",
}: ReusableTableProps<T>) => {
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full">
        <thead>
          <tr className="text-left font-black text-[10px] uppercase tracking-widest text-gray-400">
            {columns.map((col) => (
              <th key={col.key} className={`pb-4 px-4 ${col.headerClassName || ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="py-20 text-center">
                <div className="flex flex-col items-center gap-3 opacity-20">
                  <p className="font-black uppercase tracking-[0.2em] text-sm animate-pulse">Loading...</p>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-20 text-center">
                <div className="flex flex-col items-center gap-3 opacity-20">
                  <p className="font-black uppercase tracking-[0.2em] text-sm">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item._id || item.id}
                className={`group hover:bg-white/40 transition-all duration-300 ${rowClassName}`}
              >
                {columns.map((col) => (
                  <td key={`${item._id || item.id}-${col.key}`} className={`py-5 px-4 ${col.className || ""}`}>
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReusableTable;
