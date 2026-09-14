import { graphql } from '@/gql';

export const LoginMutation = graphql(`
  mutation PortalLogin($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        ...MeFields
      }
    }
  }
`);

export const MeQuery = graphql(`
  query PortalMe {
    me {
      ...MeFields
    }
  }
`);

export const UpdateDisplayMutation = graphql(`
  mutation PortalUpdateDisplay($input: ProfileInput!) {
    updateProfile(input: $input) {
      ...MeFields
    }
  }
`);

export const TimeZonesQuery = graphql(`
  query PortalTimeZones {
    timeZones
  }
`);

export const ValidationRulesQuery = graphql(`
  query PortalValidationRules {
    validationRules {
      ...RulesFields
    }
  }
`);
