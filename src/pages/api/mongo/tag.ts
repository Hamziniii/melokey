import { type APIRoute } from "astro";
import { addTag, getTags } from "../../../common-client/management/tag";

// TODO: Add authentication :)
// need to prevent unauthorized users from accessing this endpoint
// or allowing users to access other users' tags

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, name, color, description } = await request.json();
    addTag(email, name, color, description)
    return new Response("Tag added", { status: 200 })
  } catch (error: any) {
    return new Response(error.message, { status: 500 })
  }
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const urlSearchParams = new URLSearchParams(request.url.split('?')[1]);
    const params = Object.fromEntries(urlSearchParams.entries());
    const tags = await getTags(params.email)
    return new Response(JSON.stringify(tags), { status: 200 })
  } catch (error: any) {
    return new Response(error.message, { status: 500 })
  }
}