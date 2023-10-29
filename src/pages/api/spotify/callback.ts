import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ redirect, cookies, request }) => {
  console.log("GRABBING CALLBACK");
  const url = new URL(request.url);
  console.log(request.url);
  const spotifyVerifier = cookies.get("spotify_verifier");
  const userState = cookies.get("spotify_auth_state");

  const authCode = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (!spotifyVerifier) {
    return redirect("/signin?error=no_verifier");
  }
  if (!userState || !state || state !== userState.value) {
    return redirect("/signin?error=state_mismatch");
  }
  if (!authCode) {
    return redirect("/signin?error=no_code");
  }
  if (error) {
    return redirect("/signin?error=" + error);
  }

  console.log("GRABBING TOKEN");
  // request access token
  const params = new URLSearchParams();
  params.append("client_id", import.meta.env.SPOTIFY_CLIENT_ID);
  params.append("grant_type", "authorization_code");
  params.append("code", authCode);
  params.append("redirect_uri", "http://localhost:4321/api/spotify/callback");
  params.append("code_verifier", spotifyVerifier.value);

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  console.log("GRABBING TOKEN RESULT");

  if (!result.ok) {
    return redirect("/signin?error=token_error");
  }

  console.log("GRABBING TOKEN RESULT OK");

  const data = await result.json();
  console.log("!! DATA", data);
  const { access_token, refresh_token, expires_in } = data;

  cookies.set("spotify_access_token", access_token, {
    maxAge: expires_in,
    path: "/",
  });
  
  cookies.set("spotify_refresh_token", refresh_token, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365 * 10,
  })

  return redirect("/home");
};
