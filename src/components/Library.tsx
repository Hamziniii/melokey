import { SpotifyApi, type SimplifiedPlaylist } from "@spotify/web-api-ts-sdk"
import { useEffect, useState } from "react"
import type { SdkProps } from "../middleware"

function Pill({text, active = false}: {text: string, active?: boolean}) {
  return active ? <div className="text-sm font-thin text-black bg-neutral-100 py-1 px-3 rounded-2xl">{text}</div>  : <div className="text-sm font-thin text-gray-400 transition-colors bg-neutral-800 py-1 px-3 rounded-2xl duration-150 ease-in-out hover:text-white">{text}</div>
}

function LibraryTile({playlist}: {playlist: SimplifiedPlaylist}) {
  const image = playlist.images[0]?.url
  return <div className="flex flex-row gap-2 h-12 cursor-pointer" onClick={() => { window.location.href = "/playlist-viewer/" + playlist.id}}>
    {image ?
     <img src={image} className="w-12 h-12 rounded-md" /> :
      <div className="w-12 h-12 rounded-md bg-gray-900 text-gray-500">
        no image
      </div>
    }
    <h3 className="text-base overflow-hidden whitespace-nowrap text-ellipsis text-gray-400 transition-colors duration-150 ease-in-out hover:text-white">{playlist.name}</h3>
  </div>
}

export default function Library({sdkProps}: {sdkProps: SdkProps}) {
  const [sdk, setSdk] = useState<SpotifyApi | null>(null)
  const [playlists, setPlaylists] = useState<SimplifiedPlaylist[]>([])
  const pills = ["Playlists", "Tags"]

  useEffect(() => {
    const _sdk = SpotifyApi.withAccessToken(sdkProps.clientId, sdkProps.token)
    setSdk(_sdk)
    _sdk.currentUser.playlists.playlists().then(playlist => setPlaylists(playlist.items))
  }, [])

  return <div className="flex flex-col h-full">
    <h2 className="text-lg text-white">Your Library</h2>
    <div className="flex flex-row gap-4 mt-4">
      {pills.map((pill) => 
        <Pill key={pill} text={pill} active={pill === "Playlists"} />
      )}
    </div>
    <ul className="mt-4 flex-grow overflow-y-auto">
      {playlists.map((playlist) => {
        return <li key={playlist.id} className="mb-3">
          <LibraryTile playlist={playlist} />
        </li>
      })}
    </ul>
  </div>
}