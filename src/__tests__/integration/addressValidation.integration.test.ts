import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "@/app/api/graphql/schema";
import { resolvers } from "@/app/api/graphql/resolvers";
import { LocalitiesAPI } from "@/services/addressValidation/api";
import { VALIDATE_ADDRESS_QUERY } from "@/__tests__/__mocks__/queries/addressValidation";
import dotenv from "dotenv";

dotenv.config();

interface Context {
  dataSources: {
    localities: LocalitiesAPI;
  };
}

describe("Address Validation Integration Tests", () => {
  let serverInstance: ApolloServer<Context>;
  let serverURL: string;

  // Setup a standalone apolloserver
  beforeAll(async () => {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    const { url } = await startStandaloneServer(server, {
      listen: { port: 0 },
      context: async () => ({
        dataSources: {
          localities: new LocalitiesAPI(
            process.env.AUSTRALIA_POST_API_URL ?? "",
            process.env.AUSTRALIA_POST_API_TOKEN ?? ""
          ),
        },
      }),
    });

    serverInstance = server;
    serverURL = url;
  });

  // Close the server
  afterAll(async () => {
    await serverInstance.stop();
  });
  // Skip tests if credentials aren't available
  const itif =
    process.env.AUSTRALIA_POST_API_URL && process.env.AUSTRALIA_POST_API_TOKEN
      ? it
      : it.skip;

  itif("should validate a correct Sydney address", async () => {
    // Make an actual HTTP request to the test server
    const response = await fetch(serverURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: VALIDATE_ADDRESS_QUERY,
        variables: {
          postcode: "2000",
          suburb: "SYDNEY",
          state: "NSW",
        },
      }),
    });

    const result = await response.json();

    // Assert success path
    expect(response.status).toBe(200);
    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
    expect(result.data.validateAddress).toHaveProperty("isValid", true);
    expect(result.data.validateAddress.message).toContain("valid");
  });

  itif("should reject an invalid address combination", async () => {
    const response = await fetch(serverURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: VALIDATE_ADDRESS_QUERY,
        variables: {
          postcode: "2000",
          suburb: "MELBOURNE", // Mismatched suburb for postcode
          state: "NSW",
        },
      }),
    });

    const result = await response.json();

    // Assert error path
    expect(response.status).toBe(200); // GraphQL returns 200 even for business logic errors
    expect(result.data).toBeDefined();
    expect(result.data.validateAddress).toHaveProperty("isValid", false);
    expect(result.data.validateAddress.message).toContain("does not exist");
  });

  it("should return GraphQL errors for API errors", async () => {
    // Make a request that would trigger an API error
    const response = await fetch(serverURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: VALIDATE_ADDRESS_QUERY,
        variables: {
          postcode: "", // Empty postcode might trigger an API error
          suburb: "",
          state: "",
        },
      }),
    });

    const result = await response.json();

    // With GraphQLError handling, we expect:
    // 1. HTTP status is still 200 (GraphQL uses 200 even for errors)
    expect(response.status).toBe(200);

    // 2. The response should have errors array
    expect(result.errors).toBeDefined();
    expect(Array.isArray(result.errors)).toBe(true);
    expect(result.errors.length).toBeGreaterThan(0);

    // 3. The error should have the right structure
    const error = result.errors[0];
    expect(error.message).toContain("Address validation service unavailable");
    expect(error.extensions).toBeDefined();
    expect(error.extensions.code).toBe("SERVICE_UNAVAILABLE");

    // 4. Data should be null when there are errors
    expect(result.data).toBeNull();
  });
});
