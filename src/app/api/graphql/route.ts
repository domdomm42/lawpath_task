import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { LocalitiesAPI } from "@/services/addressValidation/api";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
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

export async function POST(req: NextRequest) {
  return handler(req);
}
