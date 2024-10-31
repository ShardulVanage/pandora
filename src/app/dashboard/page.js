'use client'

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { client } from '@/lib/pocketbase';
import BlogList from './components/BlogList';

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
    return <div className="text-center mt-8">Loading...</div>;
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
        <p className="text-center">You haven&rsquo;t created any blogs yet.</p>
      )}
    </div>
  );
}