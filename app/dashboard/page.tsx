"use client"

import { useSearchParams } from "next/navigation"
import { SentimentCard } from "@/components/dashboard/sentiment-card"
import { DemandCard } from "@/components/dashboard/demand-card"
import { InventoryCard } from "@/components/dashboard/inventory-card"
import { InsightsCard } from "@/components/dashboard/insights-card"
import { ActionsCard } from "@/components/dashboard/actions-card"
import { ExplanationCard } from "@/components/dashboard/explanation-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import * as React from "react"

type AnalyzeResponse = {
  sentiment_score: number
  sentiment_label: "Positive" | "Neutral" | "Negative"
  issues: string[]
  strengths: string[]
  improvements: string[]
  confidence: number
  demand: number
  reorder: number
  risk: "Low" | "Medium" | "High" | "Critical"
  email: string
  restock_plan: string
  explanation: string
}

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
  const searchParams = useSearchParams()
  const [data, setData] = React.useState<AnalyzeResponse | null>(null)
  const [productName, setProductName] = React.useState<string>("")

  React.useEffect(() => {
    const dataParam = searchParams.get("data")
    const productParam = searchParams.get("product")
    if (dataParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(dataParam)) as AnalyzeResponse
        setData(parsed)
      } catch {
        console.error("Failed to parse dashboard data")
      }
    }
    if (productParam) {
      setProductName(decodeURIComponent(productParam))
    }
  }, [searchParams])

  if (!data) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-8 flex items-center justify-center">
        <div className="text-zinc-500 dark:text-zinc-400">No analysis data found. Please analyze a product first.</div>
      </div>
    )
  }

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
              Product Analysis: <span className="text-indigo-600 dark:text-indigo-400">{productName || "Product"}</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">Export PDF</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600">
              Update Data
            </Button>
          </div>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <motion.div variants={item}>
            <SentimentCard 
              sentiment_score={data.sentiment_score} 
              sentiment_label={data.sentiment_label} 
            />
          </motion.div>
          <motion.div variants={item}>
            <DemandCard demand={data.demand} />
          </motion.div>
          <motion.div variants={item}>
            <InventoryCard 
              reorder={data.reorder} 
              risk={data.risk} 
            />
          </motion.div>
          
          <motion.div variants={item} className="lg:col-span-2">
            <InsightsCard 
              issues={data.issues} 
              strengths={data.strengths} 
              improvements={data.improvements} 
            />
          </motion.div>
          <motion.div variants={item} className="lg:col-span-1">
            <ActionsCard 
              email={data.email} 
              restock_plan={data.restock_plan} 
            />
          </motion.div>
          
          <motion.div variants={item} className="col-span-full">
            <ExplanationCard explanation={data.explanation} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
