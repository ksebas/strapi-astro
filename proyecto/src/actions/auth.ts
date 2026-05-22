
const STRAPI_URL = import.meta.env.STRAPI_URL;

export async function registerUserAction(data: {
  username: string
  email: string
  password: string
}) {
  const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error?.message ?? "Registration failed");
  }

  return { success: true, data: json };
}
