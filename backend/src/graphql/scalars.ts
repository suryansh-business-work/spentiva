import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';

function toDate(value: unknown): Date {
  const d = value instanceof Date ? value : typeof value === 'string' || typeof value === 'number' ? new Date(value) : null;
  if (!d || Number.isNaN(d.getTime())) throw new GraphQLError('DateTime must be an ISO 8601 string');
  return d;
}

export const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  serialize: (value) => toDate(value).toISOString(),
  parseValue: (value) => toDate(value),
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.STRING) throw new GraphQLError('DateTime must be an ISO 8601 string');
    return toDate(ast.value);
  },
});
