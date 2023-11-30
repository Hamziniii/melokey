import { TagModel } from "../schema/tag";
// import { TrackModel } from "../schema/track";
import { getDB } from "./mongo";
import { getOrAddTrack, getTrack } from "./track";
import { getUser } from "./user";

export async function addTag(email: string, name: string, color: string, description?: string) {
  await getDB()
  await getUser(email).then(async (user) => {
    if (user) {
      const tag = await TagModel.create({
        name: name,
        color: color,
        description: description,
        trackIds: [],
        userId: user._id,
      })
      // populate into user 
      user.tags.push(tag._id)
      await user.save()
    }
    else {
      throw new Error("User does not exist")
    }
  })
}

export async function deleteTag(email: string, tagId: string) {
  await getDB()
  const tag = await TagModel.findOne({ _id: tagId }).exec()
  if (tag) {
    // Remove tag from user's list of tags
    const user = await getUser(email)
    if (user) {
      user.tags = user.tags.filter((t) => t !== tag._id)
      user.save()
    }
    tag.deleteOne()
  }
  else {
    throw new Error("Tag does not exist")
  }
}

export async function getTags(email: string) {
  await getDB()
  return getUser(email).then(async (user) => {
    if (user) {
      return TagModel.find({ _id: { $in: user.tags } }).exec()
    }
    else {
      throw new Error("User does not exist")
    }
  })
}

export async function getTag(tagId: string) {
  await getDB()
  return TagModel.findOne({ _id: tagId }).exec()
}

// Get tags with tracks 
export async function getTagsWithTracks(email: string) {
  await getDB()
  return getUser(email).then(async (user) => {
    if (user) {
      return TagModel.find({ _id: { $in: user.tags } }).populate('tracks').exec()
    }
    else {
      throw new Error("User does not exist")
    }
  })
}

export async function getTagWithTracks(tagId: string) {
  await getDB()
  try {
    return TagModel.findOne({ _id: tagId }).populate('tracks').exec()
  } catch (err) {
    throw new Error("Tag does not exist")
  }
}

// Add track to tracks collection
// Add track to tag's trackIds
export async function addTrackToTag(tagId: string, trackId: string) {
  await getDB()
  const tag = await getTag(tagId)
  if (tag) {
    const track = await getOrAddTrack(trackId)
    tag.tracks.push(track._id)
  }
  else {
    throw new Error("Tag does not exist")
  }
}

// Remove track from tag's trackIds
export async function removeTrackFromTag(tagId: string, trackId: string) {
  await getDB()
  const tag = await getTag(tagId)
  const track = await getTrack(trackId)
  if (tag && track) {
    tag.tracks = tag.tracks.filter((t) => t !== track._id)
    tag.save()
    // Would need some sort of reference counter for this to guarantee that the track is not used anywhere else
    // TrackModel.deleteOne({ _id: track._id })
  }
  else {
    throw new Error("Tag does not exist")
  }
}