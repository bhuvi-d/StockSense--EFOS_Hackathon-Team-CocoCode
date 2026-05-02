"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle, Database } from "lucide-react"
import { useAnalysis } from "@/context/analysis-context"
import productsData from "@/data/products.json"

export function InputForm() {
  const router = useRouter()
  const { setData } = useAnalysis()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = React.useState("")
  const [isRealData, setIsRealData] = React.useState(false)
  const [formData, setFormData] = React.useState({
    productName: "",
    currentStock: "",
    customerReviews: "",
  })

  const handleProductSelect = (name: string) => {
    setSelectedProduct(name)
    if (!name) {
      setIsRealData(false)
      return
    }
    const product = productsData.products.find((p) => p.name === name)
    if (product) {
      setFormData({
        productName: product.name,
        currentStock: String(product.stock),
        customerReviews: product.reviews.join("\n"),
      })
      setIsRealData(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const reviewsArray = formData.customerReviews
        .split("\n")
        .map(r => r.trim())
        .filter(r => r.length > 0)

      if (reviewsArray.length === 0) {
        throw new Error("Please enter at least one customer review.")
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: formData.productName,
          stock: parseInt(formData.currentStock, 10),
          reviews: reviewsArray,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Something went wrong. Try again.")
      }

      const data = await response.json()
      setData({
        ...data,
        productName: formData.productName,
        reviewCount: reviewsArray.length,
        isRealData,
        analyzedAt: new Date().toISOString(),
      })
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.")
      setIsLoading(false)
    }
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
          {error && (
            <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="productSelect" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <Database className="h-3.5 w-3.5 text-indigo-500" />
              Choose Sample Product
            </label>
            <select
              id="productSelect"
              value={selectedProduct}
              onChange={(e) => handleProductSelect(e.target.value)}
              disabled={isLoading}
              className="w-full h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">— Or enter manually below —</option>
              {productsData.products.map((p) => (
                <option key={p.name} value={p.name}>{p.name} ({p.reviews.length} reviews)</option>
              ))}
            </select>
            {isRealData && (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px]">
                Using real customer review data
              </Badge>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="productName" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Product Name
            </label>
            <Input
              id="productName"
              placeholder="e.g. Wireless Noise Cancelling Headphones"
              required
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
