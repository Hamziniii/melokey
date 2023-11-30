// Schema for Track

import mongoose, { Schema, Document } from "mongoose";

export interface ITrack extends Document {
  trackId: string,
  name: string,
  audio_features?: {
    acousticness: number,
    danceability: number,
    energy: number,
    instrumentalness: number,
    liveness: number,
    loudness: number,
    speechiness: number,
    valence: number,
  },
}

const TrackSchema = new Schema<ITrack>({
  trackId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  audio_features: {
    type: {
      acousticness: Number,
      danceability: Number,
      energy: Number,
      instrumentalness: Number,
      liveness: Number,
      loudness: Number,
      speechiness: Number,
      valence: Number,
    },
    required: false,
  }
})

export default mongoose.model<ITrack>('Track', TrackSchema)