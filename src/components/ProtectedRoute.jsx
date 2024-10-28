// components/ProtectedRoute.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { client } from "@/lib/pocketbase";
import { useToast } from "@/hooks/use-toast";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const isValid = client.authStore.isValid;

    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please login to access this page",
      });
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
