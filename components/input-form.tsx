"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function InputForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    productName: "",
    currentStock: "",
    customerReviews: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call/loading
    setTimeout(() => {
      // In a real app, we might store this in a context or pass via query params
      // For Phase 1, we'll just navigate to /dashboard
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Analyze Product
        </CardTitle>
        <CardDescription className="text-zinc-500 dark:text-zinc-400">
          Enter product details to get AI-powered inventory insights.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="productName" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Product Name
            </label>
            <Input
              id="productName"
              placeholder="e.g. Wireless Noise Cancelling Headphones"
              required
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              className="bg-zinc-50/50 dark:bg-zinc-900/50"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="currentStock" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Current Stock
            </label>
            <Input
              id="currentStock"
              type="number"
              placeholder="e.g. 50"
              required
              value={formData.currentStock}
              onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
              className="bg-zinc-50/50 dark:bg-zinc-900/50"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="customerReviews" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Customer Reviews
            </label>
            <Textarea
              id="customerReviews"
              placeholder="Paste customer reviews here (one per line or as a paragraph)..."
              required
              value={formData.customerReviews}
              onChange={(e) => setFormData({ ...formData, customerReviews: e.target.value })}
              className="min-h-[150px] bg-zinc-50/50 dark:bg-zinc-900/50"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full h-12 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                AI agent analyzing reviews...
              </>
            ) : (
              "Analyze Product"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
