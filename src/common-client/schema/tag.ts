// Schema for Tag

import mongoose, { Schema, Document, type ObjectId } from "mongoose";

export interface ITag extends Document {
  name: string, 
  color: string,
  description?: string,
  tracks: ObjectId[], // Song Ids 
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
  tracks: {
    type: [Schema.Types.ObjectId],
    ref: 'Track',
    required: true,
  }
})

export const TagModel = mongoose.model<ITag>('Tag', TagSchema)