import { atom } from "nanostores";

export interface ToastReqeustPartial {
  title?: string;
  message: string;
  duration?: number;
  type: "success" | "error" | "warning" | "info";
}

type ToastReqeust = ToastReqeustPartial & { id: string, faded: boolean, fadeDuration: number, duration: number;};

export const toastRequestsAtom = atom<ToastReqeust[]>([]);

const fadeDuration = 200;
const duration = 5000;

export function addToast(request: ToastReqeustPartial) {
  const req: ToastReqeust = { ...request, fadeDuration, duration, faded: true, id: Math.random().toString()};
  toastRequestsAtom.set([...toastRequestsAtom.get(), req]);

  setTimeout(() => {
    req.faded = false;
    toastRequestsAtom.set(toastRequestsAtom.get().map((r) => r.id === req.id ? req : r));
  }, req.fadeDuration);

  setTimeout(() => {
    req.faded = true;
    toastRequestsAtom.set(toastRequestsAtom.get().map((r) => r.id === req.id ? req : r));
  }, req.duration + req.fadeDuration);

  setTimeout(() => {
    toastRequestsAtom.set(toastRequestsAtom.get().filter((r) => r !== req));
  }, req.duration + 2 * req.fadeDuration);
}

export function removeToast(id: string) {
  toastRequestsAtom.set(toastRequestsAtom.get().map((r) => r.id === id ? { ...r, faded: true } : r));
  setTimeout(() => {
    toastRequestsAtom.set(toastRequestsAtom.get().filter((r) => r.id !== id));
  }, fadeDuration);
}