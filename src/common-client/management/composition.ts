import type { ObjectId, PipelineStage } from "mongoose";
import { CompositionModel, ExpressionIsOperation, ExpressionIsTag, Operation, type IExpression } from "../schema/composition";
import { getDB } from "./mongo";
import { getUser } from "./user";

// Create composition
export async function addComposition(email: string, name: string, expressions: IExpression[]) {
  await getDB()

  getUser(email).then(async (user) => {
    if(user) {
      const composition = await CompositionModel.create({
        name: name,
        expressions: expressions,
        userId: user._id,
      })
      // populate into user 
      user.compositions.push(composition._id)
      await user.save()
    } else {
      throw new Error("User does not exist")
    }
  })
}

// Delete composition and delete it from user's list of compositions as well
export async function deleteComposition(email: string, compositionId: string) {
  await getDB()
  const composition = await CompositionModel.findOne({ _id: compositionId }).exec()
  if(composition) {
    // Remove composition from user's list of compositions
    const user = await getUser(email)
    if(user) {
      user.compositions = user.compositions.filter((c) => c !== composition._id)
      user.save()
    }
    composition.deleteOne()
  } else {
    throw new Error("Composition does not exist")
  }
}

// Get all compositions for a user
export async function getCompositions(email: string) {
  await getDB()
  return getUser(email).then(async (user) => {
    if(user) {
      return CompositionModel.find({ _id: { $in: user.compositions } }).exec()
    } else {
      throw new Error("User does not exist")
    }
  })
}

// Get a composition
export async function getComposition(compositionId: string) {
  await getDB()
  return CompositionModel.findOne({ _id: compositionId }).exec()
}

// Get compositions with tracks
// Essentially the idea is to leverage mongodb's aggregation pipeline to do this
export async function evaluateComposition(compositionId: string) {
  await getDB()
  const composition = await CompositionModel.findOne({ _id: compositionId }).exec()

  if(!composition)
    throw new Error("Composition does not exist")

  // eslint-disable-next-line no-unused-vars
  const [tags, operations] = composition.expressions.reduce((acc, expression) => {
    if(ExpressionIsTag(expression)) {
      acc[0].push(expression.value)
    } else if(ExpressionIsOperation(expression)) {
      acc[1].push(expression.value)
    }
    return acc
  }, [[] as ObjectId[], [] as Operation[]])
  
  // its kinda hard do this without having data, but this is what im thinking
  // 1. Have empty pipeline
  // 2. For each tag, lookup the tracks for that tag and give it a name
  //   - Populate the tracks, remove unnecessary fields
  // 3. For each operation, union or intersect the tracks
  // 4. Return the tracks
  
  // Create empty pipeline with no documents
  // eslint-disable-next-line no-unused-vars
  const aggregation: PipelineStage[] = [
    { $project: { _id: 1 } },
    { $project: { _id: 0 } }
  ]

  // Get the tracks for each tag and give each collection a name
  // tags.forEach((tag, i) => {
  //   aggregation.push({
  //     $lookup: {
  //       from: "tracks",
  //       localField: "null",
  //       foreignField: "_id",
  //       as: `tag${i}`
  //     }
  //   })
  // })

  // for(let i = 0; i < operations.length; i++) {
  //   const operation = operations[i]
  //   const tag = tags[i + 1]
  //   if(operation === Operation.Union) {
  //     aggregation.push({$unionWith: {coll: "tags", pipeline: [{$match: {tags: {$eq: {_id: tag}}}}]}})
  //   } else if(operation === Operation.Intersection) {
  //     aggregation.push({$match: {tags: {$eq: {_id: tag}}}})
  //   }
  // }
}