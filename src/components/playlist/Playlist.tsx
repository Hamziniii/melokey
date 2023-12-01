import {
  SpotifyApi,
  type SimplifiedPlaylist,
  type PlaylistedTrack,
  type Page,
  type Track,
} from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react";
import type { SdkProps } from "../../middleware";
import { FastAverageColor } from "fast-average-color";
import { getTagsByTrackId } from "../../common-client/trackManagement";
import { isOpenAtom, openModal } from "../modal/store";
import EditTags from "../modal/EditTags";

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

const tagMax = 2;
export function TrackRowItem({ track }: { track: Track }) {
  const [tags, setTags] = useState(getTagsByTrackId(track.id));

  // TOOD - onclose callback, so we can update tags
  function getTags() {
    setTags(getTagsByTrackId(track.id));
  }

  useEffect(() => {
    getTags();
  }, []);

  function editTags() {
    openModal(<EditTags track={track} />, getTags);
    isOpenAtom.set(true);
  }

  return (
    <tr key={track.id}>
      <td id={track.id} className="flex flex-row mb-2 pr-4 gap-4">
        <img
          src={track?.album?.images[0]?.url}
          className="w-12 h-12 rounded-md"
        />
        <div className="flex flex-col">
          <p className="">{track.name || "N/A"}</p>
          <p className="font-thin text-sm text-gray-400">
            {track?.artists?.map((artist) => artist.name).join(", ") || "N/A"}
          </p>
        </div>
      </td>
      <td className="text-sm font-thin text-gray-400">
        {track.album.name || "N/A"}
      </td>
      <td className="text-sm font-thin text-gray-400">
        <div className="h-full w-full flex flex-row flex-wrap">
          <span
            className="inline-block rounded-full px-3 py-1 text-sm text-white mr-2 mb-2 bg-zinc-900 material-symbols-outlined cursor-pointer"
            onClick={() => editTags()}
          >
            settings
          </span>
          {tags.slice(0, tagMax).map((tag) => {
            return (
              <span
                key={tag.id}
                className="inline-block rounded-full px-3 py-1 text-sm text-white mr-2 mb-2 bg-gradient-to-b from-slate-600"
                style={
                  { "--tw-gradient-from": tag?.color } as React.CSSProperties
                }
              >
                {tag.name}
              </span>
            );
          })}
          {tags.length > tagMax && (
            <div className="group relative w-max">
              <span className="inline-block rounded-full px-3 py-1 text-sm text-white mr-2 mb-2 bg-gradient-to-b from-slate-600">
                +{tags.length - tagMax}
              </span>
              <div className="pointer-events-none absolute top-8 left-0 w-max opacity-0 transition-opacity group-hover:opacity-100 bg-zinc-900 bg-opacity-10 backdrop-blur-md p-3 rounded-3xl z-30">
                {
                  tags.slice(tagMax).map((tag) => {
                    return (
                      <span
                        key={tag.id}
                        className="inline-block rounded-full px-3 py-1 text-sm text-white mx-1 my-1 bg-gradient-to-b from-slate-600"
                        style={
                          { "--tw-gradient-from": tag?.color } as React.CSSProperties
                        }
                      >
                        {tag.name}
                      </span>
                    );
                  })
                }
              </div>
            </div>
          )}
        </div>
      </td>
      <td className="text-sm font-thin text-gray-400">
        {msToTime(track.duration_ms)}
      </td>
    </tr>
  );
}

export default function Playlist({
  sdkProps,
  playlistId,
}: {
  sdkProps: SdkProps;
  playlistId: string;
}) {
  const [sdk, setSdk] = useState<SpotifyApi | null>(null);
  const [playlist, setPlaylist] = useState<SimplifiedPlaylist | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [trackPage, setTrackPage] = useState<Page<PlaylistedTrack> | null>(
    null,
  );
  const [tracks, setTracks] = useState<PlaylistedTrack[]>([]);
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    if (image) {
      const fac = new FastAverageColor();
      fac
        .getColorAsync(image)
        .then((color) => {
          setColor(color.hex);
          document
            .getElementById("playlist-main")
            ?.style.setProperty("--tw-gradient-from", color.hex);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [image]);

  useEffect(() => {
    const _sdk = SpotifyApi.withAccessToken(sdkProps.clientId, sdkProps.token);
    setSdk(_sdk);
    _sdk.playlists
      .getPlaylist(playlistId)
      .then((playlist) => setPlaylist(playlist));
    _sdk.playlists
      .getPlaylistCoverImage(playlistId)
      .then((image) => setImage(image[0]?.url));
    _sdk.playlists
      .getPlaylistItems(playlistId)
      .then((tracks) => [setTrackPage(tracks), setTracks(tracks.items)]);
  }, []);

  function getNextPage() {
    if (trackPage?.next) {
      const offset = trackPage.offset + trackPage.limit;
      sdk?.playlists
        .getPlaylistItems(playlistId, undefined, undefined, undefined, offset)
        .then((newTracks) => {
          setTrackPage(newTracks);
          setTracks([...tracks, ...newTracks.items]);
        });
    }
  }

  return (
    <div
      id="playlist-main"
      className="flex flex-col h-full w-full p-2 transition-all ease-in-out bg-gradient-to-b from-slate-900"
    >
      {/* <style>{jankyCSS}</style> */}
      <div className="mt-16 flex flex-row pb-4">
        <div className="self-center flex-shrink-0 w-56 h-56 min-w-56 min-h-56 rounded-md bg-gray-900 text-gray-500">
          {image ? (
            <img
              id="playlist-img"
              crossOrigin="anonymous"
              src={image}
              className="w-56 h-56 rounded-md"
            />
          ) : (
            <div className="text-6xl">no image</div>
          )}
        </div>
        <div className="flex flex-col-reverse ml-4 pb-2">
          <div className="flex flex-row">
            {tracks.length != trackPage?.total ? (
              <>
                <p className="text-sm font-thin pl-[.2em] mr-2">
                  {tracks.length} / {trackPage?.total} Songs Loaded
                </p>
                <button
                  onClick={getNextPage}
                  className="mr-auto underline text-sm font-thin text-gray-300 transition-colors duration-150 ease-in-out hover:text-white"
                >
                  Load More
                </button>
              </>
            ) : (
              <p className="text-sm font-thin pl-[.2em] mr-2">
                {tracks.length} Songs
              </p>
            )}
          </div>
          <h2 className="text-5xl pt-1 text-white">{playlist?.name}</h2>
          <p className="text-sm pl-[.1em] font-thin text-gray-200">
            {playlist?.public ? "Public" : "Private"} Playlist
          </p>
        </div>
      </div>
      <div className="w-full h-full bg-[#0000001d] overflow-y-auto px-4 pb-4 rounded-lg relative">
        <table className="w-full table relative">
          <thead>
            <tr className="sticky top-0 backdrop-blur-lg pt-4">
              <th className="text-left text-sm font-thin text-gray-300 m-4 py-4">
                Title
              </th>
              <th className="text-left text-sm font-thin text-gray-300">
                Album
              </th>
              <th className="text-left text-sm font-thin text-gray-300">
                Tags
              </th>
              <th className="text-left text-sm font-thin text-gray-300">
                Duration
              </th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((t, index, arr) => {
              const track = t.track as any as Track;
              return <TrackRowItem key={"" + track.id + index} track={track} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
