// app/api/auth/[...nextauth]/options.ts (or similar)
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { authAPI } from "@/lib/api" // adjust path

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        try {
          const response = await authAPI.login({
            email: credentials.email,
            password: credentials.password,
          })



          const { data, success } = response.data
          

          if (success && data) {
            return {
              id: data._id,
              email: data.user.email,
              name: data.user.name,
              role: data.role,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              image: data.user.avatarUrl,
            } as any // we'll fix typing below
          }

          // If the API says "not success", treat as invalid credentials
          throw new Error(response.data.message || "Invalid credentials")
        } catch (error: any) {
          // This message will come through to `signIn` as `result.error`
          throw new Error(error.response?.data?.message || "Login failed")
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      // initial sign in
      if (user) {
        token.accessToken = (user as any).accessToken
        token.refreshToken = (user as any).refreshToken
        token.role = (user as any).role
      }

      // TODO: handle token refresh here if you want

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.role = token.role as string
      }
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      return session
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
}
