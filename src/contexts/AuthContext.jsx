"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { client } from "@/lib/pocketbase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();

    client.authStore.onChange(() => {
      checkUser();
    });
  }, []);

  const checkUser = () => {
    try {
      const isValid = client.authStore.isValid;
      const model = client.authStore.model;
      setUser(isValid ? model : null);
    } catch (error) {
      setUser(null);
    }
    setLoading(false);
  };

  const register = async (email, password, passwordConfirm) => {
    try {
      const userData = {
        email,
        password,
        passwordConfirm,
      };

      const record = await client.collection("users").create(userData);
      const authData = await client
        .collection("users")
        .authWithPassword(email, password);

      setUser(authData.record);
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully",
      });
      router.push("/dashboard");
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: error?.message || "Failed to create account",
      });
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const authData = await client
        .collection("users")
        .authWithPassword(email, password);

      setUser(authData.record);
      toast({
        title: "Welcome Back",
        description: "you have login in successfully",
      });
      router.push("/dashboard");
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to login",
      });
      return false;
    }
  };

  const authWithOAuth = async (provider) => {
    return new Promise((resolve) => {
      let authWindow = null;
      let intervalId = null;

      try {
        client
          .collection("users")
          .authWithOAuth2({
            provider,
            createData: {
              emailVisibility: true,
            },
            onResponse: async (oauth2Response) => {
              if (intervalId) {
                clearInterval(intervalId);
              }

              if (oauth2Response?.record) {
                setUser(oauth2Response.record);
                toast({
                  title: "Welcome!",
                  description: `Successfully signed in with ${provider}`,
                });
                router.push("/dashboard");
                resolve(true);
              } else {
                resolve(false);
              }
            },
            beforeOpen: (url) => {
              // Store the window reference
              authWindow = window.open(url, "oauth", "width=600,height=800");

              // Check if window is closed periodically
              intervalId = setInterval(() => {
                if (authWindow?.closed) {
                  clearInterval(intervalId);
                  toast({
                    variant: "default",
                    title: "Authentication Cancelled",
                    description: "Sign in process was cancelled",
                  });
                  resolve(false);
                }
              }, 500);
            },
          })
          .catch((error) => {
            console.error("OAuth error:", error);
            toast({
              variant: "destructive",
              title: "Authentication Error",
              description:
                error?.message || `Failed to sign in with ${provider}`,
            });
            resolve(false);
          });
      } catch (error) {
        console.error("OAuth error:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "An unexpected error occurred",
        });
        resolve(false);
      }
    });
  };

  const logout = async () => {
    client.authStore.clear();
    setUser(null);
    toast({
      title: "Success",
      description: "you have logout successfully",
    });
    router.push("/");
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    authWithOAuth,
    isAuthenticated: !!user,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};
