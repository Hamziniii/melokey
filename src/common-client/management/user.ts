import { UserModel } from "../schema/user";
import { getDB } from "./mongo";

export const getUser = async (email: string) => {
  await getDB()
  return UserModel.findOne({ email: email }).exec()
};

export const createUser = async (email: string, displayName: string) => {
  await getDB()
  return UserModel.create({
    email: email,
    displayName: displayName,
    compositions: [],
    tags: [],
  })
};

// If user doesn't exist in database, create a new user
export const findOrCreateUser = async (email: string, displayName: string) => {
  const user = await getUser(email)
  if (user) {
    return user
  } else {
    return createUser(email, displayName)
  }
};