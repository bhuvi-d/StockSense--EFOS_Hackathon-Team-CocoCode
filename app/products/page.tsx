"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, Package, ArrowRight, Loader2, Database } from "lucide-react"
import { motion } from "framer-motion"

interface Product {
  id: string
  name: string
  category: string
  reviewCount: number
}

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = React.useState<Product[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setIsLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch products:", err)
        setIsLoading(false)
      })
  }, [])

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleProductSelect = (id: string) => {
    router.push(`/?productId=${id}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
          <p className="text-zinc-500 font-medium">Accessing Database...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-8">
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Inventory <span className="text-orange-600 dark:text-orange-400">Database</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
          >
            Select from our curated list of products to run instant sentiment and demand analysis.
          </motion.p>
        </div>

        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <Input 
            placeholder="Search catalog..."
            className="pl-12 h-14 text-lg rounded-2xl shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-orange-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              whileHover={{ y: -5 }}
              onClick={() => handleProductSelect(product.id)}
              className="cursor-pointer"
            >
              <Card className="h-full border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 hover:shadow-2xl transition-all group overflow-hidden rounded-2xl">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                      <Package className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 text-[10px] uppercase font-bold tracking-wider">
                      {product.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mt-4 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {product.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mt-2 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Reviews</span>
                      <span className="text-lg font-bold text-zinc-700 dark:text-zinc-300">{product.reviewCount}</span>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center group-hover:bg-orange-600 transition-all shadow-sm">
                      <ArrowRight className="h-5 w-5 text-zinc-400 group-hover:text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-zinc-100 dark:bg-zinc-900">
              <Search className="h-10 w-10 text-zinc-300" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">No products found</h3>
            <p className="text-zinc-500">Try adjusting your search terms or filters.</p>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 pt-8 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          <Database className="h-3 w-3" />
          <span>Curated Product Dataset</span>
        </div>
      </div>
    </main>
  )
}
