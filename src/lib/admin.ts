import { auth } from "@/lib/auth";

export async function requireAdmin(): Promise<boolean> {
  const session = await auth();
  return Boolean(session?.user);
}
