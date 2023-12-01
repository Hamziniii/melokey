import { useStore } from "@nanostores/react"
import { addToast, removeToast, toastRequestsAtom } from "./store"
import { createPortal } from "react-dom"

const colors = {
  success: "text-green-500",
  error: "text-red-500",
  warning: "text-yellow-500",
  info: "text-blue-500"
}

export default function ToastHandler() {
  const toasts = useStore(toastRequestsAtom)

  function remove(id: string) {
    removeToast(id)
  }

  return createPortal(<div className="fixed bottom-4 right-4 z-30">
      {toasts.map(toast => {
        const color = toast.type in colors ? colors[toast.type] : "text-white"
        return <div key={toast.id} className={`bg-zinc-800 flex flex-row justify-between items-center gap-4 rounded-lg p-4 ${color} mb-4 transition-opacity duration-200 ${toast.faded ? "opacity-0" : "opacity-100"}`}>
            <div className="flex flex-col">
              {toast.title && <h1 className="text-lg">{toast.title}</h1>}
              <p className="text-sm font-thin">{toast.message}</p>
            </div>
            <span onClick={() => remove(toast.id)} className="material-symbols-outlined cursor-pointer">close</span>
        </div>
      })}
    </div>, document.body)
}