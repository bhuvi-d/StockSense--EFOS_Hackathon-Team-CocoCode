"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Timer, AlertTriangle } from "lucide-react"
import { useAnalysis } from "@/context/analysis-context"

export function StockoutCard() {
  const { data } = useAnalysis()

  const stockoutDays = data?.stockout_days ?? 0
  const stockoutDate = data?.stockout_date ?? ""
  const dailyBurnRate = data?.daily_burn_rate ?? 0

  const urgencyColor =
    stockoutDays <= 7
      ? "text-red-600 dark:text-red-400"
      : stockoutDays <= 14
        ? "text-orange-600 dark:text-orange-400"
        : stockoutDays <= 30
          ? "text-yellow-600 dark:text-yellow-400"
          : "text-emerald-600 dark:text-emerald-400"

  const urgencyBg =
    stockoutDays <= 7
      ? "bg-red-500"
      : stockoutDays <= 14
        ? "bg-orange-500"
        : stockoutDays <= 30
          ? "bg-yellow-500"
          : "bg-emerald-500"

  const formattedDate = stockoutDate
    ? new Date(stockoutDate + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—"

  const barWidth = Math.min(100, (stockoutDays / 60) * 100)

  return (
    <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Stockout Countdown</CardTitle>
        {stockoutDays <= 7 ? (
          <AlertTriangle className="h-4 w-4 text-red-500" />
        ) : (
          <Timer className="h-4 w-4 text-orange-500" />
        )}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${urgencyColor}`}>
          {stockoutDays === 0 ? "Out of stock" : `${stockoutDays} days`}
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          Est. stockout: {formattedDate}
        </p>
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400">
            <span>Daily burn rate</span>
            <span>{dailyBurnRate} units/day</span>
          </div>
          <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className={`h-full rounded-full ${urgencyBg} transition-all duration-500`}
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
