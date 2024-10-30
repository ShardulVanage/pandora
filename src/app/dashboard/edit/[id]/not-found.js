import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-4xl font-bold">Blog Not Found</h1>
      <p className="text-muted-foreground text-lg">The blog post you're looking for doesn't exist or you don't have permission to edit it.</p>
      <Button asChild>
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>
    </main>
  )
}