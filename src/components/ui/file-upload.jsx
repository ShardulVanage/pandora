"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";

const gridVariants = {
  initial: {
    opacity: 0.4,
    scale: 0.98,
  },
  hover: {
    opacity: 0.5,
    scale: 1,
  },
};

const buttonVariants = {
  initial: {
    y: 0,
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  hover: {
    y: -5,
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
};

const iconVariants = {
  initial: { rotate: 0 },
  hover: {
    rotate: 90,
    transition: { type: "spring", stiffness: 200, damping: 10 },
  },
};

export const FileUpload = ({ onChange }) => {
  const fileInputRef = useRef(null);

  const handleCreateBlog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-sm p-8 bg-background overflow-hidden">
      <motion.div
        onClick={handleCreateBlog}
        className="relative cursor-pointer"
        initial="initial"
        whileHover="hover"
      >
        <motion.div className="absolute inset-0 z-0" variants={gridVariants}>
          <div className="relative hidden h-full flex-col  border-4 p-10 text-primary lg:flex ">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat p-2"
              style={{
                backgroundImage: `url('https://res.cloudinary.com/dtsuvx8dz/image/upload/v1729578216/yzqddqsqyqxrdivm8wqk.svg')`,
              }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden dark:block p-2 "
                style={{
                  backgroundImage: `url('https://res.cloudinary.com/dtsuvx8dz/image/upload/v1729578474/zovuxh6cbtgwmbbqryns.svg')`,
                }}
              />
            </div>
          </div>
        </motion.div>
        <motion.div
          className="relative z-10  rounded-xl p-8"
          variants={buttonVariants}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <motion.div
              className="bg-foreground rounded-full p-4"
              variants={iconVariants}
            >
              <PlusIcon className="w-8 h-8 text-background" />
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground">Create Blog</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-[200px]">
              Click here to start your new blog post and share your ideas with
              the world
            </p>
          </div>
        </motion.div>
      </motion.div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onChange}
        className="hidden"
        accept="image/*"
      />
    </Card>
  );
};

const GridPattern = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      fill="none"
    >
      <defs>
        <pattern
          id="smallGrid"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 8 0 L 0 0 0 8"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.04"
            strokeWidth="0.5"
          />
        </pattern>
        <pattern
          id="largeGrid"
          width="32"
          height="32"
          patternUnits="userSpaceOnUse"
        >
          <rect width="32" height="32" fill="url(#smallGrid)" />
          <path
            d="M 32 0 L 0 0 0 32"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#largeGrid)" />
    </svg>
  );
};
