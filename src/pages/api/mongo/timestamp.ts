import { type APIRoute } from "astro";
import { getUploadTime } from "../../../common-client/management/combined";

export const GET: APIRoute = async ({ request }) => {
  try {
    const urlSearchParams = new URLSearchParams(request.url.split('?')[1]);
    const params = Object.fromEntries(urlSearchParams.entries());
    const timestamp = (await getUploadTime(params.email))?.timestamp
    return new Response(timestamp, { status: 200 })
  } catch (error: any) {
    return new Response(error.message, { status: 500 })
  }
}