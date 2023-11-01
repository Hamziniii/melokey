import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ redirect, cookies, request, params }) => {
  return new Response(JSON.stringify({ got: params }));
};
