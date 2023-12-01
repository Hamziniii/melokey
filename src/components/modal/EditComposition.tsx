import { useEffect, useRef, useState } from "react";
import { closeModal } from "./store";
import { updateComposition, type Composition } from "../../common-client/compositionsManagement";
import { getTagListWithData, type TagWithTracks } from "../../common-client/tagManagement";
import { set } from "mongoose";

export default function EditComposition({ composition }: { composition: Composition }) {
  const [name, setName] = useState<string>(composition.name);
  const [description, setDescription] = useState<string>(composition.description);
  const [trackTags, setTrackTags] = useState<TagWithTracks[]>([]);
  const [otherTags, setOtherTags] = useState<TagWithTracks[]>([]);
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const allTags = getTagListWithData();
    const existingTags = allTags.filter((tag) => composition.tags.includes(tag.id));
    setTrackTags(existingTags);
    setOtherTags(getTagListWithData());
  }, []);

  function updateName() {
    if (nameRef.current) setName(nameRef.current.value);
  }

  function updateDescription() {
    if (descriptionRef.current) setDescription(descriptionRef.current.value);
  }

  function addTag(tag: TagWithTracks) {
    setTrackTags([...trackTags, tag]);
  }

  function removeTag(tag: TagWithTracks) {
    setTrackTags(trackTags.filter((t) => t.id !== tag.id));
  }

  function submit(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    const tags = trackTags.map((t) => t.id);
    updateComposition(composition.id, {
      name,
      description,
      tags,
      type: (document.getElementById("type") as HTMLSelectElement)?.value as "union" | "intersection" || "intersection",
    });
    closeModal();
  }

  return (
    <div className="w-96  bg-zinc-900 rounded-lg p-4 ">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl text-white">Edit Composition</h1>
          <p className="text-sm text-gray-400 font-thin">Edit this composition.</p>
        </div>
      </div>
      <form action="" className="flex flex-col mt-4" autoComplete="off">
        <label className="text-sm text-gray-400 font-thin">Name</label>
        <input id="name" className="bg-zinc-800 rounded-lg p-2 text-white" required defaultValue={name} onKeyUp={updateName} ref={nameRef} />

        <label className="text-sm text-gray-400 font-thin">Description</label>
        <input id="name" className="bg-zinc-800 rounded-lg p-2 text-white" required defaultValue={description} onKeyUp={updateDescription} ref={descriptionRef} />

        <label className="text-sm text-gray-400 font-thin pt-2">Type</label>
        <select id="type" defaultValue={composition.type || "intersection"} className="block w-full p-2.5 bg-zinc-800 placeholder-gray-400 text-white rounded-lg">
          <option value="union">Union</option>
          <option value="intersection">Intersection</option>
        </select>

        <div className="flex flex-row gap-2 mt-4 overflow-hidden" style={{ height: "300px" }}>
          <div className="flex flex-col flex-grow shrink-0">
            <p>Tags</p>
            <div className="flex flex-col flex-grow-0 overflow-y-auto gap-1 rounded-lg">
              {trackTags.length > 0 ? (
                trackTags.map((tag) => (
                  <div className="flex flex-row gap-2" key={tag.id}>
                    <div
                      className="bg-gradient-to-b flex-shrink-0 from-slate-600 to-bg-zinc-800 rounded-lg h-12 w-12 cursor-pointer"
                      style={
                        {
                          "--tw-gradient-from": tag.color,
                        } as React.CSSProperties
                      }
                      onClick={() => removeTag(tag)}
                    >
                      <span className="w-full h-full material-symbols-outlined text-white text-4xl grid place-content-center">remove</span>
                    </div>
                    <div className="flex flex-col flex-shrink-1 justify-around gap-1 w-full overflow-x-hidden max-w-full">
                      <p className="text-zinc-100 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap">{tag.name.substring(0, 35)}</p>
                      <p className="text-zinc-300 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap font-thin">{tag.tracks.length} Songs</p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <p className="text-zinc-100 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap">No tags</p>
                  <p className="text-zinc-300 text-xs overflow-ellipsis overflow-hidden whitespace-nowrap font-thin">Maybe you should add some tags 👀</p>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col flex-grow shrink-0 overflow-y-hidden">
            <p>All Tags</p>
            <div className="flex flex-col h-full flex-grow-0 overflow-y-auto overflow-x-hidden gap-1 rounded-lg">
              {otherTags.length > 0 ? (
                otherTags.map((tag) => {
                  // skip if trackTags has an object with the same id
                  if (trackTags.find((t) => t.id === tag.id)) return null;
                  return (
                    <div className="flex flex-row gap-2" key={tag.id}>
                      <div
                        className="bg-gradient-to-b flex-shrink-0 from-slate-600 to-bg-zinc-800 rounded-lg h-12 w-12 cursor-pointer"
                        style={
                          {
                            "--tw-gradient-from": tag.color,
                          } as React.CSSProperties
                        }
                        onClick={() => addTag(tag)}
                      >
                        <span className="w-full h-full material-symbols-outlined text-white text-4xl grid place-content-center">add</span>
                      </div>
                      <div className="flex flex-col flex-shrink-1 justify-around gap-1 w-full overflow-x-hidden">
                        <p className="text-zinc-100 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap">{tag.name.substring(0, 35)}</p>
                        <p className="text-zinc-300 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap font-thin">{tag.tracks.length} Songs</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <>
                  <p className="text-zinc-100 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap">No tags</p>
                  <p className="text-zinc-300 text-xs overflow-ellipsis overflow-hidden whitespace-nowrap font-thin">Maybe you should create some tags 👀</p>
                </>
              )}
            </div>
          </div>
        </div>

        <button type="button" className="bg-zinc-800 hover:bg-green-500 rounded-lg p-2 text-white mt-4 transition-colors ease-in-out duration-200" onClick={submit}>
          Update Composition
        </button>
      </form>
    </div>
  );
}
