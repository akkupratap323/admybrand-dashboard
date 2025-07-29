import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type AnalyticsData } from "@/lib/utils/mock-data-generator"

export const columns = [
  {
    accessorKey: "name",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => {
      const value = row.getValue("status") as string
      const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        active: "default",
        inactive: "destructive",
        new: "secondary"
      }
      const variant = variantMap[value.toLowerCase()] || "default"

      return (
        <Badge variant={variant}>{value}</Badge>
      )
    }
  },
  {
    accessorKey: "lastPurchase",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Purchase
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }: any) => {
      const date = new Date(row.getValue("lastPurchase"))
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      })
    }
  },
  {
    accessorKey: "totalSpent",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Spent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }: any) => {
      const amount = parseFloat(row.getValue("totalSpent"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    }
  },
  {
    accessorKey: "orders",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Orders
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }: any) => {
      return <div className="text-right">{row.getValue("orders")}</div>
    }
  }
]