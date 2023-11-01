import { useStore } from "@nanostores/react";
import { trackAtom } from "./store";
import { useEffect, useState } from "react";
import {
  createTagPlaceholders,
  getTagList,
  getTagListWithData,
  type Tag,
  type TagWithTracks,
} from "../../common-client/tagManagement";
import {
  addTrackToTagList,
  removeTrackFromTagList,
  getTagsByTrackId,
} from "../../common-client/trackManagement";
import Cookies from "js-cookie";

export default function TagPane() {
  const track = useStore(trackAtom);
  const [tags, setTags] = useState<TagWithTracks[]>([]);
  const [trackTags, setTrackTags] = useState<TagWithTracks[]>([]);
  const [otherTags, setOtherTags] = useState<TagWithTracks[]>([]);
  const [triggerUpdate, setTriggerUpdate] = useState(false);

  useEffect(() => {
    const _tags = getTagListWithData();
    setTags(_tags);
    Cookies.set("tagCount", _tags.length.toString());
  }, []);

  useEffect(() => {
    if (track) {
      const tags = getTagListWithData();
      setTags(tags);
      const _tags = getTagsByTrackId(track.id);
      const _tagIds = _tags.map((tag) => tag.id);

      const have = [];
      const notHave = [];

      for (const tag of tags) {
        if (_tagIds.includes(tag.id)) {
          have.push(tag);
        } else {
          notHave.push(tag);
        }
      }

      setTrackTags(have);
      setOtherTags(notHave);
    }
  }, [track, triggerUpdate]);

  function addTag(tag: Tag) {
    if (track) {
      addTrackToTagList(track, tag.id);
      setTriggerUpdate(!triggerUpdate);
    }
  }

  function removeTag(tag: Tag) {
    if (track) {
      removeTrackFromTagList(track, tag.id);
      setTriggerUpdate(!triggerUpdate);
    }
  }

  return (
    <div
      id="tab-pane-main"
      className=" h-full w-full bg-zinc-900 rounded-lg grid grid-flow-row grid-rows-2 p-4 overflow-hidden"
    >
      <div className="flex flex-col overflow-hidden">
        <h2 className="pb-1">Song Tags</h2>
        <div className="flex flex-col flex-grow-0 overflow-y-auto gap-1 rounded-lg">
          {trackTags.length > 0 ? (
            trackTags.map((tag) => (
              <div className="flex flex-row gap-2" key={tag.id}>
                <div
                  className="bg-gradient-to-b flex-shrink-0 from-slate-600 to-bg-zinc-800 rounded-lg h-12 w-12 cursor-pointer"
                  style={
                    { "--tw-gradient-from": tag.color } as React.CSSProperties
                  }
                  onClick={() => removeTag(tag)}
                >
                  <span className="w-full h-full material-symbols-outlined text-white text-4xl grid place-content-center">
                    remove
                  </span>
                </div>
                <div className="flex flex-col flex-shrink-1 justify-around gap-1 w-full overflow-x-hidden max-w-full">
                  <p className="text-zinc-100 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap">
                    {tag.name.substring(0, 35)}
                  </p>
                  <p className="text-zinc-300 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap font-thin">
                    {tag.tracks.length} Songs
                  </p>
                </div>
              </div>
            ))
          ) : (
            <>
              <p className="text-zinc-100 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap">
                No tags
              </p>
              <p className="text-zinc-300 text-xs overflow-ellipsis overflow-hidden whitespace-nowrap font-thin">
                Maybe you should add some tags 👀
              </p>
            </>
          )}
        </div>
      </div>
      <div className="h-full flex flex-col overflow-hidden">
        <h2 className="pb-1">Tag Song</h2>
        <div className="flex flex-col h-full flex-grow-0 overflow-y-auto gap-1 rounded-lg">
          {otherTags.length > 0 ? (
            otherTags.map((tag) => (
              <div className="flex flex-row gap-2" key={tag.id}>
                <div
                  className="bg-gradient-to-b flex-shrink-0 from-slate-600 to-bg-zinc-800 rounded-lg h-12 w-12 cursor-pointer"
                  style={
                    { "--tw-gradient-from": tag.color } as React.CSSProperties
                  }
                  onClick={() => addTag(tag)}
                >
                  <span className="w-full h-full material-symbols-outlined text-white text-4xl grid place-content-center">
                    add
                  </span>
                </div>
                <div className="flex flex-col flex-shrink-1 justify-around gap-1 w-full overflow-x-hidden max-w-full">
                  <p className="text-zinc-100 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap">
                    {tag.name.substring(0, 35)}
                  </p>
                  <p className="text-zinc-300 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap font-thin">
                    {tag.tracks.length} Songs
                  </p>
                </div>
              </div>
            ))
          ) : (
            <>
              <p className="text-zinc-100 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap">
                No tags
              </p>
              <p className="text-zinc-300 text-xs overflow-ellipsis overflow-hidden whitespace-nowrap font-thin">
                Maybe you should create some tags 👀
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
