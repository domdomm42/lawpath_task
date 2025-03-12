import { gql } from "graphql-tag";

/**
 * GraphQL schema definition for the address validation API
 * Defines types and queries for address validation functionality
 */
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
