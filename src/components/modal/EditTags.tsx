import { useEffect, useState } from "react";
import type { Track } from "@spotify/web-api-ts-sdk";
import { getTagListWithData, type Tag, type TagWithTracks } from "../../common-client/tagManagement";
import { addTrackToTagList, getTagsByTrackId, removeTrackFromTagList } from "../../common-client/trackManagement";

export default function EditTags({track}: {track: Track}) {
  const [image, setImage] = useState<string | undefined>()
  const [trackTags, setTrackTags] = useState<TagWithTracks[]>([])
  const [otherTags, setOtherTags] = useState<TagWithTracks[]>([])
  const [triggerUpdate, setTriggerUpdate] = useState(false)

  function updateTags() {
    let ts = getTagListWithData()
    const _tags = getTagsByTrackId(track.id)
    const _tagIds = _tags.map(tag => tag.id)
    
    const have = []
    const notHave = []

    for(const t of ts) {
      if(_tagIds.includes(t.id)) {
        have.push(t)
      } else {
        notHave.push(t)
      }
    }

    setTrackTags(have)
    setOtherTags(notHave)
  }

  function addTag(tag: Tag) {
    if(track) {
      addTrackToTagList(track, tag.id)
      setTriggerUpdate(!triggerUpdate)
    }
  }

  function removeTag(tag: Tag) {
    if(track) {
      removeTrackFromTagList(track, tag.id)
      setTriggerUpdate(!triggerUpdate)
    }
  }
  
  useEffect(() => {
    setImage(track?.album?.images[0]?.url)
    updateTags()
  }, [])

  useEffect(() => {
    updateTags()
  }, [triggerUpdate])

  return <div className="w-96 h-96 bg-zinc-900 rounded-lg">
    <div className="flex flex-col w-full h-full p-4 overflow-hidden">
      <div className="flex flex-row w-full">
        {image ? <img src={image} className="w-32 h-32 rounded-md" /> : <div className="w-32 h-32 rounded-md bg-zinc-800"></div>}
        <div className="flex flex-col-reverse ml-4">
          <p className="text-sm font-thin text-gray-400">{trackTags.length} Tags</p>
          <p className="text-sm text-gray-400">{track?.artists?.map(artist => artist.name).join(", ")}</p>
          <h2 className="text-xl text-white">{track.name}</h2>
        </div>
      </div>
      <div className="flex flex-row gap-2 mt-4 overflow-hidden">
        <div className="flex flex-col flex-grow shrink-0">
          <p>Track Tags</p> 
          <div className="flex flex-col flex-grow-0 overflow-y-auto gap-1 rounded-lg">
        { trackTags.length > 0 ?
          trackTags.map(tag => (
            <div className="flex flex-row gap-2" key={tag.id}>
              <div className="bg-gradient-to-b flex-shrink-0 from-slate-600 to-bg-zinc-800 rounded-lg h-12 w-12 cursor-pointer" style={{"--tw-gradient-from": tag.color} as React.CSSProperties} onClick={() => removeTag(tag)}>
                <span className="w-full h-full material-symbols-outlined text-white text-4xl grid place-content-center">
                  remove
                </span>
              </div>
              <div className="flex flex-col flex-shrink-1 justify-around gap-1 w-full overflow-x-hidden max-w-full">
               <p className="text-zinc-100 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap">{tag.name.substring(0, 35)}</p>
               <p className="text-zinc-300 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap font-thin">{tag.tracks.length} Songs</p>
              </div>
            </div>
          )) : <>
            <p className="text-zinc-100 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap">No tags</p>
            <p className="text-zinc-300 text-xs overflow-ellipsis overflow-hidden whitespace-nowrap font-thin">Maybe you should add some tags 👀</p>
          </>
        }
        </div>
        </div>
        <div className="flex flex-col flex-grow shrink-0 overflow-y-hidden">
          <p>All Tags</p>
          <div className="flex flex-col h-full flex-grow-0 overflow-y-auto overflow-x-hidden gap-1 rounded-lg">
          { otherTags.length > 0 ?
            otherTags.map(tag => (
              <div className="flex flex-row gap-2" key={tag.id}>
                <div className="bg-gradient-to-b flex-shrink-0 from-slate-600 to-bg-zinc-800 rounded-lg h-12 w-12 cursor-pointer" style={{"--tw-gradient-from": tag.color} as React.CSSProperties} onClick={() => addTag(tag)}>
                  <span className="w-full h-full material-symbols-outlined text-white text-4xl grid place-content-center">
                    add
                  </span>
                </div>
                <div className="flex flex-col flex-shrink-1 justify-around gap-1 w-full overflow-x-hidden">
                <p className="text-zinc-100 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap">{tag.name.substring(0, 35)}</p>
                <p className="text-zinc-300 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap font-thin">{tag.tracks.length} Songs</p>
                </div>
              </div>
            )) :
            <>
              <p className="text-zinc-100 text-sm overflow-ellipsis overflow-hidden whitespace-nowrap">No tags</p>
              <p className="text-zinc-300 text-xs overflow-ellipsis overflow-hidden whitespace-nowrap font-thin">Maybe you should create some tags 👀</p>
            </>
          }
          </div>
        </div>
      </div>
    </div>
  </div>
}