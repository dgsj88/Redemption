"use client"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
 
export default function SignOutPage() {
  return (
      <Card className="max-w-md mx-auto mt-10 p-6 space-y-4">  
      <h5>Are you sure you want to sign out?</h5>
        <Button onClick={()=>{
          toast.promise(signOut({redirect: true, redirectTo: "/signin"}), {
            loading: "Signing out...",
            success: "Success",
            error: (err) => {
              return `Failed: ${err.message}`;
            },
          })
        }}>Sign out</Button>
      </Card>
  )
}