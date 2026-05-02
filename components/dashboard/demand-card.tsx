import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export function DemandCard() {
  return (
    <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Demand Forecast</CardTitle>
        <BarChart3 className="h-4 w-4 text-indigo-500" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">65 units</div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <span className="text-emerald-500">↑ 12%</span> vs last month
        </p>
      </CardContent>
    </Card>
  )
}
