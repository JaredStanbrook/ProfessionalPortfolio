import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";
import { toast } from "sonner";

import { api } from "@/api/apiClient"; // Your Hono RPC client
import { handleResponseError, safeJson } from "@/lib/utils";
import type { User } from "@server/db/schema/user"; // Adjust import path as needed

export const auth = api.auth; // Assuming your RPC route is mounted at /auth

// --- QUERIES ---

async function getCurrentUser() {
  const res = await auth.me.$get();
  // Using your existing safeJson utility
  return safeJson<User>(res);
}

export const getUserQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
  retry: false,
});

// --- MUTATIONS (WebAuthn Logic) ---

/**
 * REGISTRATION (The 2-step Dance)
 */
export async function registerUser({ email }: { email: string }) {
  // 1. Get Options from Server
  const optRes = await auth.register.options.$post({ json: { email } });
  if (!optRes.ok) throw new Error("Failed to get registration options");
  const options = await optRes.json();

  // 2. Sign in Browser (Passkey prompt)
  let attResp;
  try {
    attResp = await startRegistration({ optionsJSON: options });
  } catch (error: any) {
    if (error.name === "InvalidStateError") {
      throw new Error("This device is already registered.");
    }
    throw error;
  }

  // 3. Verify with Server
  const verRes = await auth.register.verify.$post({
    json: { email, response: attResp },
  });

  await handleResponseError(verRes);
  return await verRes.json();
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Account created!");
      // Refetch user to log them in immediately
      queryClient.invalidateQueries({ queryKey: getUserQueryOptions.queryKey });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}

/**
 * LOGIN (The 2-step Dance)
 */
export async function loginUser({ email }: { email: string }) {
  // 1. Get Options
  const optRes = await auth.login.options.$post({ json: { email } });
  if (!optRes.ok) {
    if (optRes.status === 404) throw new Error("User not found");
    throw new Error("Failed to get login options");
  }
  const options = await optRes.json();

  // 2. Sign in Browser
  let authResp;
  try {
    authResp = await startAuthentication({ optionsJSON: options });
  } catch (error) {
    throw new Error("Authentication cancelled or failed");
  }

  // 3. Verify
  const verRes = await auth.login.verify.$post({
    json: { email, response: authResp },
  });

  if (!verRes.ok) throw new Error("Login verification failed");
  return await verRes.json();
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      toast.success("Welcome back!");
      queryClient.invalidateQueries({ queryKey: getUserQueryOptions.queryKey });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}

/**
 * LOGOUT
 */
export async function logoutUser() {
  const res = await auth.logout.$post();
  if (!res.ok) {
    throw new Error("Logout failed");
  }
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      toast.info("Logged out", { description: "See you next time!" });
      queryClient.setQueryData(getUserQueryOptions.queryKey, null);
      window.location.href = "/"; // Hard reload to clear client state
    },
  });
}
