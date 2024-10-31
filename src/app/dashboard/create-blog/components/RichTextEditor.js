import React, { useState } from 'react'
import { Editor, EditorContent } from '@tiptap/react'
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
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const ToolbarButton = ({ onClick, children, isActive = false }) => (
  <Button
    variant="ghost"
    size="sm"
    className={`h-8 w-8 p-0 ${isActive ? 'bg-muted' : ''}`}
    onClick={onClick}
  >
    {children}
  </Button>
)

const ToolbarDivider = () => <div className="w-px h-6 bg-border" />



export default function RichTextEditor({ editor }) {
  const [codeContent, setCodeContent] = useState('')
  const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false)
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  const handleCodeSubmit = () => {
    if (editor) {
      editor.chain().focus().setContent(codeContent, {
        parseOptions: { preserveWhitespace: true },
      }).run()
      setIsCodeDialogOpen(false)
    }
  }

  const handleLinkSubmit = () => {
    if (editor) {
      if (linkUrl === '') {
        editor.chain().focus().unsetLink().run()
      } else {
        editor.chain().focus().setLink({ href: linkUrl }).run()
      }
      setIsLinkDialogOpen(false)
      setLinkUrl('')
    }
  }

  const handleHeadingChange = (value) => {
    if (editor) {
      switch (value) {
        case 'h1':
          editor.chain().focus().toggleHeading({ level: 1 }).run()
          break
        case 'h2':
          editor.chain().focus().toggleHeading({ level: 2 }).run()
          break
        case 'h3':
          editor.chain().focus().toggleHeading({ level: 3 }).run()
          break
        default:
          editor.chain().focus().setParagraph().run()
      }
    }
  }

  const getCurrentTextStyle = () => {
    if (!editor) return 'paragraph'
    if (editor.isActive('heading', { level: 1 })) return 'h1'
    if (editor.isActive('heading', { level: 2 })) return 'h2'
    if (editor.isActive('heading', { level: 3 })) return 'h3'
    return 'paragraph'
  }

  const insertTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  if (!editor) {
    return null
  }

  return (
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
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
          >
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
          >
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
          >
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
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
                className={`h-8 w-8 p-0 ${editor.isActive('link') ? 'bg-muted' : ''}`}
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
                  {editor.isActive('link') ? 'Update Link' : 'Add Link'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <ToolbarButton onClick={insertTable}>
            <TableIcon className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton onClick={() => editor.chain().focus().indent().run()}>
            <Indent className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().outdent().run()}>
            <Outdent className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton onClick={() => document.documentElement.requestFullscreen()}>
            <Maximize2 className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <EditorContent  editor={editor} />
      </div>
    </div>
  )
}