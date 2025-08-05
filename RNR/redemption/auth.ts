import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import z from "zod";
import { userLoginReqObjSchema } from "@/lib/zod";
import prisma from "@/lib/prisma";
import { verifyPasswordPBKDF2 } from "./utils/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {
          label: "email",
          type: "text",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      authorize: async (reqObj) => {
        try {
          const parsedReqObj = userLoginReqObjSchema.parse(reqObj);
          const targetUser = await prisma.user.findUnique({
            where: {
              email: parsedReqObj.email,
            },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              twoFactorAuth: true,
              password: true,
              salt: true,
            },
          });
          if (!targetUser) {
            return null;
          }
          const isPasswordValid = await verifyPasswordPBKDF2(
            parsedReqObj.password,
            targetUser.password,
            targetUser.salt
          );
          if (!isPasswordValid) return null;
          const userInfo = {
            id: targetUser.id,
            email: targetUser.email,
            name: targetUser.name,
            role: targetUser.role,
            isRequireTwoFactorAuth: targetUser.twoFactorAuth,
          }
          return userInfo; //successful login, store user info in session
         
        } catch (error) {
          if (error instanceof z.ZodError) {

            return null;
          }
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    signOut: "/signout",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Only happens on sign-in
      if (user) {
        token.id = user.id as string;
        token.role = user.role as string;
        token.isRequireTwoFactorAuth = user.isRequireTwoFactorAuth;
      }
      return token;
    },
    async session({ session, token }) {
      // Add id and role to session.user
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      session.isRequireTwoFactorAuth = token.isRequireTwoFactorAuth as boolean;
      return session;
    }
  }
});
