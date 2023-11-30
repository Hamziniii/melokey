import mongoose, { Schema, Document, type ObjectId } from "mongoose";

export interface IUser extends Document {
  email: string,
  displayName: string,
  compositions: ObjectId[],
  tags: ObjectId[],
}
const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  compositions: {
    type: [Schema.Types.ObjectId],
    ref: 'Composition',
    required: true,
  },
  tags: {
    type: [Schema.Types.ObjectId],
    ref: 'Tag',
    required: true,
  }
})

export const UserModel = mongoose.model<IUser>('User', UserSchema)