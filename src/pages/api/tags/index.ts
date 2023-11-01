import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ redirect, cookies, request }) => {
  return new Response(JSON.stringify({ dev: "space" }));
};
