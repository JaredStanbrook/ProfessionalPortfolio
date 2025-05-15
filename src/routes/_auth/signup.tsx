import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { createUserSchema } from "@server/sharedTypes";
import { useRef, useState } from "react";
import { useCreateUserMutation } from "@/api/authApi";

export const Route = createFileRoute("/_auth/signup")({
  component: Signup,
});

function Signup() {
  const userMutation = useCreateUserMutation();
  const navigate = useNavigate();
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      address: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await userMutation.mutateAsync(value);

        toast("Account Created", {
          description: `Successfully created account for: ${value.email}`,
        });

        navigate({ to: "/" }); // Redirect to home after successful signup
      } catch (error: unknown) {
        console.error("Error while creating user:", error);

        if (error instanceof Error) {
          toast("Error", { description: error.message || "An error occurred" });
        } else {
          toast("Error", { description: "An unexpected error occurred" });
        }
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-6 border rounded-lg shadow-lg">
        <h2 className="text-2xl text-center mb-6">Create Account</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          className="flex flex-col gap-y-6 mt-6">
          <form.Field
            name="firstName"
            validators={{
              onChange: createUserSchema.shape.firstName,
            }}
            children={(field) => (
              <div>
                <Label htmlFor={field.name}>First Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                />
              </div>
            )}
          />
          <form.Field
            name="lastName"
            validators={{
              onChange: createUserSchema.shape.lastName,
            }}
            children={(field) => (
              <div>
                <Label htmlFor={field.name}>Last Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                />
              </div>
            )}
          />
          <form.Field
            name="email"
            validators={{
              onChange: createUserSchema.shape.email,
            }}
            children={(field) => (
              <div>
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                />
              </div>
            )}
          />
          <form.Field
            name="password"
            validators={{
              onChange: createUserSchema.shape.password,
            }}
            children={(field) => (
              <div>
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                />
              </div>
            )}
          />

          <div className="text-sm text-gray-500 text-center mt-4">
            Already have an account?{" "}
            <Button variant="link" className="p-0" onClick={() => navigate({ to: "/login" })}>
              Log in
            </Button>
          </div>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button className="mt-4 w-full" type="submit" disabled={!canSubmit}>
                {isSubmitting ? "..." : "Sign Up"}
              </Button>
            )}
          />
        </form>
      </div>
    </div>
  );
}
