"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy } from "lucide-react"
import { useAnalysis } from "@/context/analysis-context"

export function BenchmarkCard() {
  const { data } = useAnalysis()

  const rank = data?.sentiment_rank ?? 0
  const percentile = data?.sentiment_percentile ?? 0
  const total = data?.total_products_compared ?? 0
  const score = data?.sentiment_score ?? 0

  const tier =
    percentile >= 90
      ? { label: "Top Tier", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500" }
      : percentile >= 70
        ? { label: "Above Average", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500" }
        : percentile >= 40
          ? { label: "Average", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-500" }
          : { label: "Below Average", color: "text-red-600 dark:text-red-400", bg: "bg-red-500" }

  return (
    <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Market Benchmark</CardTitle>
        <Trophy className="h-4 w-4 text-amber-500" />
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${tier.color}`}>
          Top {100 - percentile}%
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          {tier.label} — Rank #{rank} of {total} products
        </p>
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400">
            <span>Customer satisfaction</span>
            <span>{(score * 100).toFixed(0)}/100</span>
          </div>
          <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className={`h-full rounded-full ${tier.bg} transition-all duration-500`}
              style={{ width: `${Math.max(2, (score + 1) / 2 * 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
