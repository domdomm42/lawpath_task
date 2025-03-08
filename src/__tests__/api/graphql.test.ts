import { ApolloServer } from "@apollo/server";
import { typeDefs } from "../../app/api/graphql/schema";
import { createResolvers } from "../../app/api/graphql/resolvers";

describe("GraphQL Address Validation", () => {
  let server: ApolloServer;

  const mockValidLocality = {
    localities: {
      locality: [
        {
          location: "SYDNEY",
          postcode: "2000",
          state: "NSW",
        },
      ],
    },
  };

  beforeEach(async () => {
    server = new ApolloServer({
      typeDefs,
      resolvers: createResolvers(
        "https://api.example.com/address",
        "test-token"
      ),
    });

    await server.start();
    global.fetch = jest.fn();
  });

  afterEach(async () => {
    await server.stop();
    jest.clearAllMocks();
  });

  it("should validate a correct Sydney address", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockValidLocality),
    });

    const VALIDATE_ADDRESS = `
      query {
        validateAddress(postcode: "2000", suburb: "SYDNEY", state: "NSW") {
          isValid
          message
        }
      }
    `;

    const result = await server.executeOperation({
      query: VALIDATE_ADDRESS,
    });

    expect(result.body.kind).toBe("single");
    if (result.body.kind === "single") {
      const data = result.body.singleResult.data;
      expect(data?.validateAddress).toEqual({
        isValid: true,
        message: "The postcode, suburb, and state input are valid.",
      });
    }

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.example.com/address?q=SYDNEY&state=NSW",
      expect.objectContaining({
        headers: { Authorization: "Bearer test-token" },
      })
    );
  });
});
