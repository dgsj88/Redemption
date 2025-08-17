"use client";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userLoginFormSchema } from "@/lib/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SignIn() {
  const form = useForm<z.infer<typeof userLoginFormSchema>>({
    resolver: zodResolver(userLoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  form.setError("root", {
    type: "manual",
    message:
      error === "CredentialsSignin"
        ? "Invalid credentials"
        : "An error occured with sign in, please try again later",
  });
  function onSubmit(values: z.infer<typeof userLoginFormSchema>) {
    toast.promise(signIn("credentials", { ...values, redirect: true, redirectTo: "/dashboard" }), {
      loading: "Signing in...",
      success: () => {
        return "Success";
      },
      error: (err) => {
        return `Failed: ${err.message}`;
      },
    });
  }

  return (
    <Card className="max-w-md mx-auto mt-10 p-6">
      {error === "CredentialsSignin" && <Alert variant="destructive">
        <AlertTitle>Invalid Credentials</AlertTitle>
        <AlertDescription>
          Please check your email and password and try again.
        </AlertDescription>
      </Alert>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="recycling@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="A strong password..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between items-center">
            <Button type="submit">Sign In</Button>
              <a href="/reset-password" className="text-blue-600 hover:text-pink-500 ml-4">
                forgot password?
              </a>
          </div>
          <div className="flex justify-end">
            <a href="/." className="text-blue-600 hover:text-pink-500">
              ... back to Home
            </a>
          </div>
        </form>
      </Form>
    </Card>
  );
}
