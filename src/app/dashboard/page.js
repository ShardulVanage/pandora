'use client'

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { client } from '@/lib/pocketbase';
import BlogList from './components/BlogList';
import { FileUpload } from '@/components/ui/file-upload';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Dashboard() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserBlogs() {
      if (user) {
        try {
          const records = await client.collection('Blogs').getList(1, 50, {
            filter: `author = "${user.id}"`,
          });
          setBlogs(records.items);
        } catch (error) {
          console.error('Error fetching blogs:', error);
          setError('Failed to fetch blogs. Please try again later.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    fetchUserBlogs();
  }, [user]);
 
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-0">
              <Skeleton className="h-4 w-24" /> {/* Publication label */}
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" /> {/* Image placeholder */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" /> {/* Title */}
                <Skeleton className="h-4 w-full" /> {/* First line of description */}
                <Skeleton className="h-4 w-2/3" /> {/* Second line of description */}
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Skeleton className="h-10 w-32" /> {/* View Full Blog button */}
              <Skeleton className="h-8 w-8 rounded-full" /> {/* Edit icon */}
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Blogs</h1>
      {blogs.length > 0 ? (
        <BlogList blogs={blogs} />
      ) : (
        <Link href="/dashboard/create-blog">
         <FileUpload/>
        </Link>
      )}
    </div>
  );
}