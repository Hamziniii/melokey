import { queueAtom } from "./store";
import { useStore } from "@nanostores/react";

export default function Queue() {
  const queue = useStore(queueAtom);

  return (
    <div
      id="queue-main"
      className=" h-full w-full bg-zinc-900 rounded-lg p-4 grid grid-flow-row grid-cols-1 overflow-hidden"
    >
      <h2 className="text-lg pb-1">Queue</h2>
      <div className="flex flex-col gap-2 overflow-y-auto rounded-lg">
        {queue.map((song, index) => {
          const image = song.album?.images[0]?.url;

          return (
            <div
              key={index}
              className="flex flex-row gap-2 justify-between w-full"
            >
              {image ? (
                <img className="w-12 h-12" src={image} />
              ) : (
                <div className="w-12 h-12 bg-gray-900 rounded-lg"></div>
              )}
              <div className="flex flex-col flex-shrink-1 justify-between gap-1 w-full overflow-x-hidden max-w-full">
                <p className="text-zinc-100 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap">
                  {song.name.substring(0, 35)}
                </p>
                <p className="text-zinc-300 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap">
                  {song.artists
                    .map((artist) => artist.name)
                    .join(", ")
                    .substring(0, 35)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
