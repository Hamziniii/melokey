import { useEffect, useState } from "react";
import { createTagPlaceholders, getTagList, getTagListWithData, type Tag, type TagWithTracks } from "../../common-client/tagManagement";
import Cookies from "js-cookie"

export function NewTag() {
  function click() {
    alert("New Tag")
  }

  return <div className="my-4 mx-2 p-4 transition-colors duration-200 ease-in-out bg-transparent rounded-lg hover:bg-[#ffffff0a] cursor-pointer" onClick={click}>
    <div className="bg-zinc-800 rounded-lg h-36 w-36 mb-4 text-gray-500 text-4xl grid place-items-center">
      <span className="material-symbols-outlined text-9xl">
      add
      </span>
    </div>
    <p className="text-white">New Tag</p>
    <p className="text-gray-400 font-thin">Create a new tag!</p>
  </div>
}

export default function TagsView({tagCount = 4} : {tagCount?: number}) {
  const [tags, setTags] = useState<TagWithTracks[]>(createTagPlaceholders(tagCount || 4))

  useEffect(() => {
    const _tags = getTagListWithData()
    setTags(_tags)
    Cookies.set("tagCount", _tags.length.toString())
  }, [])

  return <>
  {tags.map(tag => (
      <div key={tag.id} className="my-4 mx-2 p-4 transition-colors duration-200 ease-in-out bg-transparent rounded-lg hover:bg-[#ffffff0a] cursor-pointer" onClick={() => window.location.href = `/tag-viewer/${tag.id}`}>
        <div className="bg-gradient-to-b from-slate-600 to-bg-zinc-800 rounded-lg h-36 w-36 mb-4 text-gray-500 text-4xl" style={{"--tw-gradient-from": tag.color} as React.CSSProperties}/>
        <p className="text-white">{tag.name}</p>
        <p className="text-gray-400 font-thin">{tag.tracks.length} Songs</p>
      </div>
    ))}
  </>
}