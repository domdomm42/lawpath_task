import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
import { gql } from "graphql-tag";

// Validate environment variables
const baseUrl = process.env.AUSTRALIA_POST_API_URL;
const authToken = process.env.AUSTRALIA_POST_API_TOKEN;

if (!baseUrl || !authToken) {
  console.error(
    "Missing required environment variables for Australia Post API"
  );
}

// Define types for API responses
interface Locality {
  location: string;
  postcode: number | string;
  state: string;
}

interface LocalitiesResponse {
  localities?: {
    locality: Locality[];
  };
}

// GraphQL Schema
const typeDefs = gql`
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

// Resolvers
const resolvers = {
  Query: {
    validateAddress: async (
      _: unknown,
      {
        postcode,
        suburb,
        state,
      }: { postcode: string; suburb: string; state: string }
    ): Promise<{ isValid: boolean; message: string }> => {
      try {
        if (!baseUrl || !authToken) {
          throw new Error("API configuration is incomplete");
        }

        // Make a single API call to search by suburb and state
        const url = `${baseUrl}?q=${encodeURIComponent(
          suburb
        )}&state=${encodeURIComponent(state)}`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = (await response.json()) as LocalitiesResponse;

        // Normalize api returns to be an array
        let localities: Locality[] = [];
        if (data.localities?.locality) {
          if (Array.isArray(data.localities.locality)) {
            localities = data.localities.locality;
          } else {
            localities = [data.localities.locality];
          }
        }

        // Check if locality exist given a suburb and a state
        if (localities.length === 0) {
          return {
            isValid: false,
            message: `The suburb ${suburb} does not exist in the state ${state}`,
          };
        }

        // If locality exists between state and suburb then check if
        const matchingPostcode = localities.find(
          (loc: Locality) => loc.postcode.toString() === postcode
        );

        // if postcode doesnt exist within the suburb and state localities, give out postcode does not match error first
        if (!matchingPostcode) {
          return {
            isValid: false,
            message: `The postcode ${postcode} does not match the suburb ${suburb}`,
          };
        }

        // All validations passed
        return {
          isValid: true,
          message: "The postcode, suburb, and state input are valid.",
        };
      } catch (error) {
        console.error("Error validating address:", error);
        const errorMessage =
          error instanceof Error
            ? `Validation error: ${error.message}`
            : "Error validating address. Please try again.";

        return {
          isValid: false,
          message: errorMessage,
        };
      }
    },
  },
};

// Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server);

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
