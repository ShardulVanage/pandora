"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AnimatedLogo({
  className,
  words = "PANDORA",
  delay = 0.05,
}) {
  const letters = words.split("");

  const pullupVariant = {
    initial: { y: 100, opacity: 0 },
    animate: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * delay,
      },
    }),
  };

  const gradientVariant = {
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      transition: {
        duration: 3,
        ease: "linear",
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="flex mx-3">
      {letters.map((letter, i) => (
        <motion.h1
          key={i}
          variants={pullupVariant}
          initial="initial"
          animate="animate"
          custom={i}
          className={cn("", className)}
        >
          {letter === "O" ? (
            <motion.span
              variants={gradientVariant}
              animate="animate"
              className="inline-block bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent bg-[length:200%]"
            >
              {letter}
            </motion.span>
          ) : letter === " " ? (
            <span>&nbsp;</span>
          ) : (
            letter
          )}
        </motion.h1>
      ))}
    </div>
  );
}
