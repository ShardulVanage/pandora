"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BlogPostCard = ({ title, description, imageUrl }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="overflow-hidden border-none shadow-lg">
      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
        <Image
          src={imageUrl}
          alt={title}
          width={400}
          height={200}
          className="object-cover w-full h-48"
        />
      </motion.div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="ghost"
          className="w-full text-primary hover:text-primary-foreground hover:bg-primary transition-colors duration-200"
        >
          Read More
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
);

const blogPosts = [
  {
    title: "UI/UX Review Check",
    description:
      'The place is close to Barceloneta Beach and bus stop just 2 min by walk and near to "Naviglio" where you can enjoy the main night life in Barcelona.',
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    title: "Boost Your Conversion Rate",
    description:
      "Learn how to improve your website's conversion rate with these simple yet effective strategies.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    title: "The Future of Web Design",
    description:
      "Explore the latest trends and technologies shaping the future of web design and development.",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  // Add more blog posts as needed
];

export default function BlogGrid() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Latest Blog Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post, index) => (
          <BlogPostCard key={index} {...post} />
        ))}
      </div>
    </div>
  );
}
