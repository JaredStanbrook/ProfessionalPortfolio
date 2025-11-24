import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useRegisterMutation } from "@/api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_auth/register")({
  // Guard: Redirect to dashboard if already authenticated
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  // Use the mutation we created in authApi.ts
  const { mutate: register, isPending } = useRegisterMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    // Trigger the WebAuthn dance
    register(
      { email },
      {
        onSuccess: () => {
          // Navigate to a protected route on successful registration
          navigate({ to: "/dashboard" });
        },
      }
    );
  };

  return (
    <div className="container flex-grow flex flex-col items-center justify-center py-12">
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px] p-8 border rounded-lg shadow-xl bg-card">
        {/* Header - Consistent Sign Up Styling */}
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create an Account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to register using a Passkey.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isPending}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button disabled={isPending} type="submit">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up Passkey...
              </>
            ) : (
              "Create Account with Passkey"
            )}
          </Button>
        </form>
      </div>

      {/* Footer Link - Consistent Styling and Link */}
      <p className="px-8 mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="underline underline-offset-4 hover:text-primary font-medium">
          Sign In
        </Link>
      </p>
    </div>
  );
}
