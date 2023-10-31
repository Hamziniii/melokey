import { SpotifyApi, type Page, type SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react"
import type { SdkProps } from "../../middleware";
import Cookies from "js-cookie";

type PartialPlaylist = Pick<SimplifiedPlaylist, "id" | "name" | "description" | "images" | "tracks">

function createPlaylistPlaceholders(count: number): PartialPlaylist[] {
  return Array.from(Array(count).keys()).map(i => ({
    id: i.toString(),
    name: "Playlist",
    description: "Description",
    images: [],
    tracks: {
      total: 0,
      href: "",
    }
  }))
}

export default function Playlists({sdkProps, playlistCount = 4}: {sdkProps: SdkProps, playlistCount?: number}) {
  const [playlistPage, setPlaylistPage] = useState<Page<SimplifiedPlaylist> | null>(null)
  const [playlists, setPlaylists] = useState<PartialPlaylist[]>(createPlaylistPlaceholders(playlistCount || 4))

  useEffect(() => {
    const sdk = SpotifyApi.withAccessToken(sdkProps.clientId, sdkProps.token)
    sdk.currentUser.playlists.playlists().then(playlists => {
      setPlaylistPage(playlists)
      setPlaylists(playlists.items)
      Cookies.set("playlistCount", playlists.items.length.toString())
    })
  }, [])

  return playlists?.map(playlist => {
    const image = playlist.images[0]?.url
  
    return (
      <div playlist-id={playlist.id} key={playlist.id} className="my-2 mx-2 p-4 transition-colors duration-200 ease-in-out bg-transparent rounded-lg hover:bg-[#ffffff0a] cursor-pointer"
        onClick={() => window.location.href = `/playlist-viewer/${playlist.id}`}>
        {
          image ? (
            <div className="bg-zinc-800 rounded-lg h-36 w-36 mb-4">
              <img src={image} className="object-cover h-full w-full rounded-lg" />
            </div>
          ) : (
            <div className="bg-zinc-800 rounded-lg h-36 w-36 mb-4 text-gray-500 text-4xl">
              no image
            </div>
          )
        }
        <p className="text-white overflow-hidden whitespace-nowrap text-ellipsis w-36">{playlist.name}</p>
        <p className="text-gray-400 font-thin">{playlist.tracks?.total} Songs</p>
      </div>
    )})
}

