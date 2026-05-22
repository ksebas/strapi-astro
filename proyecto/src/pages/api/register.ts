export const prerender = false;

import type { APIContext } from "astro";
import { registerUserAction } from "../../actions/auth";

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
    return new Response(String(e), { status: 400 });
  }

  return redirect("/auth/signin");
}