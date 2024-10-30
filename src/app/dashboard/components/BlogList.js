import Link from 'next/link';
import BlogCard from './BlogCard';
import CreateBlogForm from '../create-blog/components/BlogCreate';
import { FileUpload } from '@/components/ui/file-upload';
export default function BlogList({ blogs }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Link href="/dashboard/create-blog">
         <FileUpload/>
      </Link>
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}