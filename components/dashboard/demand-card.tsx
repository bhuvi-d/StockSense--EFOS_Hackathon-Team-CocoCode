"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { useAnalysis } from "@/context/analysis-context"

export function DemandCard() {
  const { data } = useAnalysis()
  
  const demand = data?.demand ?? 0
  const sentiment = data?.sentiment_score ?? 0
  
  // Calculate a mock trend based on sentiment
  const trend = Math.round(sentiment * 20)
  const trendColor = trend >= 0 ? "text-emerald-500" : "text-red-500"
  const trendIcon = trend >= 0 ? "↑" : "↓"

  return (
    <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Demand Forecast</CardTitle>
        <BarChart3 className="h-4 w-4 text-indigo-500" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{demand} units</div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <span className={trendColor}>{trendIcon} {Math.abs(trend)}%</span> projection shift
        </p>
      </CardContent>
    </Card>
  )
}
