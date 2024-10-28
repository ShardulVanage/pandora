// app/dashboard/page.js
"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { client } from "@/lib/pocketbase";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Welcome, {client.authStore.model?.email}</p>
        {/* Your dashboard content */}
      </div>
    </ProtectedRoute>
  );
}