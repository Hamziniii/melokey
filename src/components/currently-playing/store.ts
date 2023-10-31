import type { Track } from '@spotify/web-api-ts-sdk'
import { atom } from 'nanostores'

export const queueAtom = atom<Track[]>([])
export const trackAtom = atom<Track | null>(null)