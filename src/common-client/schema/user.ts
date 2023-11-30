import mongoose, { Schema, Document } from "mongoose";
import { CompositionModel, type IComposition } from "./composition";
import { TagModel, type ITag } from "./tag";

export interface IUser extends Document {
  compositions: IComposition[],
  tags: ITag[],
}
const UserSchema = new Schema<IUser>({
  compositions: {
    type: [CompositionModel.schema],
    required: true,
  },
  tags: {
    type: [TagModel.schema],
    required: true,
  }
})

export default mongoose.model<IUser>('User', UserSchema)