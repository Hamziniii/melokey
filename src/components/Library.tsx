import { SpotifyApi, type SimplifiedPlaylist } from "@spotify/web-api-ts-sdk"
import { useEffect, useState } from "react"
import type { SdkProps } from "../middleware"

export default function Library({sdkProps}: {sdkProps: SdkProps}) {
  const [sdk, setSdk] = useState<SpotifyApi | null>(null)
  const [playlists, setPlaylists] = useState<SimplifiedPlaylist[]>([])

  useEffect(() => {
    const _sdk = SpotifyApi.withAccessToken(sdkProps.clientId, sdkProps.token)
    setSdk(_sdk)
    _sdk.currentUser.playlists.playlists().then((playlists) => setPlaylists(playlists.items))
  }, [])

  return <div>
    <h2 className="text-lg text-gray-400 transition-colors duration-150 ease-in-out hover:text-white">Your Library</h2>
    <ul className="mt-4">
      {playlists.map((playlist) => {
        return <li key={playlist.id} className="text-gray-400 transition-colors duration-150 ease-in-out hover:text-white">
          {playlist.name}
        </li>
      })}
    </ul>
  </div>
}