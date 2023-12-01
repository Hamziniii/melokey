import type { Track } from "@spotify/web-api-ts-sdk";
import { getTagListWithData, type Tag } from "./tagManagement";

export type CompositionBase = {
  name: string;
  description: string;
  tags: Array<Tag["id"]>;
  type?: "union" | "intersection";
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

export function createComposition({
  name,
  description,
  tags,
  type = "intersection",
}: CompositionBase) {
  const compositionList = getCompositionList();

  // check that composition already exists
  const compositionExists = compositionList.some(
    (composition) => composition.name === name,
  );
  if (compositionExists) {
    throw new Error("Composition " + name + " already exists!");
  }
  const id = (Date.now() - Math.floor(Math.random() * 10000)).toString();

  const newComposition: Composition = {
    id,
    name,
    description,
    tags,
    type,
  };

  compositionList.push(newComposition);

  localStorage.setItem("compositionList", JSON.stringify(compositionList));
  return id;
}

// O(n * m) where n is the number of tags and m is the number of tracks (worst case
export function getTracksThatShareTags(
  tags: Array<Tag["id"]>,
): Array<Track["id"]> {
  const tagListWithData = getTagListWithData(); // O(n) where n is the number of tags
  const trackOccurences = new Map<Track["id"], number>();
  tagListWithData.forEach((tag) => {
    // For each tag (O(n) where n is the number of tags)
    if (tags.some((tagId) => tag.id === tagId)) {
      // If the tag is in the list of tags we're looking for
      tag.tracks.forEach((track) => {
        // For each track in the tag (O(m) where m is the number of tracks
        // Increment the number of occurences of the track O(1)
        trackOccurences.set(track, (trackOccurences.get(track) ?? 0) + 1);
      });
    }
  });

  // O(m) where m is the number of tracks
  let tracks = Array.from(trackOccurences.entries()) //
    // Remove filter if we want to do OR set operation instead of AND set operation
    .filter(([, occurences]) => occurences === tags.length)
    .map(([track]) => track);

  return tracks;
}

export function resolveComposition(id: string): Array<Track["id"]> {
  const composition = getCompositionById(id);
  if(!composition) {
    throw new Error("Composition " + id + " doesn't exist!");
  }

  const tagListWithData = getTagListWithData();
  const dataByTag = tagListWithData.reduce((acc, tag) => {
    acc[tag.id] = tag.tracks;
    return acc;
  }, {} as Record<Tag["id"], Track["id"][]>);

  const tags = composition.tags;
  const type = composition.type;

  const trackOccurences = new Map<Track["id"], number>();
  
  tags.forEach((tagId) => {
    if(tagId in dataByTag)
      dataByTag[tagId].forEach((track) => {
        trackOccurences.set(track, (trackOccurences.get(track) ?? 0) + 1);
      });
  });
  
  console.log("here!", type)

  if(!type || type == "intersection") {
    return Array.from(trackOccurences.entries()) //
    .filter(([, occurences]) => occurences === tags.length)
    .map(([track]) => track);
  } else {
    return Array.from(trackOccurences.keys());
  }
}

export function updateComposition(id: string, composition: CompositionBase) {
  const compositionList = getCompositionList();

  const compositionIndex = compositionList.findIndex(
    (composition) => composition.id === id,
  );

  if (compositionIndex === -1) {
    throw new Error("Composition " + id + " doesn't exist!");
  }

  compositionList[compositionIndex] = {
    ...compositionList[compositionIndex],
    ...composition,
  };

  localStorage.setItem("compositionList", JSON.stringify(compositionList));
}

export function deleteComposition(id: string) {
  const compositionList = getCompositionList();
  const compositionIndex = compositionList.findIndex(
    (composition) => composition.id === id,
  );

  if (compositionIndex == -1) {
    throw new Error("Composition " + id + " doesn't exist!");
  }

  compositionList.splice(compositionIndex, 1);

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
