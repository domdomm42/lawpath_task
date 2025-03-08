import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
import { typeDefs } from "./schema";
import { createResolvers } from "./resolvers";

const createApolloServer = () => {
  const baseUrl = process.env.AUSTRALIA_POST_API_URL;
  const authToken = process.env.AUSTRALIA_POST_API_TOKEN;

  if (!baseUrl || !authToken) {
    throw new Error(
      "Missing required environment variables for Australia Post API"
    );
  }

  return new ApolloServer({
    typeDefs,
    resolvers: createResolvers(baseUrl, authToken),
  });
};

const server = createApolloServer();
const handler = startServerAndCreateNextHandler(server);

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}


