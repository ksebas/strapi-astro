export const prerender = false;

import type { APIContext } from "astro";
import { registerUserAction } from "../../actions/auth";

function translateError(msg: string): string {
  const m = (msg ?? "").toLowerCase();
  if (m.includes("already taken"))
    return "Email or username is already taken.";
  if (m.includes("email") && m.includes("valid"))
    return "The email is not valid.";
  if (m.includes("password"))
    return "The password does not meet the requirements.";
  return msg || "Could not create the account.";
}

export async function POST({ request, redirect }: APIContext) {
  const formData = await request.formData();

  const data = {
    username: String(formData.get("username") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  try {
    await registerUserAction(data);
  } catch (e) {
    const params = new URLSearchParams({
      error: translateError(e instanceof Error ? e.message : String(e)),
      username: data.username,
      email: data.email,
    });
    return redirect(`/auth/signup?${params.toString()}`, 303);
  }

  return redirect("/auth/signin?registered=1", 303);
}
