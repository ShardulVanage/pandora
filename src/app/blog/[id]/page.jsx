"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { client } from "@/lib/pocketbase";
import Image from "next/image";

export default function BlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }, []);
  useEffect(() => {
    async function fetchBlog() {
      try {
        const record = await client.collection("Blogs").getOne(id);
        setBlog(record);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError("Failed to fetch the blog post. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [id]);
  console.log(blog);
  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (!blog) {
    return <div className="text-center mt-8">Blog post not found.</div>;
  }

  return (
    <div className="container max-w-3xl  mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>
      <p className="text-lg mb-4">{blog.description}</p>
      <div className="flex flex-row justify-between items-center text-sm sm:text-base">
        <p className="mt-6  leading-8 text-gray-500 ">
          {new Date(blog.created).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      <hr className="my-4 bg-background" />
      {blog.img && (
        <div className="relative w-full max-w-3xl mx-auto h-[400px] mb-8">
          <Image
            src={blog.img}
            alt={blog.title}
            fill
            className="object-fit rounded-lg bg-white"
          />
        </div>
      )}
      <div className="prose max-w-3xl mx-auto text-foreground prose-strong:text-foreground   prose-headings:text-foreground">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} className="" />
      </div>
    </div>
  );
}
