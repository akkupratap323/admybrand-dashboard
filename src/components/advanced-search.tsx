"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Filter,
  X,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface FilterOption {
  id: string
  label: string
  value: string
  count?: number
}

interface DateRange {
  from: Date | null
  to: Date | null
}

interface AdvancedSearchProps {
  onSearch: (query: string) => void
  onFiltersChange: (filters: SearchFilters) => void
  placeholder?: string
  showFilters?: boolean
}

export interface SearchFilters {
  query: string
  dateRange: DateRange
  status: string[]
  revenue: { min: number | null; max: number | null }
  categories: string[]
  sortBy: string
  sortOrder: "asc" | "desc"
}

const statusOptions: FilterOption[] = [
  { id: "active", label: "Active", value: "active", count: 45 },
  { id: "inactive", label: "Inactive", value: "inactive", count: 12 },
  { id: "pending", label: "Pending", value: "pending", count: 8 },
]

const categoryOptions: FilterOption[] = [
  { id: "premium", label: "Premium", value: "premium", count: 23 },
  { id: "standard", label: "Standard", value: "standard", count: 31 },
  { id: "basic", label: "Basic", value: "basic", count: 11 },
]

const sortOptions: FilterOption[] = [
  { id: "revenue", label: "Revenue", value: "revenue" },
  { id: "date", label: "Date", value: "date" },
  { id: "name", label: "Name", value: "name" },
  { id: "status", label: "Status", value: "status" },
]

export function AdvancedSearch({
  onSearch,
  onFiltersChange,
  placeholder = "Search...",
  showFilters = true
}: AdvancedSearchProps) {
  const [query, setQuery] = useState("")
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    dateRange: { from: null, to: null },
    status: [],
    revenue: { min: null, max: null },
    categories: [],
    sortBy: "date",
    sortOrder: "desc"
  })

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      onSearch(searchQuery)
      setFilters(prev => ({ ...prev, query: searchQuery }))
    }, 300),
    [onSearch]
  )

  useEffect(() => {
    debouncedSearch(query)
  }, [query, debouncedSearch])

  useEffect(() => {
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleArrayFilter = (key: "status" | "categories", value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value]
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      query: "",
      dateRange: { from: null, to: null },
      status: [],
      revenue: { min: null, max: null },
      categories: [],
      sortBy: "date",
      sortOrder: "desc"
    })
    setQuery("")
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.status.length > 0) count++
    if (filters.categories.length > 0) count++
    if (filters.revenue.min !== null || filters.revenue.max !== null) count++
    if (filters.dateRange.from || filters.dateRange.to) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10 h-12 bg-background/50 backdrop-blur-sm border-muted-foreground/20 focus:border-primary/50 transition-all duration-200"
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {showFilters && (
            <Button
              variant="outline"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={`h-12 px-4 ${isFiltersOpen || activeFiltersCount > 0 ? "bg-primary/10 border-primary/30" : ""}`}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
                  {activeFiltersCount}
                </Badge>
              )}
              {isFiltersOpen ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </Button>
          )}
        </div>

        {/* Quick Filters */}
        {(activeFiltersCount > 0 || filters.query) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 mt-3"
          >
            <span className="text-sm text-muted-foreground">Active filters:</span>
            <div className="flex flex-wrap gap-2">
              {filters.query && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Search className="h-3 w-3" />
                  <span>"{filters.query}"</span>
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => setQuery("")}
                  />
                </Badge>
              )}
              {filters.status.map(status => (
                <Badge key={status} variant="secondary" className="flex items-center space-x-1">
                  <span>{status}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => toggleArrayFilter("status", status)}
                  />
                </Badge>
              ))}
              {filters.categories.map(category => (
                <Badge key={category} variant="secondary" className="flex items-center space-x-1">
                  <span>{category}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => toggleArrayFilter("categories", category)}
                  />
                </Badge>
              ))}
              {(filters.revenue.min !== null || filters.revenue.max !== null) && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <DollarSign className="h-3 w-3" />
                  <span>
                    {filters.revenue.min || 0} - {filters.revenue.max || "∞"}
                  </span>
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => updateFilter("revenue", { min: null, max: null })}
                  />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-6 px-2 text-xs"
              >
                Clear all
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-muted-foreground/20 bg-background/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Status Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Status</span>
                    </label>
                    <div className="space-y-2">
                      {statusOptions.map(option => (
                        <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.status.includes(option.value)}
                            onChange={() => toggleArrayFilter("status", option.value)}
                            className="rounded border-muted-foreground/30"
                          />
                          <span className="text-sm">{option.label}</span>
                          <Badge variant="outline" className="text-xs">
                            {option.count}
                          </Badge>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center space-x-2">
                      <Filter className="h-4 w-4" />
                      <span>Category</span>
                    </label>
                    <div className="space-y-2">
                      {categoryOptions.map(option => (
                        <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.categories.includes(option.value)}
                            onChange={() => toggleArrayFilter("categories", option.value)}
                            className="rounded border-muted-foreground/30"
                          />
                          <span className="text-sm">{option.label}</span>
                          <Badge variant="outline" className="text-xs">
                            {option.count}
                          </Badge>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Revenue Range */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <span>Revenue Range</span>
                    </label>
                    <div className="space-y-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.revenue.min || ""}
                        onChange={(e) => updateFilter("revenue", {
                          ...filters.revenue,
                          min: e.target.value ? Number(e.target.value) : null
                        })}
                        className="text-sm"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.revenue.max || ""}
                        onChange={(e) => updateFilter("revenue", {
                          ...filters.revenue,
                          max: e.target.value ? Number(e.target.value) : null
                        })}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>Sort By</span>
                    </label>
                    <div className="space-y-2">
                      <select
                        value={filters.sortBy}
                        onChange={(e) => updateFilter("sortBy", e.target.value)}
                        className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        {sortOptions.map(option => (
                          <option key={option.id} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="flex items-center space-x-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="sortOrder"
                            checked={filters.sortOrder === "asc"}
                            onChange={() => updateFilter("sortOrder", "asc")}
                          />
                          <span className="text-sm">Ascending</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="sortOrder"
                            checked={filters.sortOrder === "desc"}
                            onChange={() => updateFilter("sortOrder", "desc")}
                          />
                          <span className="text-sm">Descending</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {activeFiltersCount} filter{activeFiltersCount !== 1 ? "s" : ""} applied
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={clearAllFilters}>
                      Clear All
                    </Button>
                    <Button size="sm" onClick={() => setIsFiltersOpen(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}