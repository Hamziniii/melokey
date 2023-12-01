import { CombinedModel } from "../schema/combined";
import { getDB } from "./mongo";

export async function upload(email: string, blob: string) {
  await getDB()
  // Upsert the combined object for the user
  return CombinedModel.findOneAndUpdate(
    { email: email },
    { blob: blob, timestamp: new Date().toISOString() },
    { upsert: true, new: true }
  ).exec()
}

export async function download(email: string) {
  await getDB()
  return CombinedModel.findOne({ email: email }).exec()
}

export async function getUploadTime(email: string) {
  await getDB()
  return CombinedModel.findOne({ email: email }).exec()
}