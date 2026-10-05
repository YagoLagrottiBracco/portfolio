import { randomBytes } from "node:crypto"
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

declare module "next-auth" {
  interface Session {
    githubId?: string
    editorCsrf?: string
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, account, profile }) {
      if (account?.provider === "github" && profile?.id !== undefined) {
        token.githubId = String(profile.id)
        token.editorCsrf = randomBytes(32).toString("base64url")
      }
      return token
    },
    session({ session, token }) {
      session.githubId = typeof token.githubId === "string" ? token.githubId : undefined
      session.editorCsrf = typeof token.editorCsrf === "string" ? token.editorCsrf : undefined
      return session
    },
  },
})
