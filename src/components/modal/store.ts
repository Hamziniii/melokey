import { atom } from "nanostores";

export const childAtom = atom<React.ReactNode>(null);
export const childStackAtom = atom<[React.ReactNode, Function][]>([]);
export const isOpenAtom = atom<boolean>(false);

export const openModal = (child: React.ReactNode, onClose = () => {}) => {
  childAtom.set(child);
  childStackAtom.set([...childStackAtom.get(), [child, onClose]]);
  isOpenAtom.set(true);
}

export const closeModal = () => {
  const res = childStackAtom.get().pop();
  const child = res?.[0];
  const onClose = res?.[1];
  if(!child) return;
  if(childStackAtom.get().length === 0) {
    isOpenAtom.set(false);
  } else {
    childAtom.set(childStackAtom.get()[childStackAtom.get().length - 1][0]);
  }
  onClose?.();
}