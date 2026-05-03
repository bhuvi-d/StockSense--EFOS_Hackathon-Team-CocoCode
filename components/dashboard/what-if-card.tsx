"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SlidersHorizontal } from "lucide-react"
import { useAnalysis } from "@/context/analysis-context"
import * as React from "react"

type RiskLabel = "Low" | "Medium" | "High" | "Critical"

function calculateInventory(demand: number, stock: number): { reorder: number; risk: RiskLabel } {
  if (demand > stock) {
    const reorder = demand - stock
    const risk: RiskLabel = demand >= stock * 2 && reorder >= 50 ? "Critical" : "High"
    return { reorder, risk }
  }
  if (demand === stock) {
    return { reorder: 10, risk: "Medium" }
  }
  return { reorder: 0, risk: "Low" }
}

export function WhatIfCard() {
  const { data } = useAnalysis()
  const [simStock, setSimStock] = React.useState<number | null>(null)

  const demand = data?.demand ?? 0
  const originalStock = data?.stock ?? 0
  const activeStock = simStock !== null ? simStock : originalStock

  const sim = calculateInventory(demand, activeStock)

  const riskColors = {
    Low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    Medium: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
    High: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
    Critical: "bg-red-500 text-white dark:bg-red-600 dark:text-white border-red-600",
  }

  const isChanged = simStock !== null && simStock !== originalStock
  const breakEvenStock = demand

  return (
    <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">What-If Simulator</CardTitle>
        <SlidersHorizontal className="h-4 w-4 text-orange-500" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Simulate stock level</span>
            <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{activeStock} units</span>
          </div>
          <input
            type="range"
            min={0}
            max={Math.max(200, originalStock * 3)}
            step={1}
            value={activeStock}
            onChange={(e) => setSimStock(Number(e.target.value))}
            onMouseDown={() => setSimStock(activeStock)}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-zinc-200 dark:bg-zinc-700 accent-orange-500"
          />
          <div className="flex justify-between text-[10px] text-zinc-400">
            <span>0</span>
            <span className="text-orange-500 font-medium">Break-even: {breakEvenStock}</span>
            <span>{Math.max(200, originalStock * 3)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold">
              {sim.reorder > 0 ? `${sim.reorder} units` : "No reorder"}
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Reorder quantity</p>
          </div>
          <Badge variant="outline" className={`${riskColors[sim.risk]} border font-bold px-2 py-0.5`}>
            {sim.risk} Risk
          </Badge>
        </div>

        {isChanged && (
          <button
            onClick={() => setSimStock(null)}
            className="text-[10px] text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 underline"
          >
            Reset to actual stock ({originalStock})
          </button>
        )}
      </CardContent>
    </Card>
  )
}
