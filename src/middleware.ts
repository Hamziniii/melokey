import { defineMiddleware } from "astro:middleware"

const blacklist = ["/api/spotify/callback", "/"]

export const onRequest  = defineMiddleware(async ({cookies, redirect, url, locals}, next) => {
  if(blacklist.includes(url.pathname)) return next();

  const spotifyAccessToken = cookies.get("spotify_access_token")?.value;
  const spotifyRefreshToken = cookies.get("spotify_refresh_token")?.value;

  if (!spotifyAccessToken || !spotifyRefreshToken) return redirect("/?error=tokens_missing");

  const payload = {
    method: "POST",
    Headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: spotifyRefreshToken,
      client_id: import.meta.env.SPOTIFY_CLIENT_ID,
    })
  }

  try {    
    const body = await fetch("https://accounts.spotify.com/api/token", payload).then(res => res.json());
    const { access_token, expires_in } = body;
    cookies.set("spotify_access_token", access_token, {
      maxAge: expires_in,
      path: "/",
    });
  } catch (e) {
    return redirect("/?error=token_error");
  }

  return next();
})