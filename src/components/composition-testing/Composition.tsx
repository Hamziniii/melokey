import { SpotifyApi, type SimplifiedPlaylist, type PlaylistedTrack, type Page, type Track } from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react";
import type { SdkProps } from "../../middleware";
import { FastAverageColor } from "fast-average-color";
import { getCompositionById, getTracksThatShareTags, type Composition, resolveComposition } from "../../common-client/compositionsManagement";
import { TrackRowItem } from "../playlist/Playlist";
import DeleteComposition from "../modal/DeleteComposition";
import { openModal } from "../modal/store";
import EditComposition from "../modal/EditComposition";
import AudioFeatures from "../audio-features/AudioFeatures";
import { getTagById } from "../../common-client/tagManagement";

function msToTime(duration: number) {
  const milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  const hours2 = hours < 10 ? "0" + hours : hours;
  const minutes2 = minutes < 10 ? "0" + minutes : minutes;
  const seconds2 = seconds < 10 ? "0" + seconds : seconds;

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
  const [compositionData, setCompositionData] = useState<Composition | null | undefined>(null);
  const [tagNames, setTagNames] = useState<string[]>([]);

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
    console.log("==== GOT COMPOSITION", composition);
    setCompositionData(composition);

    if (!composition) {
      return setIsPageReady(true);
    }

    const names = composition.tags.reduce((acc, tagId) => {
      const tag = getTagById(tagId);
      if (tag) acc.push(tag.name);
      return acc;
    }, [] as string[]);

    setTagNames(names);

    const trackList = resolveComposition(composition.id);
    const _sdk = SpotifyApi.withAccessToken(sdkProps.clientId, sdkProps.token);
    setSdk(_sdk);

    if (trackList.length > 0) {
      _sdk.tracks.get(trackList).then((tracks) => {
        setTracks(tracks);
        setIsPageReady(true);
      });
    } else {
      // page is ready, but there are no tracks
      setIsPageReady(true);
    }
  }, []);

  if (!isPageReady) {
    return <h2>loading...</h2>;
  }

  if (!compositionData) {
    return <h2 className="text-3xl">Composition not found!</h2>;
  }

  async function addSongsToQueue() {
    const sdk = SpotifyApi.withAccessToken(sdkProps.clientId, sdkProps.token);
    while (tracks.length) {
      const track = tracks.shift();
      if (track?.uri) await sdk.player.addItemToPlaybackQueue(track.uri);
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

  function deleteComposition() {
    if (compositionData) openModal(<DeleteComposition composition={compositionData} />);
  }

  function editComposition() {
    if (compositionData)
      openModal(<EditComposition composition={compositionData} />, () => {
        // const _composition = getCompositionById(compositionId);
        // if (_composition) setCompositionData(_composition);

        // reload the page to make the sdk get the new tracks from the new tags
        document.location.reload();
      });
  }

  return (
    <div id="playlist-main" className="relative flex flex-col h-full w-full p-2 transition-all ease-in-out bg-gradient-to-b from-slate-900">
      {/* <style>{jankyCSS}</style> */}
      <div className="absolute" style={{ top: "1.3rem", left: "1.3rem" }}>
        <AudioFeatures trackIds={tracks?.map(t => t.id)} />
      </div>

      <div className="mt-16 flex flex-row pb-4">
        <div className="self-center flex-shrink-0 w-56 h-56 min-w-56 min-h-56 rounded-md bg-gray-900 text-gray-500">
          {image ? <img id="playlist-img" crossOrigin="anonymous" src={image} className="w-56 h-56 rounded-md" /> : <div className="text-6xl">no image</div>}
        </div>
        <div className="flex flex-col-reverse ml-4 pb-2">
          <div className="flex flex-row gap-2">
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
            <button onClick={addSongsToQueue} className=" underline text-sm font-thin text-gray-300 transition-colors duration-150 ease-in-out hover:text-white">
              Add to Queue
            </button>
            <button
              className="text-sm font-thin text-gray-400 underline hover:text-red-500 transition-colors ease-in-out duration-150 cursor-pointer select-none"
              onClick={deleteComposition}
            >
              Delete Composition
            </button>
            <button
              className="text-sm font-thin text-gray-400 underline transition-colors ease-in-out duration-150 cursor-pointer select-none hover:text-white"
              onClick={editComposition}
            >
              Edit Composition
            </button>
          </div>
          <p className="text-sm pl-1 font-thin text-gray-200">{(compositionData?.type == "union" ? "Union" : "Intersection")} of {tagNames.join(", ")}</p>
          <p className="text-sm pl-1 font-thin text-gray-200">{compositionData?.description}</p>
          <h2 className="text-5xl pt-1 text-white">{compositionData?.name}</h2>
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
              return <TrackRowItem key={"" + track?.id + index} track={track} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
