import type { CodegenConfig } from '@graphql-codegen/cli';

/** Typed GraphQL operations generated from the backend schema → src/gql (run `npm run codegen`) */
const config: CodegenConfig = {
  schema: '../backend/src/graphql/typeDefs.ts',
  documents: ['src/graphql/**/*.ts'],
  ignoreNoDocuments: false,
  generates: {
    './src/gql/': {
      preset: 'client',
      presetConfig: { fragmentMasking: false },
      config: {
        documentMode: 'string',
        useTypeImports: true,
        skipTypeNameForRoot: true,
        scalars: { DateTime: 'string' },
        avoidOptionals: { field: true, inputValue: false, object: false, defaultValue: false },
      },
    },
  },
  hooks: { afterAllFileWrite: ['prettier --write'] },
};

export default config;
