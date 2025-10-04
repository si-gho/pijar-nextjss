import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "./db"
import { users } from "./schema"
import { eq } from "drizzle-orm"

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development-only-change-in-production",
  adapter: DrizzleAdapter(db),
  trustHost: true, // Allow dynamic host detection
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Find user in database
          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email as string))
            .limit(1)

          if (!user.length) {
            console.log("User not found:", credentials.email)
            return null
          }

          const foundUser = user[0]

          // For now, simple password comparison (in production, use proper hashing)
          if (credentials.password !== foundUser.password) {
            console.log("Invalid password for user:", credentials.email)
            return null
          }

          console.log("User authenticated successfully:", foundUser.email)
          
          // Return user object
          return {
            id: foundUser.id,
            email: foundUser.email,
            name: foundUser.name,
            role: foundUser.role || "operator",
          }
        } catch (error) {
          console.error("Auth error:", error)
          // Return a more specific error response
          throw new Error("Database connection failed")
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})