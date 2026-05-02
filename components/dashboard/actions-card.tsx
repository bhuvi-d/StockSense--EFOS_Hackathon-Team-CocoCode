"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, ClipboardList, Copy, Check } from "lucide-react"
import { useAnalysis } from "@/context/analysis-context"
import * as React from "react"

export function ActionsCard() {
  const { data } = useAnalysis()
  const [copied, setCopied] = React.useState<string | null>(null)
  
  const email = data?.email ?? ""
  const plan = data?.restock_plan ?? ""

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">AI Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Procurement</p>
          <Button 
            className="w-full justify-between" 
            variant="outline"
            onClick={() => handleCopy(email, "email")}
          >
            <span className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Supplier Email
            </span>
            {copied === "email" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-zinc-400" />}
          </Button>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Logistics</p>
          <Button 
            className="w-full justify-between" 
            variant="outline"
            onClick={() => handleCopy(plan, "plan")}
          >
            <span className="flex items-center">
              <ClipboardList className="h-4 w-4 mr-2" />
              Restock Plan
            </span>
            {copied === "plan" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-zinc-400" />}
          </Button>
        </div>

        <div className="mt-4 p-3 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight italic">
            Click to copy AI-generated templates to your clipboard for use in your inventory management software.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
