import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";

const baseUrl = process.env.AUSTRALIA_POST_API_URL;
const authToken = process.env.AUSTRALIA_POST_API_TOKEN;

const typeDefs = `
  type Locality {
    category: String
    id: Int
    latitude: Float
    location: String
    longitude: Float
    postcode: Int
    state: String
  }

  type Localities {
    locality: [Locality]
  }

  type Query {
    searchPostcode(q: String!, state: String): Localities 
  }
`;

const resolvers = {
  Query: {
    searchPostcode: async (
      _: unknown,
      { q, state }: { q: string; state?: string }
    ) => {
      let url = `${baseUrl}?q=${encodeURIComponent(q)}`;
      if (state) {
        url += `&state=${encodeURIComponent(state)}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      return data.localities;
    },
  },
};

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
