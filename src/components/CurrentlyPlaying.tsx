import { SpotifyApi, type SimplifiedPlaylist, type Track } from "@spotify/web-api-ts-sdk"
import { useEffect, useState } from "react"
import type { SdkProps } from "../middleware"
import { FastAverageColor } from 'fast-average-color';

export default function CurrentlyPlaying({sdkProps}: {sdkProps: SdkProps}) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Track | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [cInterval, setCInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    try {
      const sdk = SpotifyApi.withAccessToken(sdkProps.clientId, sdkProps.token)
      const fac = new FastAverageColor()
      const run = () => {
        sdk?.player.getCurrentlyPlayingTrack().then(track => {
          setCurrentlyPlaying(track?.item as Track)
          let img = (track?.item as Track)?.album?.images[0]?.url
          setImage(img)

          fac.getColorAsync(img)
            .then(color => {
              document.getElementById("player-main")?.style.setProperty("--tw-gradient-from", color.hex)
            })
            .catch(e => { console.log(e); })
        })
      }
      run()
      setCInterval(setInterval(run, 1000))
    } catch(e) {
      console.error(e)
    }

    return () => { clearInterval(cInterval as NodeJS.Timeout) }
  }, [])

  return (
    <div id="player-main" className=" h-full w-full transition-all ease-in-out bg-gradient-to-b from-slate-900 rounded-lg grid place-items-center">
      <div>
        { image ? <img className="w-96 h-96" src={image} />
          : <div className="w-96 h-96 bg-gray-900 rounded-lg"></div>
        }

        <h2 className="pt-4">{currentlyPlaying?.name ?? "N/A"}</h2>
        <h3 className="font-thin">{currentlyPlaying?.artists.map(artist => artist.name).join(", ") ?? "N/A"}</h3>
      </div>
    </div>
  )
}