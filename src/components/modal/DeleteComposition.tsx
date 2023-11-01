import {
  deleteComposition,
  type Composition,
} from "../../common-client/compositionsManagement";
import { closeModal } from "./store";

export default function DeleteComposition({
  composition,
}: {
  composition: Composition;
}) {
  function del() {
    deleteComposition(composition.id);
    window.location.replace("/");
  }

  function cancel() {
    closeModal();
  }

  return (
    <div className="w-120 h-36 bg-zinc-900 rounded-lg p-4">
      <div className="flex flex-col">
        <h1 className="text-2xl text-white">
          Delete Composition: {composition.name}
        </h1>
        <p className="text-sm text-gray-400 font-thin">
          Are you sure you want to delete {composition.name}?
        </p>
        <div className="flex flex-row gap-4 justify-around">
          <button
            className="bg-zinc-800 grow shrink-0 hover:bg-red-500 rounded-lg p-2 text-white mt-4 transition-colors ease-in-out duration-200"
            onClick={del}
          >
            Delete Composition
          </button>
          <button
            className="bg-zinc-800 grow shrink-0 hover:bg-gray-400 rounded-lg p-2 text-white mt-4 transition-colors ease-in-out duration-200"
            onClick={cancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
