import type { Track } from "@spotify/web-api-ts-sdk";
import { getTagListWithData, type Tag } from "./tagManagement";

export type CompositionBase = {
  name: string;
  description: string;
  tags: Array<Tag["id"]>;
};

export type Composition = CompositionBase & {
  id: string;
};

export function getCompositionList(): Composition[] {
  const compositionList = localStorage.getItem("compositionList");

  if (compositionList) {
    return JSON.parse(compositionList);
  }

  return [];
}

export function createComposition({ name, description, tags }: CompositionBase) {
  const compositionList = getCompositionList();

  // check that composition already exists
  const compositionExists = compositionList.some((composition) => composition.name === name);
  if (compositionExists) {
    throw new Error("Composition " + name + " already exists!");
  }

  const newComposition: Composition = {
    id: (Date.now() - Math.floor(Math.random() * 10000)).toString(),
    name,
    description,
    tags,
  };

  compositionList.push(newComposition);

  localStorage.setItem("compositionList", JSON.stringify(compositionList));
}

// very inefficient but will work for a demo
export function getTracksThatShareTags(tags: Array<Tag["id"]>): Array<Track["id"]> {
  const tagListWithData = getTagListWithData();
  console.log("!!! TAG LIST WITH DATA", tagListWithData);

  const allTracksDump: string[] = tagListWithData.reduce((acc: string[], tag) => {
    return [...acc, ...tag.tracks];
  }, []);

  // remove duplicates
  const allTracks = [...new Set(allTracksDump)];
  console.log("!!! ALL TRACKS", allTracks);

  // filter tracks that have all tags
  const tracksThatShareTags = allTracks.filter((trackId: Track["id"]) => {
    const trackTags = tagListWithData.filter((tag) => tag.tracks.includes(trackId));

    const trackHasAllTags = tags.every((tagId) => trackTags.some((tag) => tag.id === tagId));

    return trackHasAllTags;
  });

  return tracksThatShareTags;
}

export function updateComposition(id: string, composition: CompositionBase) {
  const compositionList = getCompositionList();

  const compositionIndex = compositionList.findIndex((composition) => composition.id === id);

  if (compositionIndex === -1) {
    throw new Error("Composition " + id + " doesn't exist!");
  }

  compositionList[compositionIndex] = {
    ...compositionList[compositionIndex],
    ...composition,
  };

  localStorage.setItem("compositionList", JSON.stringify(compositionList));
}

export function getCompositionById(id: string): Composition | undefined {
  const compositionList = getCompositionList();

  return compositionList.find((composition) => composition.id === id);
}

export function getCompositionByName(name: string): Composition | undefined {
  const compositionList = getCompositionList();

  return compositionList.find((composition) => composition.name === name);
}
