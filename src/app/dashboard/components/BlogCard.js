import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PencilIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BlogCard({ blog }) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{blog.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-48 mb-4">
          <Image
            src={blog.img}
            alt={blog.title}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <CardDescription className="text-sm text-gray-600 line-clamp-3">
          {blog.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/blog/${blog.id}`}>
          <Button variant="secondary">Read More</Button>
        </Link>
        <Link href={`dashboard/edit/${blog.id}`}>
          <Button variant="outline" className="flex items-center gap-2">
            <PencilIcon className="w-4 h-4" />
            Edit
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}