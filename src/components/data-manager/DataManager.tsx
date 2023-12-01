// import {  } from "../../common-client/management/combinedClient"
import { useEffect, useState } from "react";
import { fromBlob } from "../../common-client/management/combinedClient";
import { getEmail } from "../../globals/util"
import { addToast } from "../toast/store";

export function DataManager() {
  const [lastDownload, setLastDownload] = useState<Date | null>(null)
  const [lastUpload, setLastUpload] = useState<Date | null>(null)

  function getLastDownload() {
    localStorage.getItem("lastDownload") && setLastDownload(new Date(localStorage.getItem("lastDownload")!))
  }

  function getLastUpload() {
    const email = getEmail()
    const requestOptions: RequestInit = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch("http://localhost:4321/api/mongo/timestamp?email=" + email, requestOptions)
      .then(response => response.text())
      .then(result => {
        if(result.length === 0) {
          setLastUpload(null)
          return
        }

        setLastUpload(new Date(result))
      })
      .catch(error => console.log('error', error));
  }

  useEffect(() => {
    getLastDownload()
    getLastUpload()
  }, [])

  function download() {
    // TODO - download data
    const email = getEmail()
    const requestOptions: RequestInit = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch("http://localhost:4321/api/mongo/combined?email=" + email, requestOptions)
      .then(response => response.text())
      .then(result => {
        if(result.length === 0) {
          addToast({type: "error", title: "No Data!", message: "There is no data associated with this account!"})
          return
        }

        addToast({type: "success", title: "Downloaded Data!", message: "Downloaded data from the cloud!"})
        fromBlob(result)
        getLastDownload()
      })
      .catch(error => console.log('error', error));
  }
  function upload() {
    const email = getEmail()

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const raw = JSON.stringify({
      "email": email,
      "blob": localStorage
    });
    
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("http://localhost:4321/api/mongo/combined", requestOptions)
      .then(response => response.text())
      .then(result => {
        if(result == "Uploaded")
          addToast({type: "success", title: "Uploaded Data!", message: "Uploaded data to the cloud!"})
        else
          addToast({type: "error", title: "Failed to Upload!", message: "Failed to upload data to the cloud!"})
      })
      .catch(error => console.log('error', error));

    console.log("Uploading data")
    // console.log(blob, email)
  }

  return (
    <div className="p-4 w-full h-full flex-grow transition-all ease-in-out bg-gradient-to-b from-slate-900 rounded-lg overflow-y-auto flex justify-center items-center gap-16">
      <div className="p-4 w-96 overflow-y-hidden bg-zinc-900 rounded-xl shadow-md">
        <div className="flex flex-col">
          <h1 className="text-2xl text-white">Download Data!</h1>
          <p className="text-sm text-gray-400 font-thin">Dowload data from the cloud! Warning, this replaces all local data!!</p>
          <p className="pt-4">This device last downloaded: {lastDownload?.toDateString() || "Never"}</p>
          <button onClick={download} id="download" className="transition-colors bg-gray-500 hover:bg-blue-600 text-2xl mt-4 p-4 rounded-2xl">
            Download
          </button>
        </div>
      </div>
      <div className="p-4 w-96 overflow-y-hidden bg-zinc-900 rounded-xl shadow-md">
        <div className="flex flex-col">
          <h1 className="text-2xl text-white">Upload Data!</h1>
          <p className="text-sm text-gray-400 font-thin">Upload your data to the cloud. This allows you to pick up where you left off on other devices!</p>
          <p className="pt-4">This device last uploaded: {lastUpload?.toDateString() || "Never"}</p>
          <button onClick={upload} id="upload" className="transition-colors bg-gray-500 hover:bg-purple-600 text-2xl mt-4 p-4 rounded-2xl">
            Upload
          </button>
        </div>
      </div>
    </div>
  )
}