import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "./session";
import { Role } from "@prisma/client";

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function requireAuth(allowedRoles?: Role[]) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    redirect("/admin"); // Redirect to admin dashboard if role not allowed
  }

  return session;
}
