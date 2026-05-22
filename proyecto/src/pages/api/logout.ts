export const prerender = false;

import type { APIContext } from "astro";

export async function POST({ cookies, redirect }: APIContext) {
  cookies.delete("jwt", { path: "/" });
  return redirect("/auth/signin");
}
