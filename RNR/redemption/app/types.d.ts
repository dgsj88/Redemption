// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    isRequireTwoFactorAuth?: boolean;
  }

  interface Session {
    isRequireTwoFactorAuth?: boolean;
    user?: {
      role?: string;
    } & DefaultSession["user"];
  }
}

type userCreateResObj = {
    id: number;
};

type userUpdateResObj = {
    id: number;
    email: string;
    name: string;
    role: string;
    credits: number;
    isActive: boolean;
}

