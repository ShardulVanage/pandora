"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export function UserAuthForm({ className, ...props }) {
  const { login, authWithOAuth } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingProvider, setLoadingProvider] = React.useState(null);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  // Reset loading state when component unmounts
  React.useEffect(() => {
    return () => {
      setLoadingProvider(null);
    };
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setLoadingProvider(provider);

    // Set up a timeout to reset the loading state
    const timeoutId = setTimeout(() => {
      setLoadingProvider(null);
    }, 6000); // Reset after 1 minute max

    try {
      const success = await authWithOAuth(provider);
      clearTimeout(timeoutId);
      if (!success) {
        setLoadingProvider(null);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      setLoadingProvider(null);
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid gap-1 py-3">
            <Label className="" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Enter your password"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              disabled={isLoading}
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !formData.email || !formData.password}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </div>
        <p className="px-8 pt-2 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href={"/Sign-up"} className="font-semibold text-foreground">
            Sign up
          </Link>{" "}
        </p>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        onClick={() => handleOAuthLogin("github")}
      >
        {loadingProvider === "github" ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        GitHub
      </Button>
      <Button
        variant="outline"
        type="button"
        onClick={() => handleOAuthLogin("google")}
      >
        {loadingProvider === "google" ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  );
}
