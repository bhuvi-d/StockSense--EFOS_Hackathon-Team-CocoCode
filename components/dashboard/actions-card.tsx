"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, ClipboardList, Copy, Check, Download, ExternalLink } from "lucide-react"
import { useAnalysis } from "@/context/analysis-context"
import * as React from "react"
import { jsPDF } from "jspdf"

export function ActionsCard() {
  const { data } = useAnalysis()
  const [copied, setCopied] = React.useState<string | null>(null)
  
  if (!data) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleEmailSupplier = () => {
    if (!data.email) return
    window.location.href = data.email
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    let y = 20

    // Header
    doc.setFillColor(255, 120, 0) // Orange
    doc.rect(0, 0, pageWidth, 40, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont("helvetica", "bold")
    doc.text("StockSense AI | Inventory Report", margin, 25)
    
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Generated: ${new Date(data.analyzedAt).toLocaleString()}`, margin, 35)

    // Product Section
    y = 55
    doc.setTextColor(40, 40, 40)
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text(data.productName, margin, y)
    
    y += 10
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Category: ${data.category || "General"}`, margin, y)
    
    // Key Stats Grid
    y += 15
    doc.setDrawColor(230, 230, 230)
    doc.line(margin, y, pageWidth - margin, y)
    
    y += 10
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text("CURRENT STATUS", margin, y)
    doc.text("DEMAND FORECAST", pageWidth / 2, y)
    
    y += 7
    doc.setFontSize(14)
    doc.setTextColor(255, 100, 0)
    doc.text(`${data.stock} Units In Stock`, margin, y)
    doc.text(`${data.demand} Predicted Units`, pageWidth / 2, y)

    // Sentiment
    y += 20
    doc.setTextColor(40, 40, 40)
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text("CUSTOMER SENTIMENT", margin, y)
    
    y += 7
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`${data.sentiment_label} (${data.sentiment_score > 0 ? "+" : ""}${data.sentiment_score.toFixed(2)})`, margin, y)

    // Restock Plan
    y += 20
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text("RECOMMENDED RESTOCK PLAN", margin, y)
    
    y += 7
    doc.setFontSize(11)
    doc.setFont("helvetica", "italic")
    const planLines = doc.splitTextToSize(data.restock_plan, pageWidth - (margin * 2))
    doc.text(planLines, margin, y)
    y += (planLines.length * 6)

    // Insights
    y += 15
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text("KEY PRODUCT INSIGHTS", margin, y)
    
    y += 7
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    const strengths = data.strengths.slice(0, 3).map(s => `+ ${s}`)
    const issues = data.issues.slice(0, 3).map(s => `- ${s}`)
    doc.text([...strengths, ...issues], margin, y)

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text("Confidential AI-Generated Inventory Analysis. Powered by StockSense AI.", margin, 285)

    doc.save(`StockSense-${data.productName.replace(/\s+/g, "-")}-report.pdf`)
  }

  return (
    <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 h-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <div className="w-2 h-6 bg-orange-500 rounded-full" />
          AI Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Procurement</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-[10px] font-bold text-orange-600 uppercase"
              onClick={() => handleCopy("supplier@example.com", "copy-mail")}
            >
              {copied === "copy-mail" ? "Copied" : "Copy Address"}
            </Button>
          </div>
          <Button 
            className="w-full justify-between h-12 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-100 dark:bg-orange-950/20 dark:hover:bg-orange-900/30 dark:text-orange-400 dark:border-orange-900/40" 
            variant="outline"
            onClick={handleEmailSupplier}
          >
            <span className="flex items-center font-bold">
              <Mail className="h-4 w-4 mr-3" />
              Send Order Email
            </span>
            <ExternalLink className="h-4 w-4 opacity-50" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Logistics</p>
          <Button 
            className="w-full justify-between h-12 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all" 
            variant="outline"
            onClick={() => handleCopy(data.restock_plan, "plan")}
          >
            <span className="flex items-center font-bold">
              <ClipboardList className="h-4 w-4 mr-3 text-orange-500" />
              Copy Restock Plan
            </span>
            {copied === "plan" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-zinc-400" />}
          </Button>
        </div>

        <div className="space-y-2 pt-2">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Documentation</p>
          <Button 
            className="w-full h-14 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-900 font-black uppercase tracking-widest text-sm shadow-xl transition-transform active:scale-[0.98]" 
            onClick={handleDownloadPDF}
          >
            <Download className="h-5 w-5 mr-3" />
            Download PDF Report
          </Button>
        </div>

        <div className="mt-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium italic">
            Automate your workflow by directly emailing suppliers or downloading high-fidelity reports for stakeholders.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
