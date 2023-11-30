// Schema for Tag

import mongoose, { Schema, Document } from "mongoose";

export interface ITag extends Document {
  name: string, 
  color: string,
  description?: string,
  trackIds: string[], // Song Ids 
}

const TagSchema = new Schema<ITag>({
  name: {
    type: String,
    required: true,
  }, 
  color: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  trackIds: {
    type: [String],
    required: true,
  }
})

export const TagModel = mongoose.model<ITag>('Tag', TagSchema)