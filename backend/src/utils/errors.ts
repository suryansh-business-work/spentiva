import { GraphQLError } from 'graphql';
import { z } from 'zod';

export const badInput = (message: string) => new GraphQLError(message, { extensions: { code: 'BAD_USER_INPUT' } });

export const notFound = (what: string) => new GraphQLError(`${what} not found`, { extensions: { code: 'NOT_FOUND' } });

export const unauthenticated = (message = 'Please log in to continue') => new GraphQLError(message, { extensions: { code: 'UNAUTHENTICATED' } });

export const forbidden = (message: string) => new GraphQLError(message, { extensions: { code: 'FORBIDDEN' } });

/** Parse input with a zod schema and surface the first issue as a user-friendly GraphQL error */
export function validate<T extends z.ZodType>(schema: T, input: unknown): z.infer<T> {
  const result = schema.safeParse(input);
  if (!result.success) {
    const issue = result.error.issues[0];
    const field = issue?.path.join('.');
    throw badInput(field ? `${field}: ${issue?.message}` : (issue?.message ?? 'Invalid input'));
  }
  return result.data;
}

/** Mongo duplicate key → friendly message */
export function isDuplicateKey(err: unknown): boolean {
  return typeof err === 'object' && err !== null && (err as { code?: number }).code === 11000;
}
