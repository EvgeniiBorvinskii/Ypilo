import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "./prisma"

console.log('🔧 Loading auth config...')
console.log('📍 NEXTAUTH_URL:', process.env.NEXTAUTH_URL)
console.log('🔑 GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...')
console.log('🔐 GOOGLE_CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET)

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.subscriptionTier = 'FREE'
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url
      if (url.startsWith('/')) return `${baseUrl}${url}`
      return `${baseUrl}/dashboard`
    },
    async signIn({ user, account, profile }) {
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  useSecureCookies: false,
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false
      }
    },
    callbackUrl: {
      name: 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false
      }
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false
      }
    }
  },
  debug: true,
}
