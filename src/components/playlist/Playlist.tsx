import { SpotifyApi, type SimplifiedPlaylist, type PlaylistedTrack, type Page, type Track } from "@spotify/web-api-ts-sdk"
import { useEffect, useState,  } from "react"
import type { SdkProps } from "../../middleware"
import { FastAverageColor } from 'fast-average-color';

function msToTime(duration: number) {
  let milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  let hours2 = (hours < 10) ? "0" + hours : hours;
  let minutes2 = (minutes < 10) ? "0" + minutes : minutes;
  let seconds2 = (seconds < 10) ? "0" + seconds : seconds;

  return (hours > 0 ? hours2 + ":" : "") + minutes2 + ":" + seconds2;
}

const jankyCSS = `
table::before {
  content: " ";
  display: inline-block;
  position: sticky;
  top: 20px;
  left: 0;
  width: 20px;
  height: 20px;
  background-color: blue;
}
`

export function TrackRowItem({track}: {track: Track}) {
  return <tr key={track.id}>
    <td id={track.id} className="flex flex-row mb-2 pr-4 gap-4">
      <img src={track?.album?.images[0]?.url} className="w-12 h-12 rounded-md" />
      <div className="flex flex-col">
        <p className="">{track.name || "N/A"}</p>
        <p className="font-thin text-sm text-gray-400">{track?.artists?.map(artist => artist.name).join(", ") || "N/A"}</p>
      </div>
    </td>
    <td className="text-sm font-thin text-gray-400">{track.album.name || "N/A"}</td>
    {/* <td className="text-sm font-thin text-gray-400">{new Date(t.added_at).toDateString()}</td> */}
    <td className="text-sm font-thin text-gray-400">{msToTime(track.duration_ms)}</td>
  </tr>
}

export default function Playlist({sdkProps, playlistId}: {sdkProps: SdkProps, playlistId: string}) {
  const [sdk, setSdk] = useState<SpotifyApi | null>(null)
  const [playlist, setPlaylist] = useState<SimplifiedPlaylist | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [trackPage, setTrackPage] = useState<Page<PlaylistedTrack>| null>(null)
  const [tracks, setTracks] = useState<PlaylistedTrack[]>([])
  const [color, setColor] = useState<string | null>(null)

  useEffect(() => {
    if(image) {
      const fac = new FastAverageColor()
      fac.getColorAsync(image)
      .then(color => {
        setColor(color.hex)
        document.getElementById("playlist-main")?.style.setProperty("--tw-gradient-from", color.hex)
      })
      .catch(e => { console.log(e); })
    }
  }, [image])

  useEffect(() => {
    const _sdk = SpotifyApi.withAccessToken(sdkProps.clientId, sdkProps.token)
    setSdk(_sdk)
    _sdk.playlists.getPlaylist(playlistId).then(playlist => setPlaylist(playlist))
    _sdk.playlists.getPlaylistCoverImage(playlistId).then(image => setImage(image[0]?.url))
    _sdk.playlists.getPlaylistItems(playlistId).then(tracks => [setTrackPage(tracks), setTracks(tracks.items)])
  }, [])

  function getNextPage() {
    if(trackPage?.next) {
      let offset = trackPage.offset + trackPage.limit
      sdk?.playlists.getPlaylistItems(playlistId, undefined, undefined, undefined, offset).then(newTracks => {
        setTrackPage(newTracks)
        setTracks([...tracks, ...newTracks.items])
      })
    }
  }

  return <div id="playlist-main" className="flex flex-col h-full w-full p-2 transition-all ease-in-out bg-gradient-to-b from-slate-900">
    {/* <style>{jankyCSS}</style> */}
    <div className="mt-16 flex flex-row pb-4">
      <div className="self-center flex-shrink-0 w-56 h-56 min-w-56 min-h-56 rounded-md bg-gray-900 text-gray-500">
        {image ? <img id="playlist-img" crossOrigin="anonymous" src={image} className="w-56 h-56 rounded-md" /> : <div className="text-6xl">no image</div>}
      </div>
      <div className="flex flex-col-reverse ml-4 pb-2">
        <div className="flex flex-row">
          {
            tracks.length != trackPage?.total ?
            <>
              <p className="text-sm font-thin pl-[.2em] mr-2">{tracks.length} / {trackPage?.total} Songs Loaded</p>
              <button onClick={getNextPage} className="mr-auto underline text-sm font-thin text-gray-300 transition-colors duration-150 ease-in-out hover:text-white">Load More</button>
            </> :
            <p className="text-sm font-thin pl-[.2em] mr-2">{tracks.length} Songs</p>
          }
        </div>
        <h2 className="text-5xl pt-1 text-white">{playlist?.name}</h2>
        <p className="text-sm pl-[.1em] font-thin text-gray-200">{playlist?.public ? "Public" : "Private"} Playlist</p>
      </div>
    </div>
    <div className="w-full h-full bg-[#0000001d] overflow-y-auto px-4 pb-4 rounded-lg relative">
      <table className="w-full table relative">
        <thead>
          <tr className="sticky top-0 backdrop-blur-lg pt-4">
            <th className="text-left text-sm font-thin text-gray-300 m-4 py-4">Title</th>
            <th className="text-left text-sm font-thin text-gray-300">Album</th>
            {/* <th className="text-left text-sm font-thin text-gray-300">Added</th> */}
            <th className="text-left text-sm font-thin text-gray-300">Duration</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((t, index, arr) => {
            const track = t.track as any as Track
            return <TrackRowItem key={"" + track.id + index} track={track} />
          })}
        </tbody>
      </table>
    </div>
  </div>
}