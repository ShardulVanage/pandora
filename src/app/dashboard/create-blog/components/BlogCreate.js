"use client";

import { useState } from "react";
import { client } from "@/lib/pocketbase";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TextAlign from '@tiptap/extension-text-align'
import RichTextEditor from './RichTextEditor'


export default function CreateBlogForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-4',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '<p>Start writing something amazing...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] px-4 py-2',
      },
    },
  })

  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !description || !editor?.getHTML()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    setLoading(true);

    try {
      const blogData = {
        title: title,
        description: description,
        img: imgUrl,
        content: editor.getHTML(),
        author: user.id // Using the user's ID for the relation
      };

      await client.collection('Blogs').create(blogData);

      toast({
        title: "Success",
        description: "Blog post created successfully!",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error('Creation error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to create blog post",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Blog Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter blog description"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imgUrl">Image URL</Label>
            <Input
              id="imgUrl"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              placeholder="Enter image URL"
              type="url"
            />
          </div>

               <RichTextEditor editor={editor} />


          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                <span>Creating...</span>
              </div>
            ) : (
              "Create Post"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}