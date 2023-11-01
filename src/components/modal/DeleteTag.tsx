import { type Tag, deleteTag }  from "../../common-client/tagManagement";
import { closeModal } from "./store";

export default function DeleteTag({tag}: {tag: Tag}) {
  function del() {
    deleteTag(tag.id)
    window.location.replace("/")
  }

  function cancel() {
    closeModal()
  }
  
  return <div className="w-72 h-36 bg-zinc-900 rounded-lg p-4">
    <div className="flex flex-col">
      <h1 className="text-2xl text-white">Delete Tag: {tag.name}</h1>
      <p className="text-sm text-gray-400 font-thin">Are you sure you want to delete {tag.name}?</p>
      <div className="flex flex-row gap-4 justify-around">
        <button className="bg-zinc-800 grow shrink-0 hover:bg-red-500 rounded-lg p-2 text-white mt-4 transition-colors ease-in-out duration-200" onClick={del}>Delete Tag</button>
        <button className="bg-zinc-800 grow shrink-0 hover:bg-gray-400 rounded-lg p-2 text-white mt-4 transition-colors ease-in-out duration-200" onClick={cancel}>Cancel</button>
      </div>
    </div>
  </div>
}