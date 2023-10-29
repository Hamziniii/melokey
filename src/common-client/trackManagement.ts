import type { Track } from "@spotify/web-api-ts-sdk";
import { getTag } from "./tagManagement";

// get list of tracks for a tag
export function getTracksForTag(id: string): Array<Track> {
  const tag = getTag(id);

  if (!tag) {
    throw new Error("Tag " + id + " doesn't exist!");
  }

  const tagTracks = localStorage.getItem("tracks-" + id);

  if (tagTracks) {
    return JSON.parse(tagTracks);
  }

  return [];
}

export function addTrackToTagList(trackData: Track, tagId: string) {
  // check if tag even exists
  const tag = getTag(tagId);

  if (!tag) {
    throw new Error("Tag " + tagId + " doesn't exist!");
  }

  // add song uri to tag's specific list
  const tagTracks = getTracksForTag(tagId);

  tagTracks.push(trackData);
}
