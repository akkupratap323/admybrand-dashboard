"use client"

import { useState } from "react"
import { useRealtimeUpdates } from "@/lib/hooks/use-realtime-updates"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download, RefreshCw } from "lucide-react"

const columns = [
  {
    accessorKey: "name",
    header: "Customer",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => {
      const value = row.getValue("status")
      return (
        <Badge 
          variant={
            value === "active" ? "default" :
            value === "inactive" ? "secondary" :
            "outline"
          }
        >
          {value}
        </Badge>
      )
    }
  },
  {
    accessorKey: "lastPurchase",
    header: "Last Purchase",
    cell: ({ row }: any) => {
      const date = new Date(row.getValue("lastPurchase"))
      return date.toLocaleDateString()
    }
  },
  {
    accessorKey: "totalSpent",
    header: "Total Spent",
    cell: ({ row }: any) => {
      const amount = parseFloat(row.getValue("totalSpent"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return formatted
    }
  },
]

export function DataTable() {
  const { data, loading, refresh } = useRealtimeUpdates(5000)
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data: data?.recentCustomers ?? [],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
  })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-10 bg-muted animate-pulse rounded" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const exportToCsv = () => {
    const headers = columns.map(col => col.accessorKey)
    const rows = data?.recentCustomers.map(row => 
      headers.map(header => row[header as keyof typeof row])
    )
    const csvContent = [
      headers.join(","),
      ...(rows?.map(row => row.join(",")) ?? [])
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "customers.csv")
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <Input
              placeholder="Search customers..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm"
            />
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={refresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={exportToCsv}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
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
                            cell.getContext()
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

          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}