import { TrackModel } from "../schema/track";
import { getDB } from "./mongo";

export async function addTrack(trackId: string, name?: string) {
    await getDB();

    const track = await TrackModel.create({
        trackId: trackId,
        name: name,
    });

    return track;
}

// check to see if the track exists 
export async function getTrack(trackId: string) {
    await getDB();

    const res = await TrackModel.find({ trackId: trackId }).exec();
    if(res.length > 0) {
        return res[0];
    } else {
        return null;
    }
}

// get a track or upload it if it doesn't exist
export async function getOrAddTrack(trackId: string, name?: string) {
    await getDB();

    const track = await getTrack(trackId);
    if(track) {
        return track;
    } else {
        return addTrack(trackId, name);
    }
}

// Populate the track with its audio features
export async function populateAudioFeatures(trackId: string, audio_features: any) {
    await getDB();

    const track = await getTrack(trackId);
    if(track) {
        track.audio_features = audio_features;
        await track.save();
        return track;
    } else {
        throw new Error("Track does not exist");
    }
}