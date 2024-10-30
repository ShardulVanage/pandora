'use client'

import { useEffect, useState } from 'react';
import { client } from '@/lib/pocketbase';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AllBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAllBlogs() {
      try {
        const records = await client.collection('Blogs').getFullList({
          sort: '-created',
        });
        setBlogs(records);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to fetch blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchAllBlogs();
  }, []);
  console.log(blogs)
  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">All Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Card key={blog.id} className="w-full">
            <CardHeader>
              <CardTitle className="text-xl font-bold">{blog.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-48 mb-4">
                {blog.img && (
                  <Image
                    src={blog.img}
                    alt={blog.title}
                    fill
                    className="object-cover rounded-md"
                  />
                )}
              </div>
              <CardDescription className="text-sm text-gray-600 line-clamp-3">
                {blog.description}
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Link href={`/blog/${blog.id}`} className="text-blue-600 hover:underline">
                Read More
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}