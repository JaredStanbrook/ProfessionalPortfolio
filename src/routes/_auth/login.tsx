import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useLoginMutation } from "@/api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_auth/login")({
  // Redirect if already logged in
  beforeLoad: ({ context }) => {
    // Note: Assuming '/dashboard' is the correct protected route for redirection
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // This mutation handles the entire WebAuthn dance
  const { mutate: login, isPending } = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { email },
      {
        onSuccess: () => {
          navigate({ to: "/dashboard" });
        },
      }
    );
  };

  return (
    <div className="container flex-grow flex flex-col items-center justify-center py-12">
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px] p-8 border rounded-lg shadow-xl bg-card">
        {/* Header - Unified for Sign In */}
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in using your registered Passkey.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              required
            />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Waiting for Passkey..." : "Sign In with Passkey"}
          </Button>
        </form>
      </div>

      {/* Footer Link - Fixed to point to Registration */}
      <p className="px-8 mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="underline underline-offset-4 hover:text-primary font-medium">
          Create Account
        </Link>
      </p>
    </div>
  );
}
