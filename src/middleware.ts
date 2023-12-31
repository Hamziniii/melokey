import type { AccessToken } from "@spotify/web-api-ts-sdk";
import { defineMiddleware } from "astro:middleware";

// Locations that do not need to be authenticated
const blacklist = ["/api/spotify/callback", "/", "/logout"];

export type SdkProps = {
  token: AccessToken;
  clientId: string;
};

export type Locals = App.Locals & {
  sdkProps: SdkProps;
};

export const onRequest = defineMiddleware(
  async ({ cookies, redirect, url, locals }, next) => {
    if (url.pathname.startsWith("/api")) return next();
    if (blacklist.includes(url.pathname)) return next();

    const spotifyAccessToken = cookies.get("spotify_access_token")?.value;
    const spotifyRefreshToken = cookies.get("spotify_refresh_token")?.value;
    // In minutes, for easy debugging
    const expires_in = cookies.get("expires_in")?.value;
    const timeLeft = expires_in
      ? (parseInt(expires_in) - new Date().getTime()) / 1000 / 60
      : 0;
    const expired = timeLeft <= 5;

    if (spotifyAccessToken && spotifyRefreshToken && !expired) {
      const spotifyAccessToken = cookies.get("spotify_access_token")!.value;
      (locals as Locals).sdkProps = {
        clientId: import.meta.env.SPOTIFY_CLIENT_ID,
        token: {
          access_token: spotifyAccessToken,
          refresh_token: "", // we dont actually want it to refresh
          token_type: "Bearer",
          expires_in: 3600,
        },
      };
      return next();
    }

    if (!spotifyRefreshToken) return redirect("/?error=tokens_missing");

    const payload = {
      method: "POST",
      Headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: spotifyRefreshToken,
        client_id: import.meta.env.SPOTIFY_CLIENT_ID,
      }),
    };

    try {
      const body = await fetch(
        "https://accounts.spotify.com/api/token",
        payload,
      ).then((res) => res.json());
      const { access_token, expires_in, refresh_token } = body;

      (locals as Locals).sdkProps = {
        clientId: import.meta.env.SPOTIFY_CLIENT_ID,
        token: {
          access_token: access_token,
          refresh_token: "", // we dont actually want it to refresh
          token_type: "Bearer",
          expires_in: 3600,
        },
      };

      cookies.set("spotify_access_token", access_token, {
        maxAge: expires_in,
        path: "/",
      });

      const expiry = new Date().getTime() + expires_in * 1000;
      cookies.set("expires_in", "" + expiry, {
        maxAge: expires_in,
        path: "/",
      });

      cookies.set("spotify_refresh_token", refresh_token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 10,
      });
    } catch (e) {
      // Refresh token could be expired !!
      console.error(e);
      return redirect("/?error=token_error");
    }

    return next();
  },
);
