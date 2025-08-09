"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { otpReqSchema } from "@/lib/zod";

export default function VerifyTwoFactor() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const router = useRouter();
  const { data: session, status, update } = useSession();

  useEffect(() => {
    // Only run this check after session is loaded
    if (status !== "loading") {
      setSessionChecked(true);

      // If user is authenticated but doesn't need 2FA, redirect them away
      if (session && !session.isRequireTwoFactorAuth) {
        router.push("/");
      }
    }
  }, [session, status, router]);

  const form = useForm<z.infer<typeof otpReqSchema>>({
    resolver: zodResolver(otpReqSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!token || token.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/2fa/setup-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to verify code");
      }

      // Update the session to mark 2FA as verified
      await update({
        twoFactorVerified: true,
      });

      toast("Success", {
        description: "Two-factor authentication verified",
      });

      // Redirect to the home page
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full sm:max-w-md mx-auto py-10 space-y-8 p-4 sm:p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Verify Your Identity</h1>
        <p className="text-sm text-gray-500 mt-2">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the one-time password sent to your phone.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
