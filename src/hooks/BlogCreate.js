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
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Link2,
  Table as TableIcon,
  Indent,
  Outdent,
  Maximize2,
  Type,
  ChevronDown,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const ToolbarButton = ({ onClick, children, isActive = false }) => (
  <Button
    variant="ghost"
    size="sm"
    className={`h-8 w-8 p-0 ${isActive ? 'bg-muted' : ''}`}
    onClick={onClick}
  >
    {children}
  </Button>
);

const ToolbarDivider = () => <div className="w-px h-6 bg-border" />;

export default function CreateBlogForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeContent, setCodeContent] = useState('');
  const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

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
  });

  const handleCodeSubmit = () => {
    if (editor) {
      editor.chain().focus().setContent(codeContent, {
        parseOptions: { preserveWhitespace: true },
      }).run();
      setIsCodeDialogOpen(false);
    }
  };

  const handleLinkSubmit = () => {
    if (editor) {
      if (linkUrl === '') {
        editor.chain().focus().unsetLink().run();
      } else {
        editor.chain().focus().setLink({ href: linkUrl }).run();
      }
      setIsLinkDialogOpen(false);
      setLinkUrl('');
    }
  };

  const handleHeadingChange = (value) => {
    if (editor) {
      switch (value) {
        case 'h1':
          editor.chain().focus().toggleHeading({ level: 1 }).run();
          break;
        case 'h2':
          editor.chain().focus().toggleHeading({ level: 2 }).run();
          break;
        case 'h3':
          editor.chain().focus().toggleHeading({ level: 3 }).run();
          break;
        default:
          editor.chain().focus().setParagraph().run();
      }
    }
  };

  const getCurrentTextStyle = () => {
    if (!editor) return 'paragraph';
    if (editor.isActive('heading', { level: 1 })) return 'h1';
    if (editor.isActive('heading', { level: 2 })) return 'h2';
    if (editor.isActive('heading', { level: 3 })) return 'h3';
    return 'paragraph';
  };

  const insertTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

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

          <div className="space-y-2">
            <Label>Content</Label>
            <div className="border rounded-lg shadow-sm bg-background">
              <div className="border-b p-1 flex items-center gap-0.5 flex-wrap">
                <Select value={getCurrentTextStyle()} onValueChange={handleHeadingChange}>
                  <SelectTrigger className="h-8 w-[130px] gap-1">
                    <Type className="h-4 w-4" />
                    <SelectValue placeholder="Style" />
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paragraph">Paragraph</SelectItem>
                    <SelectItem value="h1">Heading 1</SelectItem>
                    <SelectItem value="h2">Heading 2</SelectItem>
                    <SelectItem value="h3">Heading 3</SelectItem>
                  </SelectContent>
                </Select>

                <ToolbarDivider />

                <ToolbarButton
                  onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                  isActive={editor?.isActive({ textAlign: 'left' })}
                >
                  <AlignLeft className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                  isActive={editor?.isActive({ textAlign: 'center' })}
                >
                  <AlignCenter className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                  isActive={editor?.isActive({ textAlign: 'right' })}
                >
                  <AlignRight className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarDivider />

                <ToolbarButton
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  isActive={editor?.isActive('bold')}
                >
                  <Bold className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  isActive={editor?.isActive('italic')}
                >
                  <Italic className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarDivider />

                <ToolbarButton
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  isActive={editor?.isActive('bulletList')}
                >
                  <List className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  isActive={editor?.isActive('orderedList')}
                >
                  <ListOrdered className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarDivider />

                <Dialog open={isCodeDialogOpen} onOpenChange={setIsCodeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Code2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                      <DialogTitle>Edit HTML Code</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Textarea
                        value={codeContent}
                        onChange={(e) => setCodeContent(e.target.value)}
                        className="font-mono"
                        rows={10}
                        placeholder="Enter your HTML code here..."
                      />
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCodeSubmit}>Done</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`h-8 w-8 p-0 ${editor?.isActive('link') ? 'bg-muted' : ''}`}
                    >
                      <Link2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Link</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="url">URL</Label>
                        <Input
                          id="url"
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleLinkSubmit}>
                        {editor?.isActive('link') ? 'Update Link' : 'Add Link'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <ToolbarButton onClick={insertTable}>
                  <TableIcon className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarDivider />

                <ToolbarButton onClick={() => editor?.chain().focus().indent().run()}>
                  <Indent className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor?.chain().focus().outdent().run()}>
                  <Outdent className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarDivider />

                <ToolbarButton onClick={() => document.documentElement.requestFullscreen()}>
                  <Maximize2 className="h-4 w-4" />
                </ToolbarButton>
              </div>

              <EditorContent editor={editor} />
            </div>
          </div>

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