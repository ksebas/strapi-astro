export const prerender = false;

import type { APIContext } from "astro";

const STRAPI_URL = import.meta.env.STRAPI_URL;

function translateError(msg: string): string {
  const m = (msg ?? "").toLowerCase();
  if (m.includes("invalid identifier") || m.includes("password"))
    return "Incorrect username or password.";
  if (m.includes("confirmed")) return "Your account is not confirmed yet.";
  if (m.includes("blocked")) return "Your account is blocked.";
  return msg || "Could not sign in.";
}

export async function POST({ request, redirect, cookies }: APIContext) {
  const formData = await request.formData();

  const identifier = String(formData.get("identifier") ?? "");
  const password = String(formData.get("password") ?? "");

  // Validación mínima server-side
  if (!identifier || !password) {
    const params = new URLSearchParams({
      error: "Please enter your username and password.",
      identifier,
    });
    return redirect(`/auth/signin?${params.toString()}`, 303);
  }

  let json: any;
  try {
    // Login contra Strapi: POST /api/auth/local
    const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    json = await res.json();

    if (!res.ok) {
      const params = new URLSearchParams({
        error: translateError(json?.error?.message ?? ""),
        identifier,
      });
      return redirect(`/auth/signin?${params.toString()}`, 303);
    }
  } catch (e) {
    const params = new URLSearchParams({
      error: "Could not connect to the server. Please try again.",
      identifier,
    });
    return redirect(`/auth/signin?${params.toString()}`, 303);
  }

  cookies.set("jwt", json.jwt, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: false,
    maxAge: 60 * 60 * 24 * 7,
  });

  return redirect("/dashboard");
}
