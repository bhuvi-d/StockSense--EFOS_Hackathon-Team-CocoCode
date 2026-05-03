"use client"

import { SentimentCard } from "@/components/dashboard/sentiment-card"
import { DemandCard } from "@/components/dashboard/demand-card"
import { InventoryCard } from "@/components/dashboard/inventory-card"
import { InsightsCard } from "@/components/dashboard/insights-card"
import { ActionsCard } from "@/components/dashboard/actions-card"
import { ExplanationCard } from "@/components/dashboard/explanation-card"
import { StockoutCard } from "@/components/dashboard/stockout-card"
import { WhatIfCard } from "@/components/dashboard/what-if-card"
import { BenchmarkCard } from "@/components/dashboard/benchmark-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Clock, Database, Sparkles } from "lucide-react"
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

function generateReportHTML(data: any): string {
  const safeName = (data.productName || "product").replace(/\s+/g, "-")
  const riskColor = data.risk === "Critical" ? "#dc2626" : data.risk === "High" ? "#ea580c" : data.risk === "Medium" ? "#ca8a04" : "#16a34a"
  const sentColor = data.sentiment_score > 0.1 ? "#16a34a" : data.sentiment_score < -0.1 ? "#dc2626" : "#6b7280"

  const strengthsList = (data.strengths || []).map((s: string) => `<li>${s}</li>`).join("")
  const issuesList = (data.issues || []).map((s: string) => `<li>${s}</li>`).join("")
  const improvementsList = (data.improvements || []).map((s: string) => `<li>${s}</li>`).join("")

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>StockSense-${safeName}-report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; color: #18181b; background: #fff; padding: 40px 48px; font-size: 13px; line-height: 1.6; }
    .header { border-bottom: 3px solid #ea580c; padding-bottom: 16px; margin-bottom: 24px; }
    .brand { font-size: 11px; font-weight: 700; color: #ea580c; letter-spacing: 0.15em; text-transform: uppercase; }
    h1 { font-size: 26px; font-weight: 900; color: #18181b; margin: 4px 0 2px; }
    .subtitle { font-size: 12px; color: #71717a; }
    .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin: 20px 0; }
    .card { background: #f4f4f5; border-radius: 10px; padding: 14px 16px; }
    .card-label { font-size: 10px; font-weight: 700; color: #71717a; text-transform: uppercase; letter-spacing: 0.1em; }
    .card-value { font-size: 22px; font-weight: 900; margin: 2px 0; }
    .card-sub { font-size: 11px; color: #71717a; }
    .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #ea580c; margin: 20px 0 10px; border-left: 3px solid #ea580c; padding-left: 10px; }
    ul { padding-left: 0; list-style: none; }
    li { padding: 4px 0 4px 14px; position: relative; font-size: 12.5px; border-bottom: 1px solid #f4f4f5; }
    li::before { content: "•"; position: absolute; left: 0; color: #ea580c; }
    .plan-box { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 12px 16px; font-size: 12.5px; margin-top: 8px; }
    .expl-box { background: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 8px; padding: 12px 16px; font-size: 12.5px; margin-top: 8px; }
    .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #e4e4e7; font-size: 10px; color: #a1a1aa; display: flex; justify-content: space-between; }
    .print-btn { position: fixed; top: 16px; right: 16px; background: #ea580c; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; }
    .print-btn:hover { background: #c2410c; }
    @media print {
      body { padding: 20px 28px; }
      .print-btn { display: none; }
      @page { margin: 10mm; size: A4; }
    }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">Save as PDF</button>

  <div class="header">
    <div class="brand">StockSense AI &middot; Inventory Intelligence Report</div>
    <h1>${data.productName || "Product Report"}</h1>
    <div class="subtitle">Generated ${new Date(data.analyzedAt || new Date()).toLocaleString()} &nbsp;&middot;&nbsp; Based on ${data.reviewCount || 0} customer reviews ${data.category ? `&nbsp;&middot;&nbsp; ${data.category}` : ""}</div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-label">Sentiment Score</div>
      <div class="card-value" style="color:${sentColor}">${data.sentiment_score >= 0 ? "+" : ""}${(data.sentiment_score || 0).toFixed(2)}</div>
      <div class="card-sub">${data.sentiment_label || "Neutral"} &middot; ${((data.confidence || 0) * 100).toFixed(0)}% confidence</div>
    </div>
    <div class="card">
      <div class="card-label">Demand Forecast</div>
      <div class="card-value">${data.demand || 0} units</div>
      <div class="card-sub">Burn rate: ${data.daily_burn_rate || 0} units/day</div>
    </div>
    <div class="card">
      <div class="card-label">Risk Level</div>
      <div class="card-value" style="color:${riskColor}">${data.risk || "Low"}</div>
      <div class="card-sub">Reorder: ${data.reorder || 0} units</div>
    </div>
    <div class="card">
      <div class="card-label">Current Stock</div>
      <div class="card-value">${data.stock || 0} units</div>
      <div class="card-sub">Stockout in ${data.stockout_days || 0} days</div>
    </div>
    <div class="card">
      <div class="card-label">Stockout Date</div>
      <div class="card-value" style="font-size:16px">${data.stockout_date || "N/A"}</div>
      <div class="card-sub">Projected stockout</div>
    </div>
    <div class="card">
      <div class="card-label">Market Rank</div>
      <div class="card-value">#${data.sentiment_rank || "—"}</div>
      <div class="card-sub">${data.sentiment_percentile || 0}th percentile of ${data.total_products_compared || 0}</div>
    </div>
  </div>

  ${strengthsList ? `<div class="section-title">Strengths</div><ul>${strengthsList}</ul>` : ""}
  ${issuesList ? `<div class="section-title">Issues</div><ul>${issuesList}</ul>` : ""}
  ${improvementsList ? `<div class="section-title">Recommended Improvements</div><ul>${improvementsList}</ul>` : ""}

  <div class="section-title">Action Plan</div>
  <div class="plan-box">${data.restock_plan || "No restock plan generated."}</div>

  <div class="section-title">AI Explanation</div>
  <div class="expl-box">${data.explanation || "No explanation available."}</div>

  <div class="footer">
    <span>StockSense AI &middot; Powered by Groq LLM</span>
    <span>${data.email_triggered ? "&#10003; Automated procurement alert sent" : ""}</span>
  </div>
</body>
</html>`
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
              Analysis: <span className="text-orange-600 dark:text-orange-400">{data.productName}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              {data.category && (
                <Badge variant="outline" className="border-zinc-200 dark:border-zinc-800 text-[10px] font-bold">
                  {data.category}
                </Badge>
              )}
              {data.isRealData && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-[10px] font-bold">
                  CURATED DATASET
                </Badge>
              )}
              <span className="text-[10px] text-zinc-500 font-medium">
                Based on {data.reviewCount} customer reviews
              </span>
              {data.analyzedAt && (
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(data.analyzedAt).toLocaleTimeString()}
                </span>
              )}
              {data.email_triggered && (
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold border-none">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AUTOMATED PROCUREMENT ALERT SENT
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => {
              const html = generateReportHTML(data)
              const printWindow = window.open("", "_blank", "width=960,height=720")
              if (printWindow) {
                printWindow.document.open()
                printWindow.document.write(html)
                printWindow.document.close()
              }
            }}>Download PDF Report</Button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white dark:bg-orange-500 dark:hover:bg-orange-600" onClick={() => router.push("/")}>
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
          <motion.div variants={item}><StockoutCard /></motion.div>
          <motion.div variants={item}><WhatIfCard /></motion.div>
          <motion.div variants={item}><BenchmarkCard /></motion.div>
          
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
