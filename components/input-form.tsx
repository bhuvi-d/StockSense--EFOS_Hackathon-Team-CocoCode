"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle, Database, Package, Search, ChevronRight, Zap } from "lucide-react"
import { useAnalysis } from "@/context/analysis-context"
import { motion, AnimatePresence } from "framer-motion"

interface ProductSummary {
  id: string
  name: string
  category: string
  reviewCount: number
}

export function InputForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productIdFromUrl = searchParams.get("productId")
  
  const { setData } = useAnalysis()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isFetching, setIsFetching] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [products, setProducts] = React.useState<ProductSummary[]>([])
  const [selectedProductId, setSelectedProductId] = React.useState("")
  const [isRealData, setIsRealData] = React.useState(false)
  
  const [formData, setFormData] = React.useState({
    productName: "",
    currentStock: "",
    customerReviews: "",
    category: "",
  })

  // Fetch initial product list
  React.useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Failed to load products:", err))
  }, [])

  // Handle URL parameter productId
  React.useEffect(() => {
    if (productIdFromUrl && products.length > 0) {
      handleProductSelect(productIdFromUrl)
    }
  }, [productIdFromUrl, products.length])

  const handleProductSelect = async (id: string) => {
    if (!id) {
      setSelectedProductId("")
      setIsRealData(false)
      return
    }

    setSelectedProductId(id)
    setIsFetching(true)
    setError(null)

    try {
      const res = await fetch(`/api/products/${id}`)
      if (!res.ok) throw new Error("Failed to fetch product details")
      const product = await res.json()
      
      setFormData({
        productName: product.name,
        currentStock: String(Math.floor(Math.random() * 100) + 10),
        customerReviews: product.reviews.join("\n"),
        category: product.category,
      })
      setIsRealData(true)
    } catch (err) {
      console.error(err)
      setError("Could not load product details")
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.productName || !formData.currentStock || !formData.customerReviews) {
      setError("Please fill in all required fields.")
      return
    }

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: formData.productName,
          stock: parseInt(formData.currentStock, 10),
          reviews: reviewsArray,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Analysis failed. Please check your connection.")
      }

      const data = await response.json()
      setData({
        ...data,
        productName: formData.productName,
        category: formData.category,
        stock: parseInt(formData.currentStock, 10),
        reviewCount: reviewsArray.length,
        isRealData,
        analyzedAt: new Date().toISOString(),
      })
      
      // Navigate to dashboard
      router.push("/dashboard")
    } catch (err) {
      console.error("Submission error:", err)
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.")
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-2xl border-orange-200/50 dark:border-orange-900/30 bg-white dark:bg-zinc-950 overflow-hidden rounded-3xl relative">
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-6"
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-20 h-20 rounded-full border-4 border-orange-500 border-t-transparent flex items-center justify-center"
            >
              <Zap className="h-10 w-10 text-orange-500 fill-orange-500" />
            </motion.div>
            <div className="text-center">
              <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter uppercase">AI Analyzing...</h3>
              <p className="text-zinc-500 font-medium">Crunching customer reviews & forecasting demand</p>
            </div>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              transition={{ duration: 4 }}
              className="h-2 bg-orange-100 dark:bg-orange-900/30 rounded-full overflow-hidden"
            >
              <motion.div 
                animate={{ x: [-200, 200] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="h-full w-1/2 bg-orange-600 rounded-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CardHeader className="space-y-1 bg-orange-50/80 dark:bg-orange-900/10 border-b border-orange-100 dark:border-orange-900/20 px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <CardTitle className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              Analyze Product
            </CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-400 font-medium">
              Professional inventory intelligence for your store.
            </CardDescription>
          </div>
          <Button 
            type="button"
            variant="ghost" 
            className="text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/20 font-bold h-12 px-6 rounded-2xl transition-all"
            onClick={(e) => {
              e.preventDefault();
              router.push("/products");
            }}
          >
            <Search className="h-5 w-5 mr-2" />
            Catalog
          </Button>
        </div>
      </CardHeader>
      
      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="p-8">
          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 border border-red-100 dark:border-red-900/30">
              <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <label htmlFor="productSelect" className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Database Select
                </label>
                <div className="relative">
                  <select
                    id="productSelect"
                    value={selectedProductId}
                    onChange={(e) => handleProductSelect(e.target.value)}
                    disabled={isLoading || isFetching}
                    className="w-full h-14 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 text-sm font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Manual Entry</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                    {isFetching ? <Loader2 className="h-5 w-5 animate-spin" /> : <ChevronRight className="h-5 w-5 rotate-90" />}
                  </div>
                </div>
                
                {isRealData && (
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-600 text-white border-none text-[10px] font-black px-2 py-1 rounded-md">
                      CURATED DATA
                    </Badge>
                    {formData.category && (
                      <Badge variant="outline" className="text-[10px] font-bold border-zinc-200 dark:border-zinc-800 text-zinc-400 uppercase tracking-wider">
                        {formData.category}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-6 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                <div className="space-y-3">
                  <label htmlFor="productName" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                    Product Name
                  </label>
                  <Input
                    id="productName"
                    placeholder="e.g. UltraVision 4K"
                    required
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="h-14 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-orange-500 font-semibold px-5"
                  />
                </div>
                <div className="space-y-3">
                  <label htmlFor="currentStock" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                    Current Stock Units
                  </label>
                  <Input
                    id="currentStock"
                    type="number"
                    placeholder="0"
                    required
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                    className="h-14 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-orange-500 font-semibold px-5"
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex justify-between items-center">
                <label htmlFor="customerReviews" className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Customer Reviews
                </label>
                <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded">AI Source</span>
              </div>
              <Textarea
                id="customerReviews"
                placeholder="Paste each customer review on a new line..."
                required
                value={formData.customerReviews}
                onChange={(e) => setFormData({ ...formData, customerReviews: e.target.value })}
                className="min-h-[380px] rounded-3xl bg-zinc-50/50 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-orange-500 p-6 text-sm leading-relaxed resize-none font-medium scrollbar-thin scrollbar-thumb-orange-200 dark:scrollbar-thumb-orange-900"
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-900 p-8">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full lg:w-max mx-auto"
          >
            <Button 
              type="submit" 
              className="w-full lg:w-max h-16 px-12 text-xl font-black uppercase tracking-[0.2em] bg-orange-600 hover:bg-orange-700 text-white dark:bg-orange-500 dark:hover:bg-orange-600 transition-all shadow-2xl shadow-orange-500/30 rounded-2xl flex items-center gap-4 group" 
              disabled={isLoading}
            >
              <Zap className="h-6 w-6 group-hover:animate-pulse" />
              Analyze Inventory
            </Button>
          </motion.div>
        </CardFooter>
      </form>
    </Card>
  )
}
