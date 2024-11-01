import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import AnimatedGridPattern from "./ui/AnimatedGridPattern";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bookmark, TrendingUp } from "lucide-react";
import AnimatedLogo from "@/components/ui/letter-pullup";

function Hero() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden rounded-lg  bg-background px-4 py-20 ">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)] fixed",
          "inset-x-0 inset-y-[-50%] h-[200%] skew-y-12"
        )}
      />
      <div className="z-10 flex max-w-4xl flex-col items-center text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl inline-flex">
          Welcome to <AnimatedLogo />
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Explore the depths of knowledge, uncover hidden gems, and embark on a
          journey of discovery through our curated articles and insights.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/blog">
              Start Reading <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/subscribe">Subscribe</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function FeaturedCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-center text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default Hero;
