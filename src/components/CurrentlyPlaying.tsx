import { SpotifyApi, type SimplifiedPlaylist, type Track } from "@spotify/web-api-ts-sdk"
import { useEffect, useState } from "react"
import type { SdkProps } from "../middleware"

export default function CurrentlyPlaying({sdkProps}: {sdkProps: SdkProps}) {
  const [sdk, setSdk] = useState<SpotifyApi | null>(null)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Track | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [cInterval, setCInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    try {
      const _sdk = SpotifyApi.withAccessToken(sdkProps.clientId, sdkProps.token)
      setSdk(_sdk)
      setCInterval(setInterval(() => {
        _sdk?.player.getCurrentlyPlayingTrack().then(track => {
          setCurrentlyPlaying(track?.item as Track)
          setImage((track?.item as Track)?.album?.images[0]?.url)
        })
      }, 1000))
    } catch(e) {
      console.error(e)
    }

    return () => { clearInterval(cInterval as NodeJS.Timeout) }
  }, [])
  
  useEffect(() => {
    sdk?.player.getCurrentlyPlayingTrack().then(track => {
      setCurrentlyPlaying(track?.item as Track)
      setImage((track?.item as Track)?.album?.images[0]?.url)
    }).catch(e => {
      console.error(e)
    })
  }, [])

  return (
    <div className="w-full h-full bg-gray-700 rounded-lg">
      <h1>Currently Playing</h1>
      { image && <img src={image} /> }
      <h2>{currentlyPlaying?.name}</h2>
    </div>
  )
}