'use client'

import { useEffect, useState } from 'react'
import { client } from '@/lib/pocketbase'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, CalendarIcon, UserIcon } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"

const MotionCard = motion(Card)

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { scale: 1.04, transition: { duration: 0.3 } }
}

const imageVariants = {
  hover: { scale: 1.1, transition: { duration: 0.3 } }
}

export default function AllBlogsPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchAllBlogs() {
      try {
        const records = await client.collection('Blogs').getFullList({
          sort: '-created',
        })
        setBlogs(records)
      } catch (error) {
        console.error('Error fetching blogs:', error)
        setError('Failed to fetch blogs. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchAllBlogs()
  }, [])

  const renderSkeletons = () => {
    return Array(6).fill(0).map((_, index) => (
      <Card key={`skeleton-${index}`} className="w-full overflow-hidden">
        <CardHeader className="p-0">
          <Skeleton className="h-56 w-full" />
        </CardHeader>
        <CardContent className="p-6">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    ))
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h1 
        className="text-5xl font-bold mb-12 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Explore Our Blogs
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? renderSkeletons() : blogs.map((blog, index) => (
          <MotionCard 
            key={blog.id} 
            className="w-full overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ delay: index * 0.1 }}
          >
            <CardHeader className="relative p-0">
              <motion.div 
                className="relative w-full h-56 overflow-hidden"
                
              >
                {blog.img ? (
                  <Image
                    src={blog.img}
                    alt={blog.title}
                    fill
                    className="object-fit bg-white"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </motion.div>
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle className="text-2xl font-bold mb-2 line-clamp-2">{blog.title}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground  mb-4">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span>{new Date(blog.created).toLocaleDateString()}</span>
                <UserIcon className="w-4 h-4 ml-4 mr-2" />
                <span>{blog.author || 'Anonymous'}</span>
              </div>
              <CardDescription className="text-sm text-muted-foreground line-clamp-3">
                {blog.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Link href={`/blog/${blog.id}`} passHref>
                <Button variant="default" className="w-full group">
                  Read More
                  <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardFooter>
          </MotionCard>
        ))}
      </div>
    </div>
  )
}