// app/(protected)/layout.js
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { client } from "@/lib/pocketbase";

export default async function ProtectedLayout({ children }) {
  const headersList = headers();
  const cookies = headersList.get("cookie") || "";
  
  // Check if auth cookie exists
  if (!cookies.includes("pb_auth=")) {
    redirect("/login");
  }

  return <>{children}</>;
}