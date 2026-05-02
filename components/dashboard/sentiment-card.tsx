"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { useAnalysis } from "@/context/analysis-context"

export function SentimentCard() {
  const { data } = useAnalysis()
  
  const score = data?.sentiment_score ?? 0
  const label = data?.sentiment_label ?? "Neutral"
  
  const Icon = score > 0.15 ? TrendingUp : score < -0.15 ? TrendingDown : Minus
  const colorClass = score > 0.15 ? "text-emerald-500" : score < -0.15 ? "text-red-500" : "text-zinc-500"
  const scoreColorClass = score > 0.15 ? "text-emerald-600 dark:text-emerald-400" : score < -0.15 ? "text-red-600 dark:text-red-400" : "text-zinc-600 dark:text-zinc-400"

  return (
    <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Sentiment Score</CardTitle>
        <Icon className={`h-4 w-4 ${colorClass}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${scoreColorClass}`}>
          {score > 0 ? "+" : ""}{score.toFixed(2)}
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{label}</p>
      </CardContent>
    </Card>
  )
}
