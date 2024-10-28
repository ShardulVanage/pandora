// components/LogoutButton.jsx
"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Button onClick={logout} variant="outline">
      Logout
    </Button>
  );
}
