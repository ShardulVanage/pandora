// middleware.js
import { NextResponse } from "next/server";

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Define public paths
  const isPublicPath = path === "/login" || path === "/register";
  
  // Get auth cookie
  const hasPBAuth = request.cookies.has("pb_auth");

  // Redirect authenticated users from public paths
  if (isPublicPath && hasPBAuth) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users from protected paths
  if (!isPublicPath && !hasPBAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all protected routes
    "/dashboard/:path*",
    // Match authentication routes
    "/login",
    "/register",
  ],
};