// contexts/AuthContext.jsx
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
      // First create the user
      const userData = {
        email,
        password,
        passwordConfirm,
      };

      const record = await client.collection("users").create(userData);

      // After successful registration, log the user in
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
