import { SpotifyApi, type Track } from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react";
import type { SdkProps } from "../../middleware";
import { getTagWithData, type Tag, type TagWithTracks } from "../../common-client/tagManagement";
import { TrackRowItem } from "../playlist/Playlist";
import { openModal } from "../modal/store";
import DeleteTag from "../modal/DeleteTag";
import EditTag from "../modal/EditTag";
import AudioFeatures from "../audio-features/AudioFeatures";

function partitionToChunks<T>(array: T[], chunkSize: number) {
  const results = [];
  while (array.length) {
    results.push(array.splice(0, chunkSize));
  }
  return results;
}

type IdToTrack = Record<string, Track | null>;

export default function Tag({ sdkProps, tagId }: { sdkProps: SdkProps; tagId: string }) {
  const [trackMap, setTrackMap] = useState<IdToTrack>({});
  const [tag, setTag] = useState<TagWithTracks | null>(null);
  const [trackCount, setTrackCount] = useState<number>(0);
  const [trackEntries, setTrackEntries] = useState<Track[]>([]);

  useEffect(() => {
    try {
      const _tag = getTagWithData(tagId);
      if (!_tag) return;

      // LITERALLY WHY IS THIS NOT WORKING ???????????????????
      // WHY IS TAG.TRACKS NOT POPULATED ??????????? EVEN THOUGH IT LITERALLY IS??????????
      setTag(_tag);
      setTrackCount(_tag.tracks.length);

      const tracks = _tag.tracks;
      const trackPartition = partitionToChunks(tracks, 50);
      const sdk = SpotifyApi.withAccessToken(sdkProps.clientId, sdkProps.token);

      const _tM = { ...trackMap };
      const ps = trackPartition.map((partition) => {
        return sdk.tracks.get(partition).then((tracks) => {
          tracks.forEach((track) => {
            _tM[track.id] = track;
          });
        });
      });
      Promise.allSettled(ps).then(() => setTrackMap(_tM));
    } catch (e) {
      console.error(e);
    }
  }, []);

  function deleteTag() {
    if (tag) openModal(<DeleteTag tag={tag} />);
  }

  function editTag() {
    if (tag)
      openModal(<EditTag tag={tag} />, () => {
        const _tag = getTagWithData(tagId);
        if (_tag) setTag(_tag);
      });
  }

  async function addSongsToQueue() {
    const sdk = SpotifyApi.withAccessToken(sdkProps.clientId, sdkProps.token);
    const tracks = trackEntries;
    while (tracks.length) {
      const track = tracks.shift();
      if (track?.uri) await sdk.player.addItemToPlaybackQueue(track.uri);
    }
  }

  useEffect(() => {
    setTrackEntries(Object.values(trackMap).filter((track) => track !== null) as Track[]);
  }, [trackMap]);

  return (
    <div id="playlist-main" className="relative flex flex-col h-full w-full p-2 transition-all ease-in-out bg-gradient-to-b from-slate-900">
      <div className="absolute" style={{ top: "1.3rem", left: "1.3rem" }}>
        <AudioFeatures trackIds={trackEntries?.map(t => t.id)} />
      </div>

      <div className="mt-16 flex flex-row pb-4">
        <div
          className="self-center flex-shrink-0 w-32 h-32 min-w-56 min-h-56 rounded-md bg-gradient-to-b from-slate-600 to-bg-zinc-800"
          style={{ "--tw-gradient-from": tag?.color } as React.CSSProperties}
        ></div>

        <div className="flex flex-col-reverse ml-4 pb-2">
          <div className="flex flex-row gap-2">
            <p className="text-sm font-thin pl-[.2em]">{trackCount} Songs</p>
            <button
              className="text-sm font-thin text-gray-400 underline hover:text-green-500 transition-colors ease-in-out duration-150 cursor-pointer select-none"
              onClick={addSongsToQueue}
            >
              Add to Queue
            </button>
            <button
              className="text-sm font-thin text-gray-400 underline hover:text-red-500 transition-colors ease-in-out duration-150 cursor-pointer select-none"
              onClick={deleteTag}
            >
              Delete Tag
            </button>
            <button
              className="text-sm font-thin text-gray-400 underline hover:text-white transition-colors ease-in-out duration-150 cursor-pointer select-none"
              onClick={editTag}
            >
              Edit Tag
            </button>
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
          <tbody>{trackEntries.map((track) => (track ? <TrackRowItem key={track.id} track={track} /> : null))}</tbody>
        </table>
      </div>
    </div>
  );
}
