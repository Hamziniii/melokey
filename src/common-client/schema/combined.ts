import mongoose, { Schema, Document } from "mongoose";

export interface ICombined extends Document {
  email: string,
  blob: string,
  timestamp: string,
  // tags: {
  //   id: string, 
  //   songIds: string[]
  // }[],
  // tagList: {
  //   id: string,
  //   name: string,
  //   color: string,
  // }[],
  // compositionList: {
  //   description: string,
  //   id: string,
  //   name: string,
  //   tags: string[],
  // }[]
}

const CombinedSchema = new Schema<ICombined>({
  email: {
    type: String,
    required: true,
  },
  blob: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: false,
  },
})

export const CombinedModel = mongoose.model<ICombined>('Combined', CombinedSchema)