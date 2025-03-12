import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { LocalitiesAPI } from "@/services/addressValidation/api";

/**
 * Apollo Server instance for handling GraphQL requests
 * Configured with type definitions and resolvers
 */
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

/**
 * Next.js API handler for GraphQL requests
 * Sets up context with Australia Post API data source
 */
const handler = startServerAndCreateNextHandler(server, {
  /**
   * Creates GraphQL context with data sources for each request
   * Initializes the Australia Post API client with credentials
   *
   * @returns {Promise<{dataSources: {localities: LocalitiesAPI}}>} Context with data sources
   * @throws {Error} If API credentials are not configured
   */
  context: async () => {
    const apiUrl = process.env.AUSTRALIA_POST_API_URL;
    const apiToken = process.env.AUSTRALIA_POST_API_TOKEN;
    const { cache } = server;

    if (!apiUrl || !apiToken) {
      throw new Error("API credentials not configured");
    }

    return {
      dataSources: {
        localities: new LocalitiesAPI(apiUrl, apiToken, { cache }),
      },
    };
  },
});

/**
 * Next.js route handler for GraphQL POST requests
 * Entry point for all GraphQL API calls
 *
 * @param {NextRequest} req - Incoming request object
 * @returns {Promise<Response>} API response
 */
export async function POST(req: NextRequest) {
  return handler(req);
}

/**
 * GET handler for GraphQL endpoint
 * Enables the Apollo Sandbox/GraphQL Playground in the browser
 * This is only needed for development convenience and doesn't affect API functionality
 *
 * @param {NextRequest} req - Incoming request object
 * @returns {Promise<Response>} GraphQL playground interface
 */
export async function GET(req: NextRequest) {
  return handler(req);
}
