import { useEffect, useRef, useState } from "react"
import { createNewTag, randomHex } from "../../common-client/tagManagement"
import { addToast } from "../toast/store"
import React from "react"

export default function NewTag() {
    const [color, setColor] = useState<string>(randomHex())
    const colorRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      if(colorRef.current) {
        colorRef.current.value = color
      }
    }, [])

    function updateColor() {
      if(colorRef.current) {
          setColor(colorRef.current.value)
      }
    }

    function submit(e: React.FormEvent<HTMLButtonElement>) {
      e.preventDefault()

      const name = (document.getElementById("name") as HTMLInputElement).value
      const color = (document.getElementById("hex_code") as HTMLInputElement).value
    
      try {
        createNewTag({name, color})
      } catch(e) {
        addToast({type: "error", title: "Failed to create tag!", message: "" + e})
        return
      }
      
      // TODO - make the home page tags update normally instead of reloading
      document.location.reload() // nanostore resets anyways
      // closeModal() 
    }

    return <div className="w-96 h-72 bg-zinc-900 rounded-lg p-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl text-white">New Tag</h1>
          <p className="text-sm text-gray-400 font-thin">Create a new tag!</p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-gradient-to-b from-slate-600" style={{"--tw-gradient-from": color} as React.CSSProperties}/>
      </div>
      <form action="" className="flex flex-col mt-4" autoComplete="off">
        <label className="text-sm text-gray-400 font-thin">Tag Name</label>
        <input id="name" className="bg-zinc-800 rounded-lg p-2 text-white" required autoComplete="off"/>
        
        <label className="text-sm text-gray-400 font-thin mt-4">Tag Color (in hex)</label>
        <input className="bg-zinc-800 rounded-lg p-2 text-white" type="text" id="hex_code" name="hex_code" onKeyUp={updateColor} ref={colorRef} pattern="#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?" required  autoComplete="off"/>

        <button type="button" className="bg-zinc-800 hover:bg-green-500 rounded-lg p-2 text-white mt-4 transition-colors ease-in-out duration-200" onClick={submit}>Create Tag</button>
      </form>
    </div>
}