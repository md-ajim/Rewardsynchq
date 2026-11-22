import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string
    refreshToken?: string
    user: {
      id?: string
      name?: string
      email?: string
      username?: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    accessToken?: string
    refreshToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    id?: string
  }
}
