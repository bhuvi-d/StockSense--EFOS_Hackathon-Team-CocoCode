"use client"

import { SentimentCard } from "@/components/dashboard/sentiment-card"
import { DemandCard } from "@/components/dashboard/demand-card"
import { InventoryCard } from "@/components/dashboard/inventory-card"
import { InsightsCard } from "@/components/dashboard/insights-card"
import { ActionsCard } from "@/components/dashboard/actions-card"
import { ExplanationCard } from "@/components/dashboard/explanation-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Clock, Database } from "lucide-react"
import { motion } from "framer-motion"
import * as React from "react"
import { useRouter } from "next/navigation"
import { useAnalysis } from "@/context/analysis-context"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function DashboardPage() {
  const { data } = useAnalysis()
  const router = useRouter()

  React.useEffect(() => {
    if (!data) {
      router.push("/")
    }
  }, [data, router])

  if (!data) return null

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <Link href="/" className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 mb-2 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to analysis
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Product Analysis: <span className="text-indigo-600 dark:text-indigo-400">{data.productName}</span>
            </h1>
            <div className="flex items-center gap-3 mt-1">
              {data.isRealData && (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px]">
                  <Database className="h-3 w-3 mr-1" />
                  Real customer review data
                </Badge>
              )}
              {data.analyzedAt && (
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Analyzed {new Date(data.analyzedAt).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => {
              const text = [
                `StockSense AI Report — ${data.productName}`,
                `Generated: ${new Date(data.analyzedAt).toLocaleString()}`,
                "",
                `Sentiment Score: ${data.sentiment_score > 0 ? "+" : ""}${data.sentiment_score.toFixed(2)} (${data.sentiment_label})`,
                `Confidence: ${(data.confidence * 100).toFixed(0)}%`,
                `Demand Forecast: ${data.demand} units`,
                `Reorder Quantity: ${data.reorder} units`,
                `Risk Level: ${data.risk}`,
                "",
                "Key Strengths:",
                ...data.strengths.map((s: string) => `  • ${s}`),
                "",
                "Top Issues:",
                ...data.issues.map((s: string) => `  • ${s}`),
                "",
                "Recommended Improvements:",
                ...data.improvements.map((s: string) => `  • ${s}`),
                "",
                "Restock Plan:",
                data.restock_plan,
                "",
                "Explanation:",
                data.explanation,
                "",
                "---",
                "Supplier Email:",
                data.email,
              ].join("\n")
              const blob = new Blob([text], { type: "text/plain" })
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = `StockSense-${data.productName.replace(/\s+/g, "-")}-report.txt`
              a.click()
              URL.revokeObjectURL(url)
            }}>Download Report</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600" onClick={() => router.push("/")}>
              New Analysis
            </Button>
          </div>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <motion.div variants={item}><SentimentCard /></motion.div>
          <motion.div variants={item}><DemandCard /></motion.div>
          <motion.div variants={item}><InventoryCard /></motion.div>
          
          <motion.div variants={item} className="lg:col-span-2">
            <InsightsCard />
          </motion.div>
          <motion.div variants={item} className="lg:col-span-1">
            <ActionsCard />
          </motion.div>
          
          <motion.div variants={item} className="col-span-full">
            <ExplanationCard />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
