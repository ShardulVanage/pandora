"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const shapeVariants = {
  rectangle: { borderRadius: "16px", rotate: 0 },
  circle: { borderRadius: "50%", rotate: 60 },
  hexagon: { borderRadius: "24% 76% 24% 76% / 32% 32% 68% 68%", rotate: 120 },
  triangle: {
    borderRadius: "540% 150% 550% 130% / 300% 400% 120% 600%",
    rotate: 180,
  },
  pentagon: { borderRadius: "50% 20% 50% 20% / 25% 75% 25% 75%", rotate: 240 },
  star: { borderRadius: "50% 0% 50% 0% / 50% 0% 50% 100%", rotate: 300 },
};

const MorphingCard = ({
  width = "300px",
  height = "300px",
  contents,
  colorScheme = { from: "#4F46E5", to: "#7C3AED" },
  autoPlay = true,
  interval = 3000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const nextShape = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % contents.length);
  }, [contents.length]);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(nextShape, interval);
    }
    return () => clearInterval(timer);
  }, [isPlaying, interval, nextShape]);

  const currentContent = contents[currentIndex];

  return (
    <div className="relative" style={{ width, height }}>
      <motion.div
        className="absolute inset-0 cursor-pointer overflow-hidden rounded-2xl shadow-lg opacity-50 bg-primary "
        style={{
          backdropFilter: "blur(10px)",
        }}
        animate={shapeVariants[currentContent.shape]}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* This empty div will handle the shape morphing */}
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="w-full h-full p-6 flex flex-col justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-5xl font-semibold text-primary mb-4 text-center">
              {currentContent.title}
            </h3>
            <p className="text-xl text-primary text-center">
              {currentContent.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-1">
        {contents.map((_, index) => (
          <motion.div
            key={index}
            className="h-1 w-3 rounded-full bg-white"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: index === currentIndex ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
      {/* <button
        className="absolute bottom-4 right-4 rounded-full bg-white/10 p-2 text-gray-800 hover:bg-white/20"
        onClick={(e) => {
          e.stopPropagation();
          nextShape();
        }}
      >
        <ArrowRight size={14} className="text-primary" />
      </button> */}
    </div>
  );
};

export default MorphingCard;
