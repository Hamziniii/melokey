import { useStore } from "@nanostores/react";
import { createPortal } from "react-dom";
import { childAtom, closeModal, isOpenAtom } from "./store";

export default function Modal() {
  const isOpen = useStore(isOpenAtom);
  const child = useStore(childAtom);

  function close() {
    closeModal();
  }

  return createPortal(
    isOpen && (
      <>
        <div
          className="absolute left-0 top-0 w-screen h-screen inline bg-black bg-opacity-50"
          onClick={close}
        />
        <div className="absolute left-1/2 top-1/2 mr-[-50%] transform -translate-x-1/2 -translate-y-1/2">
          {child}
        </div>
      </>
    ),
    document?.body,
  );
}
