"use client"

import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  X,
  Calendar,
  CheckCircle,
  XCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SkeletonTable } from "@/components/ui/skeleton"
import { CustomerData } from '@/lib/types'
import { cn, formatCurrency, formatDate, debounce, downloadCSV } from "@/lib/utils"

interface DataTableProps {
  data: CustomerData[]
  isLoading?: boolean
  onRefresh?: () => void
}

export function DataTable({ data, isLoading = false, onRefresh }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [selectedRow, setSelectedRow] = useState<CustomerData | null>(null)

  const debouncedGlobalFilter = useCallback(debounce((value: string) => {
    setGlobalFilter(value)
  }, 300), [])

  const handleExportData = () => {
    const exportData = table.getFilteredRowModel().rows.map(row => row.original)
    downloadCSV(exportData, 'customer-data')
  }

  const toggleRowSelection = (rowId: string) => {
    const newSelection = new Set(selectedRows)
    if (newSelection.has(rowId)) {
      newSelection.delete(rowId)
    } else {
      newSelection.add(rowId)
    }
    setSelectedRows(newSelection)
  }

  const selectAllRows = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(data.map(row => row.id)))
    }
  }

  const columns: ColumnDef<CustomerData>[] = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={selectedRows.size === data.length && data.length > 0}
            onChange={selectAllRows}
            className="rounded border-border"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedRows.has(row.original.id)}
            onChange={() => toggleRowSelection(row.original.id)}
            className="rounded border-border"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <div className="font-medium text-xs text-muted-foreground">#{row.getValue("id")}</div>
        ),
        size: 60,
      },
      {
        accessorKey: "customer",
        header: "Customer",
        cell: ({ row }) => {
          const customer = row.getValue<string>("customer")
          const email = row.original.email
          return (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {customer.charAt(0)}
                </div>
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background",
                  row.original.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                )} />
              </div>
              <div>
                <div className="font-medium">{customer}</div>
                <div className="text-xs text-muted-foreground">{email}</div>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue<'Active' | 'Inactive'>("status")
          return (
            <Badge
              variant={status === "Active" ? "default" : "secondary"}
              className={cn(
                "flex items-center space-x-1",
                status === "Active" && "bg-green-500 hover:bg-green-600 text-white",
                status === "Inactive" && "bg-red-500 hover:bg-red-600 text-white"
              )}
            >
              {status === 'Active' ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <XCircle className="w-3 h-3" />
              )}
              <span>{status}</span>
            </Badge>
          )
        },
        filterFn: (row, id, value) => {
          if (value === 'all') return true
          return row.getValue(id) === value
        },
      },
      {
        accessorKey: "revenue",
        header: "Revenue",
        cell: ({ row }) => {
          const amount = row.getValue<number>("revenue")
          return (
            <div className="text-right">
              <div className="font-semibold">{formatCurrency(amount)}</div>
              <div className="text-xs text-muted-foreground">
                {amount > 5000 ? 'High value' : amount > 2000 ? 'Medium' : 'Low'}
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
          const date = row.getValue<string>("date")
          return (
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm">{formatDate(date, 'short')}</div>
                <div className="text-xs text-muted-foreground">
                  {(() => {
                    const daysDiff = Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
                    return `${daysDiff} days ago`
                  })()} 
                </div>
              </div>
            </div>
          )
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRow(row.original)}
              className="h-8 w-8 p-0"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => alert(`Edit customer: ${row.original.customer}. In a real app, this would open an edit form.`)}
              className="h-8 w-8 p-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm(`Are you sure you want to delete ${row.original.customer}?`)) {
                  alert(`Customer ${row.original.customer} would be deleted in a real app.`)
                }
              }}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [data, selectedRows]
  )

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  })

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Card>
          <CardContent className="p-6">
            <SkeletonTable />
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <CardTitle className="flex items-center space-x-2">
                <span>Customer Data</span>
                <Badge variant="secondary" className="ml-2">
                  {table.getFilteredRowModel().rows.length} records
                </Badge>
              </CardTitle>
              {selectedRows.size > 0 && (
                <Badge variant="default" className="bg-blue-500">
                  {selectedRows.size} selected
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  onChange={(event) => debouncedGlobalFilter(event.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(showFilters && "bg-muted")}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportData}
                disabled={table.getFilteredRowModel().rows.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              )}
            </div>
          </div>
          
          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="pt-4 border-t border-border/50"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value)
                        table.getColumn('status')?.setFilterValue(e.target.value === 'all' ? undefined : e.target.value)
                      }}
                      className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Range</label>
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="all">All Time</option>
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setStatusFilter('all')
                        setDateFilter('all')
                        setGlobalFilter('')
                        table.resetColumnFilters()
                      }}
                      className="w-full"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b bg-muted/30">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn(
                              "flex items-center space-x-2",
                              header.column.getCanSort() &&
                                "cursor-pointer select-none hover:text-foreground transition-colors"
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <span>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </span>
                            {header.column.getCanSort() && (
                              <div className="flex flex-col">
                                <ChevronUp
                                  className={cn(
                                    "h-3 w-3 transition-colors",
                                    header.column.getIsSorted() === "asc"
                                      ? "text-foreground"
                                      : "text-muted-foreground/30"
                                  )}
                                />
                                <ChevronDown
                                  className={cn(
                                    "h-3 w-3 -mt-1 transition-colors",
                                    header.column.getIsSorted() === "desc"
                                      ? "text-foreground"
                                      : "text-muted-foreground/30"
                                  )}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                <AnimatePresence>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row, index) => (
                      <motion.tr
                        key={row.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.02, duration: 0.3 }}
                        className={cn(
                          "border-b transition-all duration-200 hover:bg-muted/50 cursor-pointer",
                          selectedRows.has(row.original.id) && "bg-muted/70",
                          selectedRow?.id === row.original.id && "bg-primary/10 border-primary/20"
                        )}
                        onClick={() => setSelectedRow(selectedRow?.id === row.original.id ? null : row.original)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="p-4 align-middle">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="h-32 text-center"
                      >
                        <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground">
                          <Search className="w-8 h-8" />
                          <div>
                            <p className="font-medium">No results found</p>
                            <p className="text-sm">Try adjusting your search or filter criteria</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {/* Enhanced Pagination */}
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 p-4 border-t bg-muted/20">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}{" "}
                of {table.getFilteredRowModel().rows.length} entries
              </span>
              {selectedRows.size > 0 && (
                <Badge variant="secondary">
                  {selectedRows.size} selected
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                  className="h-8 w-16 rounded border border-input bg-background text-sm"
                >
                  {[10, 20, 30, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  className="hidden lg:flex"
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Previous</span>
                </Button>
                
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                  </span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="hidden sm:inline mr-2">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  className="hidden lg:flex"
                >
                  Last
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Detail Modal */}
      <AnimatePresence>
        {selectedRow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedRow(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-background rounded-lg shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold">Customer Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRow(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {selectedRow.customer.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{selectedRow.customer}</h4>
                    <p className="text-muted-foreground">{selectedRow.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge
                      variant={selectedRow.status === "Active" ? "default" : "secondary"}
                      className={cn(
                        "mt-1",
                        selectedRow.status === "Active" && "bg-green-500 hover:bg-green-600",
                        selectedRow.status === "Inactive" && "bg-red-500 hover:bg-red-600"
                      )}
                    >
                      {selectedRow.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Revenue</label>
                    <p className="font-semibold text-lg mt-1">{formatCurrency(selectedRow.revenue)}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date Joined</label>
                  <p className="mt-1">{formatDate(selectedRow.date, 'long')}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
