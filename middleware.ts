import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/sign-in",
    "/sign-up",
    "/api/webhooks(.*)",
  ],
  // Routes that can be accessed without authentication
  ignoredRoutes: [
    "/api/webhooks(.*)",
  ],
});
 
export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/(authenticated)(.*)",  // Protect all routes under (authenticated)
  ],
};
