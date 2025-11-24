// src/api/authApi.ts - Updated for KV-based challenge storage with Hono RPC

import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";
import { toast } from "sonner";

import { api } from "@/api/apiClient"; // Your Hono RPC client
import type { User } from "@server/db/schema/user";

export const auth = api.auth;

// Type for options response (now includes challengeId)
interface RegistrationOptionsResponse {
  challenge: string;
  challengeId: string;
  rp: {
    name: string;
    id: string;
  };
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: Array<{
    type: string;
    alg: number;
  }>;
  timeout?: number;
  excludeCredentials?: Array<any>;
  authenticatorSelection?: any;
  attestation?: string;
}

interface AuthenticationOptionsResponse {
  challenge: string;
  challengeId: string;
  timeout?: number;
  rpId?: string;
  allowCredentials?: Array<any>;
  userVerification?: string;
}

// Helper to extract error message from Hono RPC response
async function getErrorMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    // Hono RPC error format typically has an 'error' field
    return data.error || data.message || "An unexpected error occurred";
  } catch {
    return `Request failed with status ${res.status}`;
  }
}

// --- QUERIES ---

async function getCurrentUser() {
  const res = await auth.me.$get();
  if (!res.ok) {
    throw new Error(await getErrorMessage(res));
  }
  return (await res.json()) as User;
}

export const getUserQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
  retry: false,
});

// --- MUTATIONS (WebAuthn Logic) ---

/**
 * REGISTRATION (The 2-step Dance with KV Challenge)
 */
export async function registerUser({ email }: { email: string }) {
  // 1. Get Options from Server (includes challengeId)
  const optRes = await auth.register.options.$post({ json: { email } });

  // Handle 409 Conflict - email already registered
  if (optRes.status === 409) {
    throw new Error("This email is already registered. Please proceed to login.");
  }

  if (!optRes.ok) {
    const errorMsg = await getErrorMessage(optRes);
    throw new Error(errorMsg);
  }

  const options = (await optRes.json()) as RegistrationOptionsResponse;

  console.log("Registration options received:", {
    challengeId: options.challengeId,
    hasChallenge: !!options.challenge,
  });

  // 2. Sign in Browser (Passkey prompt)
  let attResp;
  try {
    attResp = await startRegistration({ optionsJSON: options });
  } catch (error: any) {
    // Handle specific WebAuthn errors
    if (error.name === "InvalidStateError") {
      throw new Error("A passkey for this account already exists on this device. Please log in.");
    }

    if (error.name === "NotAllowedError") {
      throw new Error("Passkey operation cancelled or disallowed by the browser.");
    }

    throw error;
  }

  // 3. Verify with Server (send challengeId back)
  const verRes = await auth.register.verify.$post({
    json: {
      email,
      response: attResp,
      challengeId: options.challengeId,
    },
  });

  if (!verRes.ok) {
    const errorMsg = await getErrorMessage(verRes);
    throw new Error(errorMsg);
  }

  return await verRes.json();
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Account created!");
      queryClient.invalidateQueries({ queryKey: getUserQueryOptions.queryKey });
    },
    onError: (err) => {
      console.error("Registration error:", err);

      if (err.message.includes("Passkey operation cancelled")) {
        toast.info("Registration cancelled.");
      } else if (err.message.includes("already registered")) {
        toast.error(err.message, {
          description: "Click 'Sign In' below to continue.",
          duration: 8000,
        });
      } else if (err.message.includes("Challenge expired")) {
        toast.error("Registration timed out. Please try again.", {
          description: "The security challenge expired after 5 minutes.",
          duration: 5000,
        });
      } else {
        toast.error(err.message);
      }
    },
  });
}

/**
 * LOGIN (The 2-step Dance with KV Challenge)
 */
export async function loginUser({ email }: { email: string }) {
  // 1. Get Options (includes challengeId)
  const optRes = await auth.login.options.$post({ json: { email } });

  if (!optRes.ok) {
    if (optRes.status === 404) {
      throw new Error("User not found");
    }
    const errorMsg = await getErrorMessage(optRes);
    throw new Error(errorMsg);
  }

  const options = (await optRes.json()) as AuthenticationOptionsResponse;

  console.log("Authentication options received:", {
    challengeId: options.challengeId,
    hasChallenge: !!options.challenge,
  });

  // 2. Sign in Browser
  let authResp;
  try {
    authResp = await startAuthentication({ optionsJSON: options });
  } catch (error: any) {
    if (error.name === "NotAllowedError") {
      throw new Error("Authentication cancelled by user.");
    }
    throw new Error("Authentication failed or cancelled");
  }

  // 3. Verify (send challengeId back)
  const verRes = await auth.login.verify.$post({
    json: {
      email,
      response: authResp,
      challengeId: options.challengeId,
    },
  });

  if (!verRes.ok) {
    const errorMsg = await getErrorMessage(verRes);
    throw new Error(errorMsg);
  }

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
      console.error("Login error:", err);

      if (err.message.includes("cancelled by user")) {
        toast.info("Login cancelled.");
      } else if (err.message.includes("Challenge expired")) {
        toast.error("Login timed out. Please try again.", {
          description: "The security challenge expired after 5 minutes.",
          duration: 5000,
        });
      } else {
        toast.error(err.message);
      }
    },
  });
}

/**
 * LOGOUT
 */
export async function logoutUser() {
  const res = await auth.logout.$post();
  if (!res.ok) {
    const errorMsg = await getErrorMessage(res);
    throw new Error(errorMsg);
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
