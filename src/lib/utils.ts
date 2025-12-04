import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export async function getErrorMessage(res: Response) {
  try {
    const data = await res.json();
    return data.error || data.message || "An unexpected error occurred";
  } catch {
    return `Request failed with status ${res.status}`;
  }
}
