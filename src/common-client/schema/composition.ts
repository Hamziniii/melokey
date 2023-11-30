/* eslint-disable no-unused-vars */
// Schema for Composition

import mongoose, { Schema, Document, type ObjectId } from "mongoose";

export enum Operation {
  Union = "+", 
  Intersection = "^", 
  // Difference = "-"
}

// We assume that its left associated 
// ((Sad + Happy) ^ Angry)
type TagExpression = {
  type: "TagId",
  value: ObjectId,
}

type OperationExpression = {
  type: "Operation",
  value: Operation,
}

export type IExpression = TagExpression | OperationExpression

export function ExpressionIsTag(expression: IExpression): expression is TagExpression {
  return expression.type === "TagId"
}

export function ExpressionIsOperation(expression: IExpression): expression is OperationExpression {
  return expression.type === "Operation"
}

export interface IComposition extends Document {
  name: string,
  expressions: IExpression[],
}

const CompositionSchema = new Schema<IComposition>({
  name: {
    type: String,
    required: true,
  },
  expressions: {
    type: [{
      type: {
        type: String,
        enum: ["TagId", "Operation"],
        required: true,
      },
      value: {
        type: String,
        required: true,
      }
    }],
    required: true,
  }
})

export const CompositionModel = mongoose.model<IComposition>('Composition', CompositionSchema)