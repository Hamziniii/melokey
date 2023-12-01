import { type APIRoute } from "astro";
import { download, upload } from "../../../common-client/management/combined";

// TODO: Add authentication :)
// need to prevent unauthorized users from accessing this endpoint
// or allowing users to access other users' tags

export const POST: APIRoute = async ({ request }) => {
  try {
    // const { email, blob } = await request.json();
    const text = await request.text();
    const data = JSON.parse(text)
    await upload(data.email, JSON.stringify(data.blob))
    return new Response("Uploaded", { status: 200 })
  } catch (error: any) {
    return new Response(error.message, { status: 500 })
  }
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const urlSearchParams = new URLSearchParams(request.url.split('?')[1]);
    const params = Object.fromEntries(urlSearchParams.entries());
    const blob = (await download(params.email))?.blob
    return new Response(blob, { status: 200 })
  } catch (error: any) {
    return new Response(error.message, { status: 500 })
  }
}