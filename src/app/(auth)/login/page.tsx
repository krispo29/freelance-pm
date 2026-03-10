"use client";

import { useActionState } from "react";
import { authenticate } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FolderKanban } from "lucide-react";

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 items-center">
          <div className="flex items-center gap-2 mb-2">
            <FolderKanban className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">Freelance PM</span>
          </div>
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
            </div>
            {errorMessage && (
              <p className="text-sm font-medium text-destructive">{errorMessage}</p>
            )}
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center text-sm text-muted-foreground">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
