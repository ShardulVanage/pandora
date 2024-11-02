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
  const { register, authWithOAuth } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [oAuthLoading, setOAuthLoading] = React.useState({
    github: false,
    google: false,
  });
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    passwordConfirm: "",
  });

  // Refs to store timeouts
  const timeoutRefs = React.useRef({
    github: null,
    google: null,
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Function to clear timeout for a specific provider
  const clearProviderTimeout = (provider) => {
    if (timeoutRefs.current[provider]) {
      clearTimeout(timeoutRefs.current[provider]);
      timeoutRefs.current[provider] = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(
        formData.email,
        formData.password,
        formData.passwordConfirm
      );
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider) => {
    // Clear any existing timeout for this provider
    clearProviderTimeout(provider);

    setOAuthLoading((prev) => ({ ...prev, [provider]: true }));

    // Set timeout to reset loading state after 6 seconds
    timeoutRefs.current[provider] = setTimeout(() => {
      setOAuthLoading((prev) => ({ ...prev, [provider]: false }));
    }, 6000); // 6 seconds timeout

    try {
      const success = await authWithOAuth(provider);
      if (!success) {
        // Clear timeout and reset loading state if auth was not successful
        clearProviderTimeout(provider);
        setOAuthLoading((prev) => ({ ...prev, [provider]: false }));
      }
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      clearProviderTimeout(provider);
      setOAuthLoading((prev) => ({ ...prev, [provider]: false }));
    }
  };

  // Cleanup effect
  React.useEffect(() => {
    return () => {
      // Clear all timeouts when component unmounts
      Object.keys(timeoutRefs.current).forEach((provider) => {
        clearProviderTimeout(provider);
      });
      // Reset loading states
      setOAuthLoading({ github: false, google: false });
    };
  }, []);

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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Create a password"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              disabled={isLoading}
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid gap-1 pb-3">
            <Label htmlFor="passwordConfirm">Confirm Password</Label>
            <Input
              id="passwordConfirm"
              placeholder="Confirm your password"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              disabled={isLoading}
              value={formData.passwordConfirm}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={
              isLoading ||
              !formData.email ||
              !formData.password ||
              !formData.passwordConfirm ||
              formData.password !== formData.passwordConfirm
            }
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Account
          </Button>
        </div>
        <p className="px-8 pt-2 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/Sign-in" className="font-semibold text-foreground">
            Sign in
          </Link>
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
        disabled={oAuthLoading.github}
        onClick={() => handleOAuthSignIn("github")}
      >
        {oAuthLoading.github ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        GitHub
      </Button>
      <Button
        variant="outline"
        type="button"
        disabled={oAuthLoading.google}
        onClick={() => handleOAuthSignIn("google")}
      >
        {oAuthLoading.google ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  );
}
