import { SpotifyApi, type SimplifiedPlaylist } from "@spotify/web-api-ts-sdk"
import { useEffect, useState } from "react"
import type { SdkProps } from "../../middleware"
import Cookies from "js-cookie"
import { getTagListWithData, type Tag, type TagWithTracks } from "../../common-client/tagManagement"
import { getCompositionList, type Composition } from "../../common-client/compositionsManagement"

type PartialPlaylist = Pick<SimplifiedPlaylist, "id" | "name" | "images" | "tracks">
function createPlaylistPlaceholders(count: number): PartialPlaylist[] {
  return Array.from(Array(count).keys()).map(i => ({
    id: i.toString(),
    name: "Loading...",
    images: [], 
    tracks: {
      total: 0,
      href: "",
    }
  }))
}

function Pill({text, active = false, onClick = () => {}}: {text: string, active?: boolean, onClick?: () => any}) {
  return active ? <div className="text-sm font-thin text-black bg-neutral-100 py-1 px-3 rounded-2xl cursor-pointer select-none" onClick={onClick}>{text}</div> : 
  <div className="text-sm font-thin text-gray-400 transition-colors bg-neutral-800 py-1 px-3 rounded-2xl duration-150 ease-in-out hover:text-white cursor-pointer select-none" onClick={onClick}>{text}</div>
}

function PlaylistTile({playlist}: {playlist: PartialPlaylist}) {
  const image = playlist?.images[0]?.url
  return <div className="flex flex-row w-full gap-2 h-12 cursor-pointer" onClick={() => { if(playlist) window.location.href = "/playlist-viewer/" + playlist.id}}>
    {image ?
     <img src={image} className="w-12 h-12 rounded-md" /> :
      <div className="w-12 h-12 rounded-md bg-gray-900 flex-shrink-0 text-gray-500">
        no image
      </div>
    }
    <div className="flex flex-col w-full overflow-hidden">
      <h2 className="text-base w-full overflow-hidden whitespace-nowrap text-ellipsis text-gray-400 transition-colors duration-150 ease-in-out hover:text-white">{playlist?.name ?? "No name"}</h2>
      <h3 className="text-sm font-thin text-gray-300">{playlist?.tracks?.total ?? 0} Songs</h3>
    </div>
  </div>
}

function TagTile({tag}: {tag: TagWithTracks}) {
  return <div className="flex flex-row w-full gap-2 h-12 cursor-pointer" onClick={() => { if(tag) window.location.href = "/tag-viewer/" + tag.id}}>
    <div className="w-12 h-12 rounded-md flex-shrink-0 text-gray-500 bg-gradient-to-b from-slate-600" style={{"--tw-gradient-from": tag?.color} as React.CSSProperties} />
    <div className="flex flex-col w-full overflow-hidden">
      <h2 className="text-base w-full overflow-hidden whitespace-nowrap text-ellipsis text-gray-400 transition-colors duration-150 ease-in-out hover:text-white">{tag?.name ?? "No name"}</h2>
      <h3 className="text-sm font-thin text-gray-300">{tag?.tracks?.length ?? 0} Songs</h3>
    </div>
  </div>
}

function CompositionTile({composition}: {composition: Composition}) {
  return <div className="flex flex-row w-full gap-2 h-12 cursor-pointer" onClick={() => { if(composition) window.location.href = "/composition-test/" + composition.id}}>
    <div className="w-12 h-12 rounded-md flex-shrink-0 text-gray-500 bg-gradient-to-b from-slate-600"/>
    <div className="flex flex-col w-full overflow-hidden">
      <h2 className="text-base w-full overflow-hidden whitespace-nowrap text-ellipsis text-gray-400 transition-colors duration-150 ease-in-out hover:text-white">{composition?.name ?? "No name"}</h2>
      {/* <h3 className="text-sm font-thin text-gray-300">{composition?.tracks?.length ?? 0} Songs</h3> */}
    </div>
  </div>
}

export default function Library({sdkProps, playlistCount = 4}: {sdkProps: SdkProps, playlistCount?: number}) {
  const [playlists, setPlaylists] = useState<PartialPlaylist[]>(createPlaylistPlaceholders(playlistCount || 4))
  const [tags, setTags] = useState<TagWithTracks[]>([])
  const [compositions, setCompositions] = useState<Composition[]>([])
  const [active, setActive] = useState<"Playlists" | "Tags" | "Compositions">("Playlists")
  const pills: ["Playlists", "Tags", "Compositions"] = ["Playlists", "Tags", "Compositions"]

  useEffect(() => {
    localStorage.getItem("sideNavPlaylists") && setPlaylists(JSON.parse(localStorage.getItem("sideNavPlaylists")!))

    try {
      const sdk = SpotifyApi.withAccessToken(sdkProps.clientId, sdkProps.token);
      sdk.currentUser.playlists.playlists().then(playlist => {
        localStorage.setItem("sideNavPlaylists", JSON.stringify(playlist.items))
        setPlaylists(playlist.items)
        Cookies.set("playlistCount", playlist.items.length.toString())
      })
      setTags(getTagListWithData())
      setCompositions(getCompositionList())
    } catch(e) {
      document.location.href = "/?error=token_error"
    }
  }, [])

  return <div className="flex flex-col h-full">
    <h2 className="text-lg text-white">Your Library</h2>
    <div className="flex flex-row gap-4 mt-4">
      {pills.map((pill) => 
        <Pill key={pill} text={pill} active={pill === active} onClick={() => setActive(pill)} />
      )}
    </div>
    <ul className="mt-4 flex-grow overflow-y-auto">
      {active === "Playlists" && playlists.map((playlist: PartialPlaylist) => (
        <li key={playlist.id} className="mb-3">
          <PlaylistTile playlist={playlist} />
        </li>
      ))}
      {active === "Tags" && tags.map((tag: TagWithTracks) => (
        <li key={tag.id} className="mb-3">
          <TagTile tag={tag} />
        </li>
      ))}
      {active === "Compositions" && compositions.map((composition: Composition) => (
        <li key={composition.id} className="mb-3">
          <CompositionTile composition={composition} />
        </li>
      ))}
    </ul>
  </div>
}