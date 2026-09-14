import { graphql } from '@/gql';

export const EnvVarsQuery = graphql(`
  query PortalEnvVars {
    envVars {
      ...EnvFields
    }
  }
`);

export const SlackChannelsQuery = graphql(`
  query PortalSlackChannels {
    slackChannels {
      id
      name
      isPrivate
      isMember
    }
  }
`);

export const OpenAiModelsQuery = graphql(`
  query PortalOpenAiModels {
    openAiModels
  }
`);

export const SetEnvVarsMutation = graphql(`
  mutation PortalSetEnvVars($input: [EnvVarInput!]!) {
    setEnvVars(input: $input) {
      ...EnvFields
    }
  }
`);

export const TestSlackMutation = graphql(`
  mutation PortalTestSlack {
    testSlack
  }
`);

export const TestOpenAiMutation = graphql(`
  mutation PortalTestOpenAi {
    testOpenAi
  }
`);

export const TestEmailMutation = graphql(`
  mutation PortalTestEmail {
    testEmail
  }
`);
