"use client"

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PencilIcon, ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function BlogCard({ blog }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-sm overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="relative p-0">
          <div className="relative w-full h-56 overflow-hidden">
            {blog.img ? (
              <motion.div
               
              >
                <img
                  src={blog.img}
                  alt={blog.title}
                  
                  className="object-fit  bg-white"
                />
              </motion.div>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
          <div className="absolute top-2 left-2">
            <Badge variant="outline" className="text-xs font-semibold text-background bg-foreground border-0 drop-shadow-md ">
              {blog.category || 'Uncategorized'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <CardTitle className="text-2xl font-bold mb-2 line-clamp-2">{blog.title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground line-clamp-3">
            {blog.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-between items-center p-6 pt-0">
          <Link href={`/blog/${blog.id}`} passHref>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="default" className="group">
                View Full Blog
                <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </Link>
          <Link href={`dashboard/edit/${blog.id}`} passHref>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              
                <PencilIcon className="w-4 h-4" />
                <span className="sr-only">Edit</span>
              
            </motion.div>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}