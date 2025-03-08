import { gql } from "graphql-tag";

export const typeDefs = gql`
  type ValidationResult {
    isValid: Boolean!
    message: String
  }

  type Query {
    validateAddress(
      postcode: String!
      suburb: String!
      state: String!
    ): ValidationResult!
  }
`;
