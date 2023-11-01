import type { Playlist, Track } from "@spotify/web-api-ts-sdk";
import React, { useRef } from "react";
import TaggerModal from "./TaggerModal";
interface AppProps {
  playlist: Playlist;
}

const TrackTagger: React.FC<AppProps> = ({ playlist }) => {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [track, setTrack] = React.useState<Track | null>(null);

  return (
    <>
      <h1>{playlist.name}</h1>
      <details>
        <summary>json dump</summary>
        <pre>{JSON.stringify(playlist, null, 2)}</pre>
      </details>

      {track && <TaggerModal track={track} isOpen={isModalOpen} />}

      <div className="bg-gray-900 flex flex-col gap-3 py-3">
        {playlist.tracks.items.map((playlistedTrack) => {
          if (playlistedTrack.track.type !== "track") {
            return;
          }
          const track = playlistedTrack.track as Track;
          const splitUri = track.uri.split(":");
          const isLocalTrack = splitUri[1] === "local";
          const trackUrl = isLocalTrack ? track.uri : `https://open.spotify.com/track/${splitUri[2]}`;

          return (
            <div key={track.id} className="flex gap-2 flex-row items-center">
              <button className="bg-green-800 p-2">play</button>
              <a href={trackUrl} target="_blank">
                {track.name}
              </a>
              <button
                className="bg-orange-800 p-2"
                onClick={() => {
                  setTrack(track);
                  setModalOpen(true);
                }}
              >
                add tag
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TrackTagger;
