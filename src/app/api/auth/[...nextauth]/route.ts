import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

console.log('🚀 NextAuth route handler loaded')
console.log('📋 Auth providers:', authOptions.providers.map((p: any) => p.id || p.name))

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
