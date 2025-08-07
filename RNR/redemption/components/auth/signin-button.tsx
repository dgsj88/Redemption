"use client"
import { signIn } from "next-auth/react"
 
export function SignIn() {
  return <button onClick={() => signIn("credentials", {redirectTo: ""})}>Sign In</button>
}