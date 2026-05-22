export const prerender = false;

import type { APIContext } from "astro";

const STRAPI_URL = import.meta.env.STRAPI_URL;

export async function POST({ request, redirect, cookies }: APIContext) {
  const formData = await request.formData();

  const identifier = String(formData.get("identifier") ?? "");
  const password = String(formData.get("password") ?? "");

  // Validación mínima server-side
  if (!identifier || !password) {
    return new Response("Missing identifier or password", { status: 400 });
  }

  // Login contra Strapi: POST /api/auth/local
  const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });

  const json = await res.json();

  if (!res.ok) {
    // aquí Strapi normalmente devuelve error de credenciales
    return new Response(JSON.stringify(json), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
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


