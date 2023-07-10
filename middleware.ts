import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized({ req, token }) {
      // `/admin` requires admin role
      if (req.nextUrl.pathname === "/admin") {
        return token?.role === "ADMIN"
      } else if (req.nextUrl.pathname === "/") {
        return token?.role === "USER"
      }
      // `/me` only requires the user to be logged in
      return !!token
  }},
});

export const config = { matcher: ["/admin/:path*"] }