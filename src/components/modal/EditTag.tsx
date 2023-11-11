import { useEffect, useRef, useState } from "react";
import { updateTag, type Tag } from "../../common-client/tagManagement";
import { closeModal } from "./store";

export default function EditTag({ tag }: { tag: Tag }) {
  const [color, setColor] = useState<string>(tag.color);
  const [name, setName] = useState<string>(tag.name);
  const colorRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (colorRef.current) colorRef.current.value = color;
  }, []);

  function updateColor() {
    if (colorRef.current) setColor(colorRef.current.value);
  }

  function updateName() {
    if (nameRef.current) setName(nameRef.current.value);
  }

  function submit(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    updateTag({ id: tag.id, name, color });
    closeModal();
  }

  return (
    <div className="w-96 h-72 bg-zinc-900 rounded-lg p-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl text-white">Edit Tag</h1>
          <p className="text-sm text-gray-400 font-thin">
            Edit tag {tag.name}!
          </p>
        </div>
        <div
          className="w-12 h-12 rounded-lg bg-gradient-to-b from-slate-600"
          style={{ "--tw-gradient-from": color } as React.CSSProperties}
        />
      </div>
      <form action="" className="flex flex-col mt-4" autoComplete="off">
        <label className="text-sm text-gray-400 font-thin">Tag Name</label>
        <input
          id="name"
          className="bg-zinc-800 rounded-lg p-2 text-white"
          required
          defaultValue={name}
          onKeyUp={updateName}
          ref={nameRef}
        />

        <label className="text-sm text-gray-400 font-thin mt-4">
          Tag Color (in hex)
        </label>
        <input
          className="bg-zinc-800 rounded-lg p-2 text-white"
          type="text"
          id="hex_code"
          name="hex_code"
          onKeyUp={updateColor}
          ref={colorRef}
          pattern="#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?"
          required
        />

        <button
          type="button"
          className="bg-zinc-800 hover:bg-green-500 rounded-lg p-2 text-white mt-4 transition-colors ease-in-out duration-200"
          onClick={submit}
        >
          Update Tag
        </button>
      </form>
    </div>
  );
}
