import { useEffect, useState } from "react";
import { createTagPlaceholders, getTagList, getTagListWithData, type Tag, type TagWithTracks } from "../../common-client/tagManagement";
import Cookies from "js-cookie";
import { openModal } from "../modal/store";
import NewCompositionModal from "../modal/NewComposition";
import { getCompositionList, type Composition } from "../../common-client/compositionsManagement";

export function NewComposition() {
  function click() {
    openModal(
      <NewCompositionModal />,
      () => [] // window.location.reload()
    );
  }

  return (
    <div className="my-4 mx-2 p-4 transition-colors duration-200 ease-in-out bg-transparent rounded-lg hover:bg-[#ffffff0a] cursor-pointer" onClick={click}>
      <div className="bg-zinc-800 rounded-lg h-36 w-36 mb-4 text-gray-500 text-4xl grid place-items-center">
        <span className="material-symbols-outlined text-9xl">add</span>
      </div>
      <p className="text-white w-36">New Composition</p>
      <p className="text-gray-400 font-thin w-36">Create a new composition!</p>
    </div>
  );
}

export default function Compositions({ compositionCount = 4 }: { compositionCount?: number }) {
  // const [tags, setTags] = useState<TagWithTracks[]>(createTagPlaceholders(tagCount || 4))
  const [compositions, setCompositions] = useState<Composition[]>([]);

  function updateCompositions() {
    const _comps = getCompositionList();
    setCompositions(_comps);
    // Cookies.set("tagCount", _tags.length.toString())
  }

  useEffect(() => {
    updateCompositions();
  }, []);

  return (
    <>
      {compositions.map((composition) => (
        <div
          key={composition.id}
          className="my-4 mx-2 p-4 transition-colors duration-200 ease-in-out bg-transparent rounded-lg hover:bg-[#ffffff0a] cursor-pointer"
          onClick={() => (window.location.href = `/composition-test/${composition.id}`)}
        >
          <div className="bg-gradient-to-b from-slate-600 to-bg-zinc-800 rounded-lg h-36 w-36 mb-4 text-gray-500 text-4xl" />
          <p className="text-white w-36 ">{composition.name}</p>
          <p className="text-gray-400 font-thin w-36 ">{composition.description}</p>
        </div>
      ))}
    </>
  );
}
