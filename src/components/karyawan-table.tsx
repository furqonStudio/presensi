"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Filter,
  MoreHorizontal,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";

const data: Karyawan[] = [
  { id: "k1", name: "John Doe", jabatan: "Manager", kontak: "08123456789" },
  { id: "k2", name: "Jane Smith", jabatan: "Developer", kontak: "08234567890" },
  {
    id: "k3",
    name: "Samuel Green",
    jabatan: "Designer",
    kontak: "08345678901",
  },
  { id: "k4", name: "Maria White", jabatan: "HR", kontak: "08456789012" },
  { id: "k5", name: "Peter Brown", jabatan: "Support", kontak: "08567890123" },
  {
    id: "k6",
    name: "Michael Johnson",
    jabatan: "Project Manager",
    kontak: "08678901234",
  },
  {
    id: "k7",
    name: "Emily Davis",
    jabatan: "Developer",
    kontak: "08789012345",
  },
  { id: "k8", name: "David Clark", jabatan: "Designer", kontak: "08890123456" },
  { id: "k9", name: "Sophia Lee", jabatan: "HR", kontak: "08901234567" },
  { id: "k10", name: "James White", jabatan: "Support", kontak: "09012345678" },
  {
    id: "k11",
    name: "Olivia Harris",
    jabatan: "Marketing",
    kontak: "09123456789",
  },
  {
    id: "k12",
    name: "William Martinez",
    jabatan: "Developer",
    kontak: "09234567890",
  },
  {
    id: "k13",
    name: "Isabella Robinson",
    jabatan: "Manager",
    kontak: "09345678901",
  },
  {
    id: "k14",
    name: "Ethan Walker",
    jabatan: "Designer",
    kontak: "09456789012",
  },
  { id: "k15", name: "Charlotte Young", jabatan: "HR", kontak: "09567890123" },
  { id: "k16", name: "Henry King", jabatan: "Support", kontak: "09678901234" },
  {
    id: "k17",
    name: "Amelia Scott",
    jabatan: "Developer",
    kontak: "09789012345",
  },
  {
    id: "k18",
    name: "Liam Thomas",
    jabatan: "Project Manager",
    kontak: "09890123456",
  },
  {
    id: "k19",
    name: "Mason Green",
    jabatan: "Designer",
    kontak: "09901234567",
  },
  { id: "k20", name: "Harper Allen", jabatan: "HR", kontak: "10012345678" },
  { id: "k21", name: "Avery Adams", jabatan: "Support", kontak: "10123456789" },
  {
    id: "k22",
    name: "Elijah Nelson",
    jabatan: "Marketing",
    kontak: "10234567890",
  },
  {
    id: "k23",
    name: "Grace Carter",
    jabatan: "Developer",
    kontak: "10345678901",
  },
  {
    id: "k24",
    name: "Sebastian Mitchell",
    jabatan: "Manager",
    kontak: "10456789012",
  },
  {
    id: "k25",
    name: "Victoria Perez",
    jabatan: "Designer",
    kontak: "10567890123",
  },
  { id: "k26", name: "Benjamin Moore", jabatan: "HR", kontak: "10678901234" },
  {
    id: "k27",
    name: "Mila Jackson",
    jabatan: "Support",
    kontak: "10789012345",
  },
  {
    id: "k28",
    name: "James Harris",
    jabatan: "Project Manager",
    kontak: "10890123456",
  },
  {
    id: "k29",
    name: "Zoe Martinez",
    jabatan: "Designer",
    kontak: "10901234567",
  },
  { id: "k30", name: "Lucas Lee", jabatan: "Developer", kontak: "11012345678" },
];

export type Karyawan = {
  id: string;
  name: string;
  jabatan: string;
  kontak: string;
};

export const columns: ColumnDef<Karyawan>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nama
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "jabatan",
    header: "Jabatan",
    cell: ({ row }) => <div>{row.getValue("jabatan")}</div>,
  },
  {
    accessorKey: "kontak",
    header: "Kontak",
    cell: ({ row }) => <div>{row.getValue("kontak")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const karyawan = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Edit</DropdownMenuLabel>
            <DropdownMenuItem>Hapus</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function KaryawanTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 py-4">
        <div className="flex">
          <Input
            placeholder="Filter names..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <Filter /> <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <Button>
            <Plus /> Tambah
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
