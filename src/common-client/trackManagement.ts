import type { Track } from "@spotify/web-api-ts-sdk";
import { getTagById, getTagList, type Tag } from "./tagManagement";

// get list of tracks for a tag
export function getTracksForTag(id: string): Array<Track["id"]> {
  const tag = getTagById(id);

  if (!tag) {
    throw new Error("Tag " + id + " doesn't exist!");
  }

  const tagTracks = localStorage.getItem("tag-" + id);

  if (tagTracks) {
    return JSON.parse(tagTracks);
  }

  return [];
}

export function setTracksForTag(id: string, tracks: Array<Track["id"]>) {
  const tag = getTagById(id);

  if (!tag) {
    throw new Error("tag " + id + " doesn't exist!");
  }

  localStorage.setItem("tag-" + id, JSON.stringify(tracks));
}

export function addTrackToTagList(trackData: Track, tagId: string) {
  // check if tag even exists
  const tag = getTagById(tagId);

  if (!tag) {
    throw new Error("Tag " + tagId + " doesn't exist!");
  }

  // add song uri to tag's specific list
  const tagTracks = getTracksForTag(tagId);

  tagTracks.push(trackData.id);
  setTracksForTag(tagId, tagTracks);
}

export function removeTrackFromTagList(trackData: Track, tagId: string) {
  // check if tag even exists
  const tag = getTagById(tagId);

  if (!tag) {
    throw new Error("Tag " + tagId + " doesn't exist!");
  }

  // remove song uri from tag's specific list
  const tagTracks = getTracksForTag(tagId).filter((track) => track !== trackData.id);
  setTracksForTag(tagId, tagTracks);
}

export function getTagsByTrackId(trackId: string): Array<Tag> {
  const allTags = getTagList();
  const tags = allTags.filter(tag => JSON.parse(localStorage.getItem("tag-" + tag.id) ?? "[]").includes(trackId));

  return tags;
}