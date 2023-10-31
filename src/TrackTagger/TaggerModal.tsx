import type { Track } from "@spotify/web-api-ts-sdk";
import { useRef } from "react";

interface TaggerModalProps {
  track: Track;
  isOpen: boolean;
}

const TaggerModal: React.FC<TaggerModalProps> = ({ track, isOpen }) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  function showTaggerModal() {
    console.log("showTaggerModal");
    modalRef.current?.showModal();
  }

  return <dialog ref={modalRef}>...</dialog>;
};

export default TaggerModal;
