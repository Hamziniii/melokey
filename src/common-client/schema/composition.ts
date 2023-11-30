/* eslint-disable no-unused-vars */
// Schema for Composition

import mongoose, { Schema, Document } from "mongoose";

export enum Operation {
  Union = "+", 
  Intersection = "^", 
  // Difference = "-"
}

// We assume that its left associated 
// ((Sad + Happy) ^ Angry)
type TagExpression = {
  type: "TagId",
  value: string,
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

const ExpressionSchema = new Schema<IExpression>({
  type: {
    type: String,
    enum: ["TagId", "Operation"],
    required: true,
  },
  value: {
    type: String,
    required: true,
  }
})

export const ExpressionModel = mongoose.model<IExpression>('Expression', ExpressionSchema)

export interface IComposition extends Document {
  name: string,
  expression: IExpression[],
}

const CompositionSchema = new Schema<IComposition>({
  name: {
    type: String,
    required: true,
  },
  expression: {
    type: [ExpressionSchema],
    required: true,
  }
})

export const CompositionModel = mongoose.model<IComposition>('Composition', CompositionSchema)