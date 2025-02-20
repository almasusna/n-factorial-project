import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { fetchTransactions } from "../util/apis";
import { FilterInput } from "../components/FilterInput";
import "../index.css";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

type Spending = {
  amount: number;
  type: string;
  category: string;
  description: string;
  date: string;
  id: string;
  user_id: string;
};

const columnHelper = createColumnHelper<Spending>();

const columns = (
  sorting: { sort_by: string; sort_order: string },
  setSorting: React.Dispatch<
    React.SetStateAction<{ sort_by: string; sort_order: string }>
  >
) => [
  columnHelper.accessor("amount", {
    header: () => (
      <button
        className="underline cursor-pointer"
        onClick={() =>
          setSorting((prev: { sort_by: string; sort_order: string }) => ({
            sort_by: "amount",
            sort_order:
              prev.sort_by === "amount" && prev.sort_order === "asc"
                ? "desc"
                : "asc",
          }))
        }
      >
        AMOUNT
      </button>
    ),
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("type", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("category", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("description", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("date", {
    header: () => (
      <button
        className="underline cursor-pointer"
        onClick={() =>
          setSorting((prev) => ({
            sort_by: "date",
            sort_order:
              prev.sort_by === "date" && prev.sort_order === "asc"
                ? "desc"
                : "asc",
          }))
        }
      >
        DATE
      </button>
    ),
    cell: (info) =>
      new Date(info.getValue())
        .toLocaleDateString("ru-KZ", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false, // 24-hour format
        })
        .replace(",", ""),
    footer: (info) => info.column.id,
    enableSorting: true,
  }),
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("user_id", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
];

export const Route = createFileRoute("/transactions")({
  loader: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const [sorting, setSorting] = useState({
    sort_by: "date",
    sort_order: "asc",
  });

  const queryKey = useMemo(() => ["transactionData", sorting], [sorting]);
  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => fetchTransactions(queryKey[1]),
    staleTime: 1000 * 60,
  });

  const table = useReactTable({
    data: data?.data || [],
    columns: columns(sorting, setSorting),
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(data);

  return (
    <QueryClientProvider client={queryClient}>
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Transactions
      </h1>
      <FilterInput />
      <div className="p-2">
        <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
          <thead className="bg-gray-200 text-gray-700 uppercase text-sm ">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 border-b border-gray-300"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="bg-white border-b border-gray-300 hover:bg-gray-100 transition"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
    </QueryClientProvider>
  );
}
