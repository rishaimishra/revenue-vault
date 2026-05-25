import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const { pathname } = req.nextUrl;

    // 1. If user is authenticated and tries to access /auth/signin, redirect to home
    if (isAuth && pathname.startsWith("/auth/signin")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 2. If user is authenticated but hasn't completed onboarding,
    // force them to onboarding unless they are already there or at signout
    if (isAuth && !token.isOnboarded && pathname !== "/onboarding" && !pathname.startsWith("/api/auth")) {
      // Allow them to see the landing page, but nothing else
      if (pathname !== "/") {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }
    }

    // 3. If user is authenticated and already completed onboarding,
    // prevent them from seeing /onboarding by redirecting to their dashboard
    if (isAuth && token.isOnboarded && pathname === "/onboarding") {
      if (token.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url));
      } else if (token.role === "SELLER") {
        return NextResponse.redirect(new URL("/dashboard/seller", req.url));
      } else {
        return NextResponse.redirect(new URL("/marketplace", req.url));
      }
    }

    // 4. Admin Route Protection
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 5. Role-based Dashboard Protection
    if (pathname.startsWith("/dashboard/seller") && token?.role !== "SELLER" && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/buyer", req.url));
    }
    if (pathname.startsWith("/dashboard/buyer") && token?.role !== "BUYER" && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/seller", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/onboarding",
    "/listings/new",
    "/profile",
    "/messages/:path*",
  ],
};
