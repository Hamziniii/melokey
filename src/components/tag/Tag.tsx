import { SpotifyApi, type Track } from "@spotify/web-api-ts-sdk"
import { useEffect, useState,  } from "react"
import type { SdkProps } from "../../middleware"
import { getTagWithData, type Tag, type TagWithTracks } from "../../common-client/tagManagement"
import { TrackRowItem } from "../playlist/Playlist"

function partitionToChunks<T>(array: T[], chunkSize: number) {
  const results = []
  while(array.length) {
    results.push(array.splice(0, chunkSize))
  }
  return results
}

type IdToTrack = Record<string, Track | null>

export default function Tag({sdkProps, tagId}: {sdkProps: SdkProps, tagId: string}) {
  const [trackMap, setTrackMap] = useState<IdToTrack>({})
  const [tag, setTag] = useState<TagWithTracks | null>(null)
  const [trackCount, setTrackCount] = useState<number>(0)

  useEffect(() => {
    try {
      const _tag = getTagWithData(tagId)
      if(!_tag)
        return 
      
      // LITERALLY WHY IS THIS NOT WORKING ???????????????????
      // WHY IS TAG.TRACKS NOT POPULATED ??????????? EVEN THOUGH IT LITERALLY IS??????????
      setTag(_tag)
      setTrackCount(_tag.tracks.length)

      const tracks = _tag.tracks
      const trackPartition = partitionToChunks(tracks, 50)
      const sdk = SpotifyApi.withAccessToken(sdkProps.clientId, sdkProps.token)

      trackPartition.forEach(partition => {
        sdk.tracks.get(partition).then(tracks => {
          let _tM = {...trackMap} 
          tracks.forEach(track => {
            _tM[track.id] = track
          })
          setTrackMap(_tM)
        })
      })
    } catch(e) {
      console.error(e)
    }
  }, [])

  return <div id="playlist-main" className="flex flex-col h-full w-full p-2 transition-all ease-in-out bg-gradient-to-b from-slate-900">
    <div className="mt-16 flex flex-row pb-4">
      <div className="self-center flex-shrink-0 w-32 h-32 min-w-56 min-h-56 rounded-md bg-gradient-to-b from-slate-600 to-bg-zinc-800" style={{"--tw-gradient-from": tag?.color} as React.CSSProperties}>
      </div>
      <div className="flex flex-col-reverse ml-4 pb-2">
        <div className="flex flex-row">
            <p className="text-sm font-thin pl-[.2em] mr-2">{trackCount} Songs</p>
        </div>
        <h2 className="text-5xl pt-1 text-white">{tag?.name}</h2>
        <p className="text-sm pl-[.1em] font-thin text-gray-200">Tag</p>
      </div>
    </div>
    <div className="w-full h-full bg-[#0000001d] overflow-y-auto px-4 pb-4 rounded-lg relative">
      <table className="w-full table relative">
        <thead>
          <tr className="sticky top-0 backdrop-blur-lg pt-4">
            <th className="text-left text-sm font-thin text-gray-300 m-4 py-4">Title</th>
            <th className="text-left text-sm font-thin text-gray-300">Album</th>
            <th className="text-left text-sm font-thin text-gray-300">Duration</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(trackMap).map(track => track ? TrackRowItem({track}) : null)}
        </tbody>
      </table>
    </div>
  </div>
}