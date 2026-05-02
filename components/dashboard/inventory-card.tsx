import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PackageSearch } from "lucide-react"

type InventoryCardProps = {
  reorder: number
  risk: "Low" | "Medium" | "High" | "Critical"
}

export function InventoryCard({ reorder, risk }: InventoryCardProps) {
  const badgeColor =
    risk === "Critical"
      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      : risk === "High"
        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
        : risk === "Medium"
          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"

  return (
    <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Inventory Decision</CardTitle>
        <PackageSearch className="h-4 w-4 text-orange-500" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">{reorder} units</div>
          <Badge variant="secondary" className={badgeColor}>
            {risk} Risk
          </Badge>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Recommended reorder quantity</p>
      </CardContent>
    </Card>
  )
}
