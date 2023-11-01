import { SpotifyApi, type SimplifiedPlaylist, type PlaylistedTrack, type Page, type Track } from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react";
import type { SdkProps } from "../../middleware";
import { FastAverageColor } from "fast-average-color";
import { getCompositionById, getTracksThatShareTags } from "../../common-client/compositionsManagement";
import { TrackRowItem } from "../playlist/Playlist";

function msToTime(duration: number) {
  let milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  let hours2 = hours < 10 ? "0" + hours : hours;
  let minutes2 = minutes < 10 ? "0" + minutes : minutes;
  let seconds2 = seconds < 10 ? "0" + seconds : seconds;

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
`;

export default function Composition({ sdkProps, compositionId }: { sdkProps: SdkProps; compositionId: string }) {
  const [isPageReady, setIsPageReady] = useState<boolean>(false);
  const [sdk, setSdk] = useState<SpotifyApi | null>(null);
  const [playlist, setPlaylist] = useState<SimplifiedPlaylist | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [trackPage, setTrackPage] = useState<Page<PlaylistedTrack> | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    if (image) {
      const fac = new FastAverageColor();
      fac
        .getColorAsync(image)
        .then((color) => {
          setColor(color.hex);
          document.getElementById("playlist-main")?.style.setProperty("--tw-gradient-from", color.hex);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [image]);

  useEffect(() => {
    // grab composition data
    const composition = getCompositionById(compositionId);

    if (!composition) {
      return setIsPageReady(true);
    }

    const trackList = getTracksThatShareTags(composition.tags);
    const _sdk = SpotifyApi.withAccessToken(sdkProps.clientId, sdkProps.token);
    setSdk(_sdk);

    if(trackList.length > 0)
      _sdk.tracks.get(trackList).then((tracks) => {
        setTracks(tracks);
        setIsPageReady(true);
      });
  }, []);

  if (!isPageReady) {
    return <h2>loading...</h2>;
  }

  async function addSongsToQueue() {
    const sdk = SpotifyApi.withAccessToken(sdkProps.clientId, sdkProps.token)
    while(tracks.length) {
      const track = tracks.shift()
      if(track?.uri)
        await sdk.player.addItemToPlaybackQueue(track.uri)
    }
  }

  // function getNextPage() {
  //   if (trackPage?.next) {
  //     let offset = trackPage.offset + trackPage.limit;
  //     sdk?.playlists.getPlaylistItems(compositionId, undefined, undefined, undefined, offset).then((newTracks) => {
  //       setTrackPage(newTracks);
  //       setTracks([...tracks, ...newTracks.items]);
  //     });
  //   }
  // }

  return (
    <div id="playlist-main" className="flex flex-col h-full w-full p-2 transition-all ease-in-out bg-gradient-to-b from-slate-900">
      {/* <style>{jankyCSS}</style> */}
      <div className="mt-16 flex flex-row pb-4">
        <div className="self-center flex-shrink-0 w-56 h-56 min-w-56 min-h-56 rounded-md bg-gray-900 text-gray-500">
          {image ? <img id="playlist-img" crossOrigin="anonymous" src={image} className="w-56 h-56 rounded-md" /> : <div className="text-6xl">no image</div>}
        </div>
        <div className="flex flex-col-reverse ml-4 pb-2">
          <div className="flex flex-row">
            {false ? (
              <>
                <p className="text-sm font-thin pl-[.4em] mr-2">
                  {tracks.length} / {trackPage?.total} Songs Loaded
                </p>
                {/* <button onClick={getNextPage} className="mr-auto underline text-sm font-thin text-gray-300 transition-colors duration-150 ease-in-out hover:text-white">
                  Load More
                </button> */}
              </>
            ) : (
              <p className="text-sm font-thin pl-[.4em] mr-2">{tracks.length} Songs</p>
            )}
            <button onClick={addSongsToQueue} className="mr-auto underline text-sm font-thin text-gray-300 transition-colors duration-150 ease-in-out hover:text-white">
              Add to Queue
            </button>
          </div>
          <h2 className="text-5xl pt-1 text-white">Composition name here</h2>
          <p className="text-sm pl-1 font-thin text-gray-200">Composition</p>
        </div>
      </div>
      <div className="w-full h-full bg-[#0000001d] overflow-y-auto px-4 pb-4 rounded-lg relative">
        <table className="w-full table relative">
          <thead>
            <tr className="sticky top-0 backdrop-blur-lg pt-4">
              <th className="text-left text-sm font-thin text-gray-300 m-4 py-4">Title</th>
              <th className="text-left text-sm font-thin text-gray-300">Album</th>
              <th className="text-left text-sm font-thin text-gray-300">Tags</th>
              <th className="text-left text-sm font-thin text-gray-300">Duration</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track, index) => {
              // TODO - make sure that this updates if the user removes the tag from the track
              return <TrackRowItem key={"" + track?.id + index} track={track} />
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
