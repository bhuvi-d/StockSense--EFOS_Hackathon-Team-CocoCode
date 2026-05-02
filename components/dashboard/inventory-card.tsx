"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PackageSearch } from "lucide-react"
import { useAnalysis } from "@/context/analysis-context"

export function InventoryCard() {
  const { data } = useAnalysis()
  
  const reorder = data?.reorder ?? 0
  const risk = data?.risk ?? "Low"
  
  const riskColors = {
    Low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    Medium: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
    High: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
    Critical: "bg-red-500 text-white dark:bg-red-600 dark:text-white border-red-600",
  }

  return (
    <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Inventory Decision</CardTitle>
        <PackageSearch className="h-4 w-4 text-orange-500" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">{reorder} units</div>
          <Badge variant="outline" className={`${riskColors[risk]} border font-bold px-2 py-0.5`}>
            {risk} Risk
          </Badge>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Recommended reorder quantity</p>
      </CardContent>
    </Card>
  )
}
