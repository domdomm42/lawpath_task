import { ApolloServer } from "@apollo/server";
import { typeDefs } from "../../../app/api/graphql/schema";
import { resolvers } from "../../../app/api/graphql/resolvers";
import {
  mockValidLocality,
  mockPartialLocality,
  mockEmptyLocality,
} from "../../__mocks__/data/addressValidation";
import {
  VALIDATE_ADDRESS_QUERY,
  INVALID_ADDRESS_QUERY,
} from "../../__mocks__/queries/addressValidation";

describe("GraphQL Address Validation unit test", () => {
  let server: ApolloServer;

  //-------------------------------------------------------------------------
  // SETUP & TEARDOWN
  //-------------------------------------------------------------------------
  beforeEach(async () => {



    
    server = new ApolloServer({
      typeDefs,
      resolvers: resolvers,
    });

    await server.start();

    // Mock fetch requests so that we don't have to make request to aus post api
    global.fetch = jest.fn();
  });

  // Clear mock and close our mock apollo server
  afterEach(async () => {
    await server.stop();
    jest.clearAllMocks();
  });

  //-------------------------------------------------------------------------
  // SUCCESS CASES
  //-------------------------------------------------------------------------
  describe("Success cases", () => {
    it("should validate a correct Sydney address", async () => {
      // Setup mock response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockValidLocality),
      });

      // Execute query
      const result = await server.executeOperation({
        query: VALIDATE_ADDRESS_QUERY,
        variables: {
          postcode: "2000",
          suburb: "SYDNEY",
          state: "NSW",
        },
      });

      // Assert results
      expect(result.body.kind).toBe("single");
      if (result.body.kind === "single") {
        const data = result.body.singleResult.data;
        expect(data?.validateAddress).toEqual({
          isValid: true,
          message: "The postcode, suburb, and state input are valid.",
        });
      }

      // Verify API was called correctly
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/address?q=SYDNEY&state=NSW",
        expect.objectContaining({
          headers: { Authorization: "Bearer test-token" },
        })
      );
    });
  });

  //-------------------------------------------------------------------------
  // PARTIAL MATCH CASES
  //-------------------------------------------------------------------------
  describe("Partial match cases", () => {
    it("should reject partial suburb name", async () => {
      // Setup mock response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPartialLocality),
      });

      // Execute query
      const result = await server.executeOperation({
        query: INVALID_ADDRESS_QUERY,
        variables: {
          postcode: "2007",
          suburb: "Broadw",
          state: "NSW",
        },
      });

      // Assert results
      expect(result.body.kind).toBe("single");
      if (result.body.kind === "single") {
        const data = result.body.singleResult.data;
        expect(data?.validateAddress).toEqual({
          isValid: false,
          message: "The suburb Broadw does not exist in the state NSW",
        });
      }

      // Verify API was called correctly
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/address?q=Broadw&state=NSW",
        expect.objectContaining({
          headers: { Authorization: "Bearer test-token" },
        })
      );
    });
  });

  //-------------------------------------------------------------------------
  // ERROR CASES
  //-------------------------------------------------------------------------
  describe("Error cases", () => {
    it("should handle API errors gracefully", async () => {
      // Setup mock error response
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      // Execute query
      const result = await server.executeOperation({
        query: VALIDATE_ADDRESS_QUERY,
        variables: {
          postcode: "2000",
          suburb: "SYDNEY",
          state: "NSW",
        },
      });

      // Assert results
      expect(result.body.kind).toBe("single");
      if (result.body.kind === "single") {
        const data = result.body.singleResult.data;
        expect(data?.validateAddress).toEqual({
          isValid: false,
          message: "Validation error: Network error",
        });
      }
    });

    // it("should handle empty results", async () => {
    //   // Setup mock empty response
    //   (global.fetch as jest.Mock).mockResolvedValueOnce({
    //     ok: true,
    //     json: () => Promise.resolve(mockEmptyLocality),
    //   });
    // });
  });
});
