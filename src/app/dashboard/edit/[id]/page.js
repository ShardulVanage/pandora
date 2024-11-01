'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { client } from '@/lib/pocketbase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import RichTextEditor from './components/RichTextEditor';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

export default function Page() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBlog, setCurrentBlog] = useState(null);
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({ levels: [1, 2, 3] }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: currentBlog?.content || '',
    onUpdate: ({ editor }) => {
      setCurrentBlog(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    async function fetchUserBlogs() {
      if (user) {
        try {
          const records = await client.collection('Blogs').getList(1, 50, {
            filter: `author = "${user.id}"`,
          });
          setBlogs(records.items);
          if (records.items.length > 0) {
            setCurrentBlog(records.items[0]);
          }
        } catch (error) {
          console.error('Error fetching blogs:', error);
          setError('Failed to fetch blogs. Please try again later.');
          toast({
            title: "Error",
            description: "Failed to fetch blogs. Please try again later.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    fetchUserBlogs();
  }, [user, toast]);

  useEffect(() => {
    if (editor && currentBlog) {
      editor.commands.setContent(currentBlog.content);
    }
  }, [currentBlog, editor]);

  const handleInputChange = (e) => {
    setCurrentBlog({ ...currentBlog, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedBlog = await client.collection('Blogs').update(currentBlog.id, currentBlog);
      setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog));
      toast({
        title: "Success",
        description: "Blog updated successfully!",
      });
    } catch (error) {
      console.error('Error updating blog:', error);
      setError('Failed to update blog. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to update blog. Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (loading) return <BlogSkeleton />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!currentBlog) return <div className="text-center">No blogs found.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Update Your Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Edit Blog</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={currentBlog.title}
                  onChange={handleInputChange}
                  placeholder="Title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={currentBlog.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="img">Image URL</Label>
                <Input
                  id="img"
                  name="img"
                  value={currentBlog.img}
                  onChange={handleInputChange}
                  placeholder="Image URL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={currentBlog.category}
                  onChange={handleInputChange}
                  placeholder="Category"
                />
              </div>
              
              <RichTextEditor editor={editor}/>
            
              <Button type="submit">Update Blog</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current Blog Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[700px] overflow-y-auto">
            <div>
              <h1 className="text-4xl font-bold mb-6">{currentBlog.title}</h1>
              <p className="text-lg mb-4">{currentBlog.description}</p>
              <div className="flex flex-row justify-between items-center text-sm sm:text-base">
                <p className="mt-6 leading-8 text-gray-500">
                  {new Date(currentBlog.created).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <hr className="my-4 bg-background" />
              {currentBlog.img && (
                <div className="relative w-full max-w-3xl mx-auto h-[400px] mb-8">
                  <img
                    src={currentBlog.img}
                    alt={currentBlog.title}
                    className="object-cover w-full h-full rounded-lg bg-white"
                  />
                </div>
              )}
              <div className="prose max-w-3xl mx-auto text-foreground prose-strong:text-foreground prose-headings:text-foreground">
                <div dangerouslySetInnerHTML={{ __html: currentBlog.content }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Your Blogs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {blogs.map(blog => (
            <Card 
              key={blog.id} 
              className={`cursor-pointer ${blog.id === currentBlog.id ? 'border-primary' : ''}`}
              onClick={() => setCurrentBlog(blog)}
            >
              <CardHeader>
                <CardTitle>{blog.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  {new Date(blog.created).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function BlogSkeleton() {
  return (
    <div className="container mx-auto p-4">
      <Skeleton className="h-8 w-64 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}